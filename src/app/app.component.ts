import { Component, ViewChildren, QueryList } from '@angular/core';

import { AlertController, IonRouterOutlet } from '@ionic/angular';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationStart } from '@angular/router';
import { StorageService } from '../service/common/storage.service';
import { CommonService } from '../service/common/common.service';
import { HttpService } from '../service/common/http.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage: StorageService,
    private alertCtrl: AlertController,
    private nav: NavController,
    private common: CommonService,
    private http: HttpService
  ) {
    this.initializeApp();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if ((<NavigationStart>event).url.indexOf('welcome') < 0) {
          if (!this.storage.read<boolean>('first')) {
            this.nav.navigateRoot('welcome');
          }
        }
        if ((<NavigationStart>event).url.indexOf('login') < 0) {
          const user = this.common.checkLogin();
          if ( user && user.rows) {
            this.http.post('/request/user_detail', {
              userId: user.rows.userId,
              token: user.token
            }).toPromise().then(res => {
              const r = res as any;
              if (!this.common.isSuccess(r.code)) {
                this.common.errorSync('登录已过期');
                this.nav.navigateRoot('login');
              }
            });
          }
        }
      }
    });
  }

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        setTimeout(() => {
          this.splashScreen.hide();
        }, 500);
        this.backButtonEvent();
      }
    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
            outlet.pop();
        } else {
          this.alertCtrl.create({
            header: '退出系统',
            message: '确定退出系统?',
            buttons: [
              {
                text: '取消',
                handler: () => {
                }
              }, {
                text: '确定',
                handler: () => {
                  navigator['app'].exitApp();
                }
              }
            ]
          }).then(alert => {
            alert.present();
          });
        }
      });
    });
  }
}
