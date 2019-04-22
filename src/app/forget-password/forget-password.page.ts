import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

  phone = '';

  constructor(public router: Router, ) { }

  ngOnInit() {
  }

  submit() {
    this.router.navigate(['/change-password'], {
      queryParams: {
        phone: this.phone
      }
    });
  }
}
