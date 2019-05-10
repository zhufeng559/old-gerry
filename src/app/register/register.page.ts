import { Component, OnInit, ViewChild } from '@angular/core';
import { IonButton } from '@ionic/angular';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { StorageService } from '../../service/common/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  model = {
    phone: '',
    password: '',
    name: ''
  };
  code = '';
  text = '获取验证码';
  agreement = '《注册协议》';
  countdown = 60;
  @ViewChild('btnCode') btnCode: IonButton;
  @ViewChild('form') form: NgForm;
  agree = false;
  eye = true;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public storage: StorageService ) {
    }

  ngOnInit() {
  }

  ionViewDidEnter () {
    const agree = this.storage.read('agree');
    if (agree == 1) {
      this.agree = true;
    }
  }

  async submit() {
    if (!this.agree) {
      this.common.errorSync(`需同意注册协议才可注册`);
    }
    if (this.form.valid) {
      await this.common.showLoading();
      this.http.post('/request/register', this.model).subscribe(res => {
        this.common.hideLoading();
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.common.success('注册成功,正在为您跳转至登录页...').then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          this.common.errorSync(`注册错误{${r.resultNode}}`);
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
      type : 0
    };
    this.setTime();
    await this.common.showLoading();
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
