import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController, Events, IonInfiniteScroll } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { StorageService } from '../../service/common/storage.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  providers: [DatePipe]
})
export class OrderPage implements OnInit {

  type = 'order';
  list1 = new Array();
  condition1 = {
    token : '',
    create_time: '',
    reason: '',
    keyword: '',
    user_id: '',
    state: '-1',
    pages: 1,
    size: 10
  };
  total1: number;

  list2 = new Array();
  condition2 = {
    token : '',
    user_id : '',
    start_date: '',
    end_date: '',
    keyword: '',
    pages: 1,
    size: 10,
  };
  total2: number;
  interval;
  user;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(private http: HttpService,
    public common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public events: Events,
    private sanitizer: DomSanitizer,
    public storage: StorageService,
    public datePipe: DatePipe, ) {
    }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.user = this.common.checkLogin();
    if (this.user) {
      this.condition1.token = this.user.token;
      this.condition1.user_id = this.user.rows.userId;
    }
    if (this.user) {
      this.condition2.token = this.user.token;
      this.condition2.user_id = this.user.rows.userId;
    }
    if (this.type === 'order') {
      const params = this.storage.read<{
        create_time: string,
        keyword: string,
        state: string
      }>('order_search');
      if (params) {
        this.condition1.create_time = params.create_time || '' ;
        this.condition1.state = params.state || '-1';
        this.condition1.keyword = params.keyword || '';
      }
    }
    if (this.type === 'bill') {
      const params = this.storage.read<{
        start_date: string,
        end_date: string,
        keyword: string
      }>('pay_search');
      if (params) {
        this.condition2.start_date = params.start_date || this.datePipe.transform(new Date(), 'yyyy-MM-01') ;
        this.condition2.end_date = params.end_date || this.datePipe.transform(new Date(), 'yyyy-MM-dd') ;
        this.condition2.keyword = params.keyword || '';
      }
    }
    this.load(true);
  }

  segmentChanged(ev: any) {
    this.reload();
  }

  setSafe(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  ionViewDidLeave() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  async load(refreash = false) {
    if (refreash) {
      if (this.type === 'order') {
        this.list1 = new Array();
        this.condition1.pages = 1;
        this.http.post('/request/get_order_list' , this.condition1).toPromise().then(res => {
          const r = res as any;
          if (this.common.isSuccess(r.code)) {
            this.total1 = r.recordsTotal;
            if (this.condition1.pages === 1) {
              this.list1 = r.rows.list;
            } else if (r.rows.list) {
              this.list1 = this.list1.concat(r.rows.list);
            }
            this.countTime();
            if (this.condition1.pages * this.condition1.size >= this.total1) {
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
      if (this.type === 'bill') {
        this.list2 = new Array();
        this.condition2.pages = 1;
        this.http.post('/request/get_bill_list' , this.condition2).toPromise().then(res => {
          const r = res as any;
          if (this.common.isSuccess(r.code)) {
            this.total2 = r.draw || 0;
            if (this.condition2.pages === 1) {
              this.list2 = r.rows.list || [];
            } else if (r.rows.list) {
              this.list2 = this.list2.concat(r.rows.list);
            }
            if (this.condition2.pages * this.condition2.size >= this.total2) {
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
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      if (this.type === 'order') {
        this.condition1.pages = 1;
        this.condition1.size = 10;
      }
      if (this.type === 'bill') {
        this.condition2.pages = 1;
        this.condition2.size = 10;
      }
      this.load(true).then(() => {
        event.target.complete();
      });
    }, 300);
  }

  loadData(event) {
    setTimeout(() => {
      if (this.type === 'order') {
        this.condition1.pages ++;
      }
      if (this.type === 'bill') {
        this.condition2.pages ++;
      }
      this.load().then(() => {
        event.target.complete();
      });
    }, 300);
  }

  getStatus(item) {
    return this.common.getStatusDesc(item.state);
  }

  gotoOrderSearch() {
    this.router.navigate(['/order-search']);
  }

  gotoOrderDetail(id) {
    this.router.navigate(['/order-view'], {
      queryParams: {
        id: id
      }
    });
  }

  back() {
    this.router.navigate(['/tabs/order']);
  }

  async cancelOrder(item) {
    await this.common.showLoading();
    this.http.post('/request/cancel_order' ,
    {
      user_id: this.condition1.user_id,
      id: item.id,
      token: this.user.token
    }).toPromise().then(res => {
      this.common.hideLoading();
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.common.success();
        this.load(true);
      } else {
        this.common.errorSync(`取消订单失败{${r.resultNode}}`);
      }
    }, err => {
      this.common.requestError(err);
    });
  }

  async reSendOrder(item) {
    this.router.navigate(['/order-detail'], {
      queryParams: {
        id: item.id,
        type: 1
      }
    });
  }

  async changeOrder(item) {
    this.router.navigate(['/order-detail'], {
      queryParams: {
        id: item.id,
        type: 2
      }
    });
  }

  countTime() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      const time1 = new Date().getTime();
      this.list1.forEach((item) => {
        const time2 = new Date(item.create_time).getTime() + 120 * 1000;
        if (time2 >= time1) {
          const seconds = ((time2 - time1) / 1000).toFixed(0);
          item.left = seconds;
        }
      });
    }, 1000);
  }
}
