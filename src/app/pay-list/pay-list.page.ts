import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { StorageService } from '../../service/common/storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pay-list',
  templateUrl: './pay-list.page.html',
  styleUrls: ['./pay-list.page.scss'],
  providers: [DatePipe]
})
export class PayListPage implements OnInit {

  list = new Array();
  condition = {
    token : '',
    user_id : '',
    start_date: '',
    end_date: '',
    keyword: '',
    pages: 1,
    size: 10,
  };
  total: number;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(private http: HttpService,
    public common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public storage: StorageService,
    public datePipe: DatePipe, ) {
    }

  ngOnInit() {
  }

  async ionViewDidEnter () {
    await this.common.showLoading();
    const user = this.common.checkLogin();
    if (user) {
      this.condition.token = user.token;
      this.condition.user_id = user.rows.userId;
    }
    console.log('PayListPage');
    const params = this.storage.read<{
      start_date: string,
      end_date: string,
      keyword: string
    }>('pay_search');
    if (params) {
      this.condition.start_date = params.start_date || this.datePipe.transform(new Date(), 'yyyy-MM-01') ;
      this.condition.end_date = params.end_date || this.datePipe.transform(new Date(), 'yyyy-MM-dd') ;
      this.condition.keyword = params.keyword || '';
    }
    this.load(true);
  }

  ionViewDidLeave() {
    this.condition.start_date = '' ;
    this.condition.end_date = '';
    this.condition.keyword = '';
    this.storage.remove('pay_search');
  }

  async load(refreash = false) {
    this.common.showLoading();
    if (refreash) {
      this.list = new Array();
      this.condition.pages = 1;
    }
    return this.http.post('/request/get_bill_list' , this.condition).toPromise().then(res => {
      this.common.hideLoading();
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.total = r.draw || 0;
        if (this.condition.pages === 1) {
          this.list = r.rows.list || [];
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
      this.load(true).then(() => {
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

  back() {
    this.router.navigate(['/tabs/order']);
  }
}
