import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  condition = {
    id: '',
    token: ''
  };

  user;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute, ) {
    }

  ngOnInit() {
    this.user = this.common.checkLogin();
    this.condition.token = this.user.token;
  }

  ionViewWillEnter() {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.condition.id = params['id'] || '' ;
      this.load();
    });
  }

  load() {
    return this.http.post('/request/order_detail', this.condition).toPromise().then(res => {
      const r = res as any;
    });
  }

  submit() {
  }

}
