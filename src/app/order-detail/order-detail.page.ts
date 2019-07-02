import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ActionSheetController, NavController, Events } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  providers: [DatePipe]
})
export class OrderDetailPage implements OnInit {

  condition = {
    id: '',
    token: ''
  };

  model = {
    create_time: '',
    creator: '',
    ctnno: '',
    file_id: '',
    file_url: '',
    file_name: '',
    id: 0,
    ladingbillnumber: '',
    bill_no: '',
    app_state: '',
    reason: '',
  };
  addImage = 'assets/image/addImage.png';
  stateDesc = '';
  UPLOAD_URL = environment.UPLOAD_URL;
  @ViewChild('form') form: NgForm;
  user;
  type;
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
    private actionSheetCtrl: ActionSheetController,
    public nav: NavController,
    public storage: StorageService,
    private camera: Camera,
    private transfer: FileTransfer,
    private sanitizer: DomSanitizer,
    public datePipe: DatePipe,
    public events: Events ) {
      events.subscribe('deleteImg', () => {
        this.model.file_url = '';
        this.model.file_id = '';
        this.model.file_name = '';
      });
  }

  fileTransfer: FileTransferObject = this.transfer.create();

  ngOnInit() {
  }

  ionViewDidEnter () {
    this.user = this.common.checkLogin();
    this.condition.token = this.user.token;
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.condition.id = params['id'] || '' ;
      this.type = params['type'] || '' ;
      this.load();
    });
  }

  async load() {
    await this.common.showLoading();
    return this.http.post('/request/order_detail', this.condition).toPromise().then(res => {
      this.common.hideLoading();
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.model = r.rows;
        this.stateDesc = this.common.getStatusDesc(this.model.app_state);
        this.model.file_id = '';
        this.model.file_url = '';
        this.model.file_name = '';
      } else {
        this.common.errorSync(`获取订单详情失败{${r.resultNode}}`);
      }
    }, err => {
      this.common.errorSync(`获取订单详情失败{${err.message}}`);
    });
  }

  async submit() {
    if (this.model.file_id == '') {
      this.common.errorSync('请上传图片');
      return;
    }
    if (this.form.valid) {
      const model = {
        id: this.condition.id,
        user_id: this.user.rows.userId,
        user_name: this.user.rows.userName,
        ladingBillNumber: this.model.ladingbillnumber,
        ctnNo: this.model.ctnno,
        file_id: this.model.file_id,
        file_url: this.model.file_url,
        file_name: this.model.file_name,
        token: this.user.token
      };
      await this.common.showLoading();
      let url = '';
      if (this.type == 1) {
        url = '/request/re_send_order';
      } else if (this.type == 2) {
        url = '/request/change_order';
      }
      this.http.post(url, model).subscribe(res => {
        this.common.hideLoading();
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.common.success();
          this.nav.pop();
        } else {
          this.common.errorSync(`{${r.resultNode}}`);
        }
      }, err => {
        this.common.errorSync(`{${err.message}}`);
      });
    } else {
      this.common.errorSync('请完整填写信息');
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
            document.getElementById('imageUpload2').click();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  imageUpload(element: any) {
    if (element.files == null || element.files.length < 1) {
      return;
    }
    const fd = new FormData();
    for (let i = 0, len = element.files.length; i < len; i++) {
      const file = element.files[i];
        fd.append(file.type, file);
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (evt: any, ) => {
          const result = JSON.parse(evt.target.responseText);
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
    this.router.navigate(['/image-detail']);
  }

  setSafe(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  back() {
    this.nav.pop();
  }
}
