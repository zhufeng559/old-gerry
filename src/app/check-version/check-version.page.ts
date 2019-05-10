import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-check-version',
  templateUrl: './check-version.page.html',
  styleUrls: ['./check-version.page.scss'],
  providers: [DatePipe]
})
export class CheckVersionPage implements OnInit {

  user ;
  model ;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public datePipe: DatePipe, ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter () {
    this.user = this.common.checkLogin();
    this.http.post('/request/check_update', {
      token: this.user.token
    }).subscribe(res => {
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.model = r.rows;
      } else {
        this.common.errorSync(`查询版本号错误{${r.resultNode}}`);
      }
    }, err => {
      this.common.requestError(err);
    });
  }

  back() {
    this.router.navigate(['/tabs/my']);
  }
}
