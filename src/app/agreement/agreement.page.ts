import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../../service/common/storage.service';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.page.html',
  styleUrls: ['./agreement.page.scss'],
})
export class AgreementPage implements OnInit {

  constructor(public router: Router,
    public storage: StorageService,
    public nav: NavController ) { }

  ngOnInit() {
  }

  submit () {
    this.storage.write('agree', 1);
    this.router.navigate(['/register']);
  }

  back() {
    this.nav.pop();
  }
}
