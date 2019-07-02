import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController, Events } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my',
  templateUrl: './my.page.html',
  styleUrls: ['./my.page.scss'],
  providers: [DatePipe]
})
export class MyPage implements OnInit {

  user ;
  condition = {
    user_id: '',
    token: '',
  };
  count = 0;
  file_url = '';
  phone = '';

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    private storage: StorageService,
    public datePipe: DatePipe,
    private events: Events ) {
      events.subscribe('new', (file) => {
        this.user = this.common.checkLogin();
        if (this.user) {
          this.condition.token = this.user.token;
          this.condition.user_id = this.user.rows.userId;
        }
        this.http.post('/request/user_detail', {
          user_id: this.user.rows.userId,
          token: this.user.token
        }).toPromise().then(res => {
          const r = res as any;
          if (this.common.isSuccess(r.code)) {
            this.file_url = r.rows.file_url;
            this.phone = r.rows.phone;
          }
        });
        this.load();
      });
    }

  ngOnInit() {
    this.user = this.common.checkLogin();
    if (this.user) {
      this.condition.token = this.user.token;
      this.condition.user_id = this.user.rows.userId;
    }
    this.http.post('/request/user_detail', {
      user_id: this.user.rows.userId,
      token: this.user.token
    }).toPromise().then(res => {
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.file_url = r.rows.file_url;
        this.phone = r.rows.phone;
      }
    });
    this.load();
  }

  ionViewDidEnter () {
    console.log('MyPage');
  }

  async load() {
    this.http.post('/request/order_message' , this.condition).toPromise().then(res => {
      const r = res as any;
      this.count = r.count || 0;
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
    this.router.navigate(['/change-password2'], {
      queryParams: {
        phone: this.user.rows.phone,
      }
    });
  }
}
