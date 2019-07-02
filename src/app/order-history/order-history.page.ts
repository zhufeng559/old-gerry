import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { StorageService } from '../../service/common/storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
  providers: [DatePipe]
})
export class OrderHistoryPage implements OnInit {

  list = new Array();
  condition = {
    token : '',
    create_time: '',
    reason: '',
    keyword: '',
    user_id: '',
    state: '-1',
    pages: 1,
    size: 10
  };
  total: number;
  time: Date;
  interval;
  user;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(private http: HttpService,
    public common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public storage: StorageService,
    public datePipe: DatePipe ) {
    }

  ngOnInit() {
    this.user = this.common.checkLogin();
    if (this.user) {
      this.condition.token = this.user.token;
      this.condition.user_id = this.user.rows.userId;
    }
  }

  async ionViewDidEnter () {
    await this.common.showLoading();
    console.log('OrderHistoryPage');
    const params = this.storage.read<{
      create_time: string,
      keyword: string,
      state: string
    }>('order_search');
    if (params) {
      this.condition.create_time = params.create_time || '' ;
      this.condition.state = params.state || '-1';
      this.condition.keyword = params.keyword || '';
    }
    this.load(true);
  }

  ionViewDidLeave() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  async load(refreash = false) {
    if (refreash) {
      this.list = new Array();
      this.condition.pages = 1;
    }
    return this.http.post('/request/get_order_list' , this.condition).toPromise().then(res => {
      this.common.hideLoading();
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.total = r.recordsTotal;
        this.time = new Date(r.time);
        if (this.condition.pages === 1) {
          this.list = r.rows.list;
        } else if (r.rows.list) {
          this.list = this.list.concat(r.rows.list);
        }
        this.countTime();
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
      user_id: this.condition.user_id,
      id: item.id,
      token: this.user.token
    }).toPromise().then(res => {
      this.common.hideLoading();
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.common.success();
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
      const time1 = this.time.getTime();
      this.list.forEach((item) => {
        const time2 = new Date(item.create_time).getTime();
        if (time1 >= time2 && (time1 - time2) / 1000 <= 120) {
          const seconds = (time1 - time2) / 1000;
          console.log(this.time);
          console.log(item.create_time);
          console.log(seconds);
          item.left = seconds;
        }
      });
      this.time = new Date(time1 - 1000);
    }, 1000);
  }
}
