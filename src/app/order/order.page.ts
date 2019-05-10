import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController, ActionSheetController } from '@ionic/angular';
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
    file_id: '',
    file_url: '',
    token: ''
  };
  addImage = '../../assets/image/addImage.jpg';
  UPLOAD_URL = environment.UPLOAD_URL;
  @ViewChild('form') form: NgForm;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    private storage: StorageService,
    private actionSheetCtrl: ActionSheetController) {
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

  ionViewDidEnter () {
    console.log('OrderPage');
    this.type = '1';
    this.model.file_url = this.storage.read('order_image');
    if (!this.model.file_url) {
      this.model.file_id = '';
    }
    const user = this.common.checkLogin();
    if (user) {
      this.model.token = user.token;
      this.model.creator = user.rows.userId;
    }
    this.model.ctnNo = '';
    this.model.ladingBillNumber = '';
    this.model.file_id = '';
    this.model.file_url = '';
    this.form.reset();
  }

  async submit() {
    if (this.model.file_id == '') {
      this.common.errorSync('请上传图片');
      return;
    }
    if (this.form.valid) {
      await this.common.showLoading();
      this.http.post('/request/create_order', this.model).subscribe(res => {
        this.common.hideLoading();
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.common.success();
          this.model.ctnNo = '';
          this.model.ladingBillNumber = '';
          this.model.file_id = '';
          this.model.file_url = '';
          this.storage.write('order_image', '');
          this.form.reset();
        } else {
          this.common.errorSync(`建单错误{${r.resultNode}}`);
        }
      }, err => {
        this.common.requestError(err);
      });
    } else {
      this.common.errorSync('请完整填写信息');
    }
  }

  async upload() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: '请选择',
      buttons: [{
          icon: 'camera',
          text: '打开相机',
          handler: () => {
          }
        }, {
          icon: 'image',
          text: '打开相册',
          handler: () => {
            document.getElementById('imageUpload1').click();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async imageUpload(element: any) {
    if (element.files == null || element.files.length < 1) {
      return;
    }
    await this.common.showLoading();
    const fd = new FormData();
    for (let i = 0, len = element.files.length; i < len; i++) {
      const file = element.files[i];
        fd.append(file.type, file);
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (evt: any, ) => {
          const result = JSON.parse(evt.target.responseText);
          this.common.hideLoading();
          if (result.code >= 0) {
            this.common.success('上传成功').then(() => {
              this.model.file_id = result.rows.file_id;
              this.model.file_url = result.rows.file_url;
            });
          } else {
            this.common.errorSync(`上传错误{${result.resultNode}}`);
          }
        }, false);
        xhr.open('post', this.UPLOAD_URL);
        xhr.send(fd);
    }
  }

  gotoImageDetail() {
    this.storage.write('order_image', this.model.file_url);
    this.router.navigate(['/image-detail'], {
      queryParams: {
        nodelete : 1
      }
    });
  }
}
