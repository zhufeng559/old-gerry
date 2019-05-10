import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-person-info',
  templateUrl: './person-info.page.html',
  styleUrls: ['./person-info.page.scss'],
  providers: [DatePipe]
})
export class PersonInfoPage implements OnInit {

  model = {
    user_name: '',
    sex: '',
    phone: '',
    nickName: '',
    nickname: '',
    birthdate: '',
    id_number: '',
    identity_card: '',
    userId: '',
    token: '',
    file_id: ''
  };
  @ViewChild('form') form: NgForm;
  user;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public datePipe: DatePipe, ) {
    }

  ngOnInit() {
    this.user = this.common.checkLogin();
    this.http.post('/request/user_detail', {
      userId: this.user.rows.userId,
      token: this.user.token
    }).toPromise().then(res => {
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.model = r.rows;
        this.model.userId = this.user.userId;
        this.model.token = this.user.token;
        this.model.id_number = this.model.identity_card;
        this.model.nickName = this.model.nickname;
      }
    });
  }

  async submit() {
    if (this.form.valid) {
      this.model.birthdate = this.datePipe.transform(this.model.birthdate, 'yyyy-MM-dd');
      await this.common.showLoading();
      this.http.post('/request/fill_person_info', this.model).subscribe(res => {
        this.common.hideLoading();
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.common.success();
          this.router.navigate(['/tabs/my']);
        } else {
          this.common.errorSync(`保存用户信息错误{${r.resultNode}}`);
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
