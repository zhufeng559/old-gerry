import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit {

  list = new Array();
  condition = {
    token : '',
    create_time: '',
    quit_state: -1,
    reason: '',
    keyword: '',
    creator: '',
    state: 0,
    pages: 1,
    size: 10
  };
  total: number;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(private http: HttpService,
    public common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute, ) {
    }

  ngOnInit() {
    const user = this.common.checkLogin();
    if (user) {
      this.condition.token = user.token;
      this.condition.creator = user.rows.userId;
    }
  }

  ionViewWillEnter() {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.condition.create_time = params['create_time'] || '' ;
      this.condition.state = params['state'] || '';
      this.condition.keyword = params['keyword'] || '';
      this.load();
    });
  }

  async load() {
    this.list = new Array();
    await this.common.showLoading();
    return this.http.post('/request/get_order_list' , this.condition).toPromise().then(res => {
      this.common.hideLoading();
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
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

  getStatus(item) {
    if (item.state === '1') {
      return '已发送';
    } else if (item.state === '2') {
      return '未发送';
    }
    return '未知状态';
  }

  gotoOrderSearch() {
    this.router.navigate(['/order-search']);
  }

  gotoOrderDetail(id) {
    this.router.navigate(['/order-detail'],{
      queryParams: {
        id: id
      }
    });
  }
}
