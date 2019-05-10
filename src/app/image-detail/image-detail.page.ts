import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';


@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.page.html',
  styleUrls: ['./image-detail.page.scss'],
})
export class ImageDetailPage implements OnInit {

  img = '';
  nodelete = false;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public storage: StorageService ) {
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

  delete() {
    this.storage.write('order_image', '');
    this.img = '';
    this.router.navigate(['/tabs/order']);
  }
}
