import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pay-search',
  templateUrl: './pay-search.page.html',
  styleUrls: ['./pay-search.page.scss'],
  providers: [DatePipe]
})
export class PaySearchPage implements OnInit {

  model = {
    start_date: '',
    end_date: '',
    keyword: '',
  };

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public datePipe: DatePipe, ) {
    }

  ngOnInit() {
  }

  submit() {
    this.router.navigate(['/pay-list'], {
      queryParams: {
        keyword: this.model.keyword,
        start_time: this.datePipe.transform(this.model.start_date, 'yyyy-MM-dd'),
        end_time: this.datePipe.transform(this.model.end_date, 'yyyy-MM-dd'),
      }
    });
  }

}
