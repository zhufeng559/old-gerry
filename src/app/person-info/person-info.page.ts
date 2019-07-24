import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-person-info',
  templateUrl: './person-info.page.html',
  styleUrls: ['./person-info.page.scss'],
  providers: [DatePipe]
})
export class PersonInfoPage implements OnInit {

  model = {
    user_name: '',
    sex: '',
    phone: '',
    nickName: '',
    nickname: '',
    birthdate: '',
    id_number: '',
    identity_card: '',
    user_id: '',
    token: '',
    file_id: '',
    file_url: '',
    LicensePlate: '',
    DrivingPermit_id: '',
    HangPlate: '',
  };
  @ViewChild('form') form: NgForm;
  user;
  UPLOAD_URL = environment.UPLOAD_URL;

  options: CameraOptions = {
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: false,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: true,
    quality: 50,
  };

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private camera: Camera,
    private transfer: FileTransfer,
    public datePipe: DatePipe,
    private actionSheetCtrl: ActionSheetController ) {
    }

  fileTransfer: FileTransferObject = this.transfer.create();


  ngOnInit() {
    this.user = this.common.checkLogin();
    this.http.post('/request/user_detail', {
      user_id: this.user.rows.userId,
      token: this.user.token
    }).toPromise().then(res => {
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.model = r.rows;
        this.model.user_id = this.user.rows.userId;
        this.model.token = this.user.token;
        this.model.id_number = this.model.identity_card;
        this.model.nickName = this.model.nickname;
        this.model.LicensePlate = this.model.LicensePlate || '';
        this.model.DrivingPermit_id = this.model.DrivingPermit_id || '';
        this.model.HangPlate = this.model.HangPlate || '';
      }
    });
  }

  async submit() {
    if (this.form.valid) {
      this.model.birthdate = this.datePipe.transform(this.model.birthdate, 'yyyy-MM-dd');
      await this.common.showLoading();
      this.http.post('/request/fill_person_info', this.model).subscribe(res => {
        this.common.hideLoading();
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.common.success();
          this.router.navigate(['/tabs/my']);
        } else {
          this.common.errorSync(`保存用户信息错误{${r.resultNode}}`);
        }
      }, err => {
        this.common.requestError(err);
      });
    } else {
      this.common.errorSync('请完整填写信息');
    }
  }

  back() {
    this.router.navigate(['/tabs/my']);
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
            document.getElementById('imageUpload3').click();
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
            console.log(result.rows.file_url);
            this.common.success('上传成功');
          } else {
            this.common.errorSync(`上传错误{${result.resultNode}}`);
          }
        }, false);
        xhr.open('post', this.UPLOAD_URL);
        xhr.send(fd);
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
            console.log(result.rows.file_url);
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
}
