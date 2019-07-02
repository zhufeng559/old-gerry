import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController, ActionSheetController, Events } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  providers: [DatePipe]
})
export class OrderPage implements OnInit {

  type = '1';
  model = {
    user_id: '',
    user_name: '',
    ladingBillNumber: '',
    ctnNo: '',
    file_id: '',
    file_url: '',
    token: '',
    file_name: '',
  };
  addImage = 'assets/image/addImage.png';
  UPLOAD_URL = environment.UPLOAD_URL;
  @ViewChild('form') form: NgForm;
  options: CameraOptions = {
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: false,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: false,
    quality: 50,
  };

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    private storage: StorageService,
    private actionSheetCtrl: ActionSheetController,
    public events: Events,
    private camera: Camera,
    private transfer: FileTransfer,
    private sanitizer: DomSanitizer,
    public datePipe: DatePipe, ) {
      events.subscribe('new', (file) => {
        this.type = '1';
      });

      events.subscribe('deleteImg', () => {
        this.model.file_url = '';
        this.model.file_id = '';
        this.model.file_name = '';
      });
    }

  fileTransfer: FileTransferObject = this.transfer.create();

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    switch (this.type) {
      case '1':
        this.router.navigate(['/tabs/order']);
        break;
      case '2':
        this.router.navigate(['/order-history']);
        break;
      case '3':
        this.router.navigate(['/pay-list']);
        break;
    }
  }

  takePhoto() {
    this.camera.getPicture(this.options).then((uri) => {
      const fo: FileUploadOptions = {
        fileKey: 'files',
        fileName: `${this.datePipe.transform(new Date(), 'yyyyMMddhhmmss')}.jpg`,
        headers: {}
     };
     this.common.showLoading().then(() => {
      this.fileTransfer.upload(uri, this.UPLOAD_URL, fo)
      .then((data) => {
        this.common.hideLoading();
        const result = JSON.parse(data.response);
        if (this.common.isSuccess(result.code)) {
          this.model.file_id = result.rows.file_id;
          this.model.file_url = result.rows.file_url;
          this.model.file_name = result.rows.original_name;
          this.common.success('上传成功');
        } else {
          this.common.errorSync(`上传错误{${result.resultNode}}`);
        }
      }, (err) => {
        this.common.errorSync(`未拍摄照片${err.message}`);
      });
     }).catch(err => {
      this.common.errorSync(`未拍摄照片${err.message}`);
     });
     });
  }

  ionViewDidEnter () {
    console.log('OrderPage');
    this.type = '1';
    this.model.file_url = this.storage.read('order_image');
    if (!this.model.file_url) {
      this.model.file_id = '';
      this.model.file_name = '';
    }
    const user = this.common.checkLogin();
    if (user) {
      this.model.token = user.token;
      this.model.user_id = user.rows.userId;
    }
    this.model.ctnNo = '';
    this.model.ladingBillNumber = '';
    this.model.file_id = '';
    this.model.file_url = '';
    this.model.file_name = '';
    this.form.reset();
  }

  async submit() {
    if (this.model.file_id == '') {
      this.common.errorSync('请上传图片');
      return;
    }
    if (this.form.valid) {
      await this.common.showLoading();
      this.http.post('/request/create_order', this.model).subscribe(res => {
        this.common.hideLoading();
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.model.ctnNo = '';
          this.model.ladingBillNumber = '';
          this.model.file_id = '';
          this.model.file_url = '';
          this.model.file_name = '';
          this.storage.write('order_image', '');
          this.form.reset();
          this.common.success();
        } else {
          this.common.errorSync(`建单错误{${r.resultNode}}`);
        }
      }, err => {
        this.common.requestError(err);
      });
    } else {
      this.common.errorSync('请完整填写信息');
    }
  }

  async upload() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: '请选择',
      buttons: [{
          icon: 'camera',
          text: '打开相机',
          handler: () => {
            this.takePhoto();
          }
        }, {
          icon: 'image',
          text: '打开相册',
          handler: () => {
            document.getElementById('imageUpload1').click();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async imageUpload(element: any) {
    if (element.files == null || element.files.length < 1) {
      return;
    }
    await this.common.showLoading();
    const fd = new FormData();
    for (let i = 0, len = element.files.length; i < len; i++) {
      const file = element.files[i];
        fd.append(file.type, file);
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (evt: any, ) => {
          const result = JSON.parse(evt.target.responseText);
          this.common.hideLoading();
          if (this.common.isSuccess(result.code)) {
            this.model.file_id = result.rows.file_id;
            this.model.file_url = result.rows.file_url;
            this.model.file_name = result.rows.original_name;
            this.common.success('上传成功');
          } else {
            this.common.errorSync(`上传错误{${result.resultNode}}`);
          }
        }, false);
        xhr.open('post', this.UPLOAD_URL);
        xhr.send(fd);
    }
  }

  gotoImageDetail() {
    this.storage.write('order_image', this.model.file_url);
    this.router.navigate(['/image-detail'], {
      queryParams: {
        nodelete : 1
      }
    });
  }

  setSafe(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
