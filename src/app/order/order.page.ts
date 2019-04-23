import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  type = '1';
  model = {
    creator: '',
    ladingBillNumber: '',
    ctnNo: '',
    create_time: '',
    id: 0,
    file_id: '',
    token: ''
  };
  addImage = '../../assets/image/addImage.jpg';
  img = '';
  UPLOAD_URL = environment.UPLOAD_URL;
  @ViewChild('form') form: NgForm;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    private storage: StorageService) {
    }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    switch (this.type) {
      case '1':
        this.router.navigate(['/tabs/order']);
        break;
      case '2':
        this.router.navigate(['/order-history']);
        break;
      case '3':
        this.router.navigate(['/pay-list']);
        break;
    }
  }

  ionViewWillEnter() {
    this.type = '1';
  }

  submit() {
    if (this.form.valid) {
      this.http.post('/request/create_order', this.model).subscribe(res => {
        const r = res as any;
        if (r.code >= 0) {
          this.common.success();
        } else {
          this.common.errorSync(`建单错误{${r.resultNode}}`);
        }
      }, err => {
        this.common.errorSync(`建单错误{${err.message}}`);
      });
    } else {
      this.common.errorSync('请完整填写信息');
    }
  }

  upload() {
    document.getElementById('imageUpload1').click();
  }

  imageUpload(element: any) {
    if (element.files == null || element.files.length < 1) {
      return;
    }
    const fd = new FormData();
    for (let i = 0, len = element.files.length; i < len; i++) {
      const file = element.files[i];
        fd.append(file.type, file);
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (evt: any, ) => {
          const result = JSON.parse(evt.target.responseText);
          if (result.code >= 0) {
            this.common.success('上传成功').then(() => {
              this.model.file_id = result.rows;
            });
          } else {
            this.common.errorSync(`上传错误{${result.resultNode}}`);
          }
        }, false);
        xhr.open('post', this.UPLOAD_URL);
        xhr.send(fd);
    }
  }
}
