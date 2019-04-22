import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.page.html',
  styleUrls: ['./agreement.page.scss'],
})
export class AgreementPage implements OnInit {

  constructor(public router: Router, ) { }

  ngOnInit() {
  }

  submit () {
    this.router.navigate(['/register'], {
      queryParams: {
        agree: true
      }
    });
  }
}
