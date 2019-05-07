import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  model = {
    userName: '',
    password: ''
  };
  eye = true;
  @ViewChild('form') form: NgForm;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    private storage: StorageService) {
    }


  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      await this.common.showLoading();
      this.http.post('/request/login', this.model).subscribe(res => {
        this.common.hideLoading();
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.common.success('登录成功').then(() => {
            this.storage.write('user', r );
            this.router.navigate(['/tabs']);
          });
        } else {
          this.alertCtrl.create({
            header: '登录失败',
            message: '您输入的账号或密码错误，请重新输入',
            buttons: [
              {
                text: '忘记密码',
                handler: () => {
                  this.router.navigate(['/forget-password']);
                }
              }, {
                text: '重新输入',
                handler: () => {
                  this.model.password = '';
                }
              }
            ]
          }).then(alert => {
            alert.present();
          });
        }
      }, err => {
        this.common.requestError(err);
      });
    } else {
      this.common.errorSync('请完整填写信息');
    }
  }
}
