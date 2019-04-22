import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  type = '1';

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    private storage: StorageService) {
    }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    switch (this.type) {
      case '1':
        this.router.navigate(['/tabs/order']);
        break;
      case '2':
        this.router.navigate(['/order-history']);
        break;
      case '3':
        this.router.navigate(['/pay-list']);
        break;
    }
  }

  ionViewWillEnter() {
    debugger;
    this.type = '1';
  }
}
