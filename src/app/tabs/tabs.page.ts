import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common/common.service';
import { Events } from '@ionic/angular';
import { HttpService } from '../../service/common/http.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  condition = {
    user_id: '',
    token: '',
  };
  count = 0;

  constructor(public common: CommonService,
    public events: Events,
    private http: HttpService) { }

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

  load() {
    this.http.post('/request/order_message' , this.condition).toPromise().then(res => {
      const r = res as any;
      this.count = r.count || 0;
    });
  }
}
