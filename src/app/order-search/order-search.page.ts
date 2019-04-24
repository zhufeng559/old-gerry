import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-search',
  templateUrl: './order-search.page.html',
  styleUrls: ['./order-search.page.scss'],
  providers: [DatePipe]
})
export class OrderSearchPage implements OnInit {

  model = {
    create_time: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    keyword: '',
    state: 0
  };
  nosend = true;
  send = true;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public datePipe: DatePipe, ) {
    }

  ngOnInit() {
  }

  submit() {
    let state = 0;
    if (this.nosend && this.send) {
      state = 0;
    } else {
      if (this.send) {
        state = 1;
      }
      if (this.nosend) {
        state = 2;
      }
    }

    this.router.navigate(['/order-history'], {
      queryParams: {
        state: state,
        keyword: this.model.keyword,
        create_time: this.datePipe.transform(this.model.create_time, 'yyyy-MM-dd'),
      }
    });
  }
}
