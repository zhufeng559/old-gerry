import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-my',
  templateUrl: './my.page.html',
  styleUrls: ['./my.page.scss'],
})
export class MyPage implements OnInit {

  user ;
  UPLOAD_URL = environment.UPLOAD_URL;
  model = {
    user_name: '',
    sex: '',
    phone: '',
    nickName: '',
    nickname: '',
    birthdate: '',
    id_number: '',
    identity_card: '',
    userId: '',
    token: '',
    file_id: '',
    file_url: ''
  };

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    private storage: StorageService,
    private actionSheetCtrl: ActionSheetController) {
    }

  ngOnInit() {
  }

  ionViewDidEnter () {
    console.log('MyPage');
    this.user = this.common.checkLogin();
    this.http.post('/request/user_detail', {
      userId: this.user.rows.userId,
      token: this.user.token
    }).toPromise().then(res => {
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.model = r.rows;
        this.model.userId = this.user.userId;
        this.model.token = this.user.token;
        this.model.id_number = this.model.identity_card;
        this.model.nickName = this.model.nickname;
      }
    });
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: '退出登录',
      message: '确定退出登录吗?',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        }, {
          text: '确定',
          handler: () => {
            this.storage.remove('user');
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  gotoPersonInfo() {
    this.router.navigate(['/person-info']);
  }

  gotoCheckVersion() {
    this.router.navigate(['/check-version']);
  }

  gotoMyMessage() {
    this.router.navigate(['/my-message']);
  }

  gotoFeedBack() {
    this.router.navigate(['/feedback']);
  }

  gotoChangePassword() {
    this.router.navigate(['/change-password'], {
      queryParams: {
        phone: this.user.rows.phone,
      }
    });
  }

  async upload() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: '请选择',
      buttons: [{
          icon: 'camera',
          text: '打开相机',
          handler: () => {
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
          if (result.code >= 0) {
            this.common.success('上传成功').then(() => {
              this.model.file_id = result.rows.file_id;
              this.model.file_url = result.rows.file_url;
              setTimeout(() => {
                this.submit();
              }, 100);
            });
          } else {
            this.common.errorSync(`上传错误{${result.resultNode}}`);
          }
        }, false);
        xhr.open('post', this.UPLOAD_URL);
        xhr.send(fd);
    }
  }

  async submit() {
      await this.common.showLoading();
      this.http.post('/request/fill_person_info', this.model).subscribe(res => {
        this.common.hideLoading();
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.common.success();
        } else {
          this.common.errorSync(`保存用户信息错误{${r.resultNode}}`);
        }
      }, err => {
        this.common.requestError(err);
      });
    }
}
