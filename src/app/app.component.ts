import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
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
    private storage: StorageService
  ) {
    this.initializeApp();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if ((<NavigationStart>event).url.indexOf('welcome') < 0) {
          if (!this.storage.read<boolean>('first')) {
            this.router.navigate(['/welcome']);
          }
        }
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
