import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.page.html',
  styleUrls: ['./image-detail.page.scss'],
})
export class ImageDetailPage implements OnInit {

  img = '';
  nodelete = false;
  slideOpts = {
    centeredSlides: 'true'
  };

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public storage: StorageService,
    public nav: NavController,
    public events: Events ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter () {
    console.log('ImageDetailPage');
    this.img = this.storage.read('order_image');
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.nodelete = params['nodelete'] == 1;
    });
  }

  back() {
    this.nav.pop();
  }

  delete() {
    this.img = '';
    this.events.publish('deleteImg');
    this.nav.pop();
  }
}
