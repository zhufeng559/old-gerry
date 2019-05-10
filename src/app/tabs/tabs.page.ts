import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common/common.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(public common: CommonService,
    public events: Events) { }

  ngOnInit() {
  }

  ionViewDidEnter () {
    this.events.publish('new');
  }
}
