import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageService } from '../../service/common/storage.service';
import { NavController, Events } from '@ionic/angular';

@Component({
  selector: 'app-pay-search',
  templateUrl: './pay-search.page.html',
  styleUrls: ['./pay-search.page.scss'],
  providers: [DatePipe]
})
export class PaySearchPage implements OnInit {

  model = {
    start_date: this.datePipe.transform(new Date(), 'yyyy-MM-01'),
    end_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    keyword: '',
  };

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

  ionViewDidEnter () {
    console.log('PaySearchPage');
    const params = this.storage.read<{
      start_date: string,
      end_date: string,
      keyword: string
    }>('pay_search');
    if (params) {
      this.model = params;
    }
  }

  submit() {
    this.storage.write('pay_search', {
      keyword: this.model.keyword,
      start_time: this.datePipe.transform(this.model.start_date, 'yyyy-MM-dd'),
      end_time: this.datePipe.transform(this.model.end_date, 'yyyy-MM-dd'),
    });
    this.events.publish('reload');
    this.nav.pop();
  }

  back() {
    this.nav.pop();
  }
}
