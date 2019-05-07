import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../service/common/common.service';
import { HttpService } from '../../service/common/http.service';
import { NgForm } from '@angular/forms';
import { IonButton } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  model = {
    phone : '',
    password : '',
    code : ''
  };
  code = '';
  text = '获取验证码';
  countdown = 60;
  eye = true;
  @ViewChild('btnCode') btnCode: IonButton;
  @ViewChild('form') form: NgForm;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute, ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.model.phone = params['phone'] ;
    });
  }

  async submit() {
    if (!this.model.phone) {
      this.common.errorSync('请完整填写信息');
      return;
    }
    if (this.form.valid) {
      this.common.showLoading();
      this.http.post('/request/forget_password', this.model).subscribe(res => {
        this.common.hideLoading();
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.common.success('修改成功,正在为您跳转至登录页...').then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          this.common.errorSync(`修改密码错误{${r.resultNode}}`);
        }
      }, err => {
        this.common.requestError(err);
      });
    } else {
      this.common.errorSync('请完整填写信息');
    }
  }

  async sendCode() {
    if (!this.model.phone) {
      this.common.errorSync('请填写完整的手机号码');
      return;
    }
    const i = {
      phone : this.model.phone,
      type : 1
    };
    this.setTime();
    this.common.showLoading();
    this.http.post('/request/send_message', i).subscribe(res => {
      this.common.hideLoading();
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.common.success('验证码已发送，请注意查收');
      } else {
        this.common.errorSync(`发送验证码错误{${r.resultNode}}`);
      }
    }, err => {
      this.common.requestError(err);
    });
  }

  async setTime() {
    if (this.countdown === 0) {
      this.btnCode.disabled = false;
      this.text = '获取验证码';
      this.countdown = 60;
        return;
    } else {
      this.btnCode.disabled = true;
      this.text = `重新发送(${this.countdown})`;
      this.countdown--;
    }
    setTimeout(() => {
      this.setTime();
    }, 1000);
  }

}
