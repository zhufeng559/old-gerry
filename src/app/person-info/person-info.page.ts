import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';

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
    nickName: '',
    birthdate: '',
    id_number: '',
    userId: '',
    token: ''
  };

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
      }
    });
  }

  submit() {
    this.model.birthdate = this.datePipe.transform(this.model.birthdate, 'yyyy-MM-dd');
    this.http.post('/request/fill_person_info', this.model).toPromise().then(res => {
      const r = res as any;
    });
  }

}
