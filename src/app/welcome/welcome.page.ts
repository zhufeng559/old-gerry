import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../service/common/storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  slideOpts = {
    speed: 400
  };

  constructor(private router: Router,
    private storage: StorageService) { }

  ngOnInit() {
    this.storage.write('first', true);
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }
}
