import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-message',
  templateUrl: './my-message.page.html',
  styleUrls: ['./my-message.page.scss'],
})
export class MyMessagePage implements OnInit {

  list = new Array();
  condition = {
    user_id: '',
    token: '',
  };
  total: number;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(private http: HttpService,
    public common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute, ) {
    }

  ngOnInit() {
  }

  ionViewDidEnter () {
    const user = this.common.checkLogin();
    if (user) {
      this.condition.token = user.token;
      this.condition.user_id = user.rows.userId;
    }
    this.load();
  }

  async load() {
    this.common.showLoading();
    return this.http.post('/request/order_message' , this.condition).toPromise().then(res => {
      this.common.hideLoading();
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.list = r.rows || [];
      } else {
        this.common.errorSync(`查询错误{${r.resultNode}}`);
      }
    }, err => {
      this.common.requestError(err);
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.load().then(() => {
        event.target.complete();
      });
    }, 300);
  }

  getContent(item) {
    return `订单编号为${item.bill_no}的订单状态变更为${this.common.getStatusDesc(item.app_state)}，原因:${item.reason}，点击查看详情。`;
  }

  getReadDesc(item) {
    if (item.read_state == 0) {
      return '未读';
    }
    return '已读';
  }

  async gotoOrderDetail(id) {
    const model = {
      id : id,
      token : this.condition.token
    }
    this.common.showLoading();
    return this.http.post('/request/set_read' , model).toPromise().then(res => {
      this.common.hideLoading();
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.router.navigate(['/order-view'], {
          queryParams: {
            id: id
          }
        });
      } else {
        this.common.errorSync(`设置错误{${r.resultNode}}`);
      }
    }, err => {
      this.common.requestError(err);
    });
  }

  back() {
    this.router.navigate(['/tabs/my']);
  }
}
