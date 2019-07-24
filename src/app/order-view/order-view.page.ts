import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ActionSheetController, NavController } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.page.html',
  styleUrls: ['./order-view.page.scss'],
  providers: [DatePipe]
})
export class OrderViewPage implements OnInit {

  condition = {
    id: '',
    token: ''
  };

  model = {
    create_time: '',
    creator: '',
    ctnno: '',
    file_id: '',
    file_url: '',
    file_name: '',
    id: 0,
    ladingbillnumber: '',
    state: 0,
    reason: '',
    bill_no: '',
    app_state: '',
  };
  addImage = 'assets/image/addImage.png';
  stateDesc = '';
  UPLOAD_URL = environment.UPLOAD_URL;
  @ViewChild('form') form: NgForm;
  user;
  type;

  constructor(private http: HttpService,
    public common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    public nav: NavController,
    public storage: StorageService,
    private sanitizer: DomSanitizer,
    public datePipe: DatePipe, ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter () {
    this.user = this.common.checkLogin();
    this.condition.token = this.user.token;
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.condition.id = params['id'] || '' ;
      this.type = params['type'] || '' ;
      this.load();
    });
  }

  async load() {
    await this.common.showLoading();
    return this.http.post('/request/order_detail', this.condition).toPromise().then(res => {
      this.common.hideLoading();
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.model = r.rows;
        this.stateDesc = this.common.getStatusDesc(this.model.app_state);
      } else {
        this.common.errorSync(`获取订单详情失败{${r.resultNode}}`);
      }
    }, err => {
      this.common.errorSync(`获取订单详情失败{${err.message}}`);
    });
  }

  gotoImageDetail() {
    this.storage.write('order_image', this.model.file_url);
    this.router.navigate(['/image-detail']);
  }

  setSafe(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  back() {
    this.nav.pop();
  }
}
