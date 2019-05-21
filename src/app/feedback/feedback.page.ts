import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
  providers: [DatePipe]
})
export class FeedbackPage implements OnInit {

  model = {
    userId: 0,
    phone: '',
    textarea: '',
    offer_time: '',
    file_id: '',
    token: ''
  };
  addImage = 'assets/image/addImage.jpg';
  stateDesc = '';
  UPLOAD_URL = environment.UPLOAD_URL;
  @ViewChild('form') form: NgForm;
  user;

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
    this.model.userId = this.user.rows.userId;
    this.model.phone = this.user.rows.phone;
    this.model.token = this.user.token;
  }

  submit() {
    if (this.form.valid) {
      this.model.offer_time = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
      this.http.post('/request/create_notice_detail', this.model).subscribe(res => {
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.common.success();
          this.router.navigate(['/tabs/my']);
        } else {
          this.common.errorSync(`提交建议错误{${r.resultNode}}`);
        }
      }, err => {
        this.common.requestError(err);
      });
    } else {
      this.common.errorSync('请完整填写信息');
    }
  }

  back() {
    this.router.navigate(['/tabs/my']);
  }
}
