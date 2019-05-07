import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-pay-list',
  templateUrl: './pay-list.page.html',
  styleUrls: ['./pay-list.page.scss'],
})
export class PayListPage implements OnInit {

  list = new Array();
  condition = {
    token : '',
    start_time: '',
    end_time: '',
    keyword: '',
    pages: 1,
    size: 10
  };
  total: number;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute, ) {
    }

  ngOnInit() {
    const user = this.common.checkLogin();
    if (user) {
      this.condition.token = user.token;
    }
  }

  ionViewWillEnter() {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.condition.start_time = params['start_time'] || '' ;
      this.condition.end_time = params['end_time'] || '';
      this.condition.keyword = params['keyword'] || '';
      this.load();
    });
  }

  async load() {
    this.common.showLoading();
    return this.http.post('/request/get_bill_list' , this.condition).toPromise().then(res => {
      this.common.hideLoading();
      const r = res as any;
      if (r.code >= -1) {
        this.total = r.recordsTotal;
        if (this.condition.pages === 1) {
          this.list = r.rows.list;
        } else if (r.rows.list) {
          this.list = this.list.concat(r.rows.list);
        }
        if (this.condition.pages * this.condition.size >= this.total) {
          this.infiniteScroll.disabled = true;
        } else {
          this.infiniteScroll.disabled = false;
        }
      } else {
        this.common.errorSync(`查询错误{${r.resultNode}}`);
      }
    }, err => {
      this.common.requestError(err);
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.condition.pages = 1;
      this.condition.size = 10;
      this.load().then(() => {
        event.target.complete();
      });
    }, 300);
  }

  loadData(event) {
    setTimeout(() => {
      this.condition.pages ++;
      this.load().then(() => {
        event.target.complete();
      });
    }, 300);
  }

  gotoPaySearch() {
    this.router.navigate(['/pay-search']);
  }

}
