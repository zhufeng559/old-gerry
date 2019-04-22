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
      this.http.post('/request/login', this.model).subscribe(res => {
        const r = res as any;
        if (r.code >= 0) {
          this.common.success().then(() => {
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
                  this.router.navigate(['/tabs']);
                }
              }, {
                text: '重新输入',
                handler: () => {
                  this.model.userName = '';
                  this.model.password = '';
                }
              }
            ]
          }).then(alert => {
            alert.present();
          });
        }
      });
    } else {
      this.common.errorSync('请完整填写信息');
    }
  }
}
