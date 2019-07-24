import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { NavController, Events } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { StorageService } from '../../service/common/storage.service';

@Component({
  selector: 'app-order-search',
  templateUrl: './order-search.page.html',
  styleUrls: ['./order-search.page.scss'],
  providers: [DatePipe]
})
export class OrderSearchPage implements OnInit {

  model = {
    create_time: '',
    keyword: '',
    state: '-1'
  };
  nosend = true;
  send = true;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public datePipe: DatePipe,
    public storage: StorageService,
    public nav: NavController,
    private events: Events ) {
    }

  ngOnInit() {
  }

  async ionViewDidEnter () {
    console.log('OrderSearchPage');
    const params = this.storage.read<{
      create_time: string,
      keyword: string,
      state: string
    }>('order_search');
    if (params) {
      this.model = params;
      if (this.model.state == '1') {
        this.nosend = true;
        this.send = false;
      }
      if (this.model.state == '2') {
        this.nosend = false;
        this.send = true;
      }
      if (this.model.state == '-1') {
        this.nosend = true;
        this.send = true;
      }
    }
  }

  submit() {
    if (this.nosend && this.send) {
      this.model.state = '-1';
    } else if (this.nosend) {
      this.model.state = '1';
    } else if (this.send) {
      this.model.state = '2';
    }
    this.storage.write('order_search', {
      state: this.model.state,
      keyword: this.model.keyword,
      create_time: this.datePipe.transform(this.model.create_time, 'yyyy-MM-dd'),
    });
    this.events.publish('reload');
    this.nav.pop();
  }

  back() {
    this.nav.pop();
  }
}
