import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';


@Component({
  selector: 'app-my',
  templateUrl: './my.page.html',
  styleUrls: ['./my.page.scss'],
})
export class MyPage implements OnInit {

  user ;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    private storage: StorageService) {
    }

  ngOnInit() {
    this.user = this.common.checkLogin();
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
}
