import { Component, ViewChildren, QueryList } from '@angular/core';

import { AlertController, IonRouterOutlet } from '@ionic/angular';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationStart } from '@angular/router';
import { StorageService } from '../service/common/storage.service';

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
    private nav: NavController
  ) {
    this.initializeApp();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if ((<NavigationStart>event).url.indexOf('welcome') < 0) {
          if (!this.storage.read<boolean>('first')) {
            this.nav.navigateRoot('welcome');
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
