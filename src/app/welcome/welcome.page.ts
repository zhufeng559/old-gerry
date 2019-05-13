import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../service/common/storage.service';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  slideOpts = {
  };

  constructor(private router: Router,
    private storage: StorageService,
    private nav: NavController) { }

  ngOnInit() {
    this.storage.write('first', true);
  }

  gotoLogin() {
    this.nav.navigateRoot('login');
  }
}
