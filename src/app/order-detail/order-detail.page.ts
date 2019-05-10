import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ActionSheetController, NavController } from '@ionic/angular';
import { StorageService } from '../../service/common/storage.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

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
    id: 0,
    ladingbillnumber: '',
    state: 0,
    reason: '',
    quit_state: -1
  };
  addImage = '../../assets/image/addImage.jpg';
  stateDesc = '';
  UPLOAD_URL = environment.UPLOAD_URL;
  @ViewChild('form') form: NgForm;
  user;

  constructor(private http: HttpService,
    private common: CommonService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    public nav: NavController,
    public storage: StorageService) {
  }

  ngOnInit() {
    this.user = this.common.checkLogin();
    this.condition.token = this.user.token;
  }

  ionViewDidEnter () {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.condition.id = params['id'] || '' ;
      this.load();
    });
  }

  load() {
    return this.http.post('/request/order_detail', this.condition).toPromise().then(res => {
      const r = res as any;
      if (this.common.isSuccess(r.code)) {
        this.model = r.rows;
        if (this.model.quit_state == 0) {
          this.stateDesc = '已退回';
          this.model.file_id = '';
          this.model.file_url = '';
        } else if (this.model.quit_state == 1) {
            this.stateDesc = '已发送';
        } else if (this.model.quit_state == 2) {
            this.stateDesc = '未审核';
        }
      } else {
        this.common.errorSync(`获取订单详情失败{${r.resultNode}}`);
      }
    }, err => {
      this.common.errorSync(`获取订单详情失败{${err.message}}`);
    });
  }

  submit() {
    if (this.model.file_id == '') {
      this.common.errorSync('请上传图片');
      return;
    }
    if (this.form.valid) {
      const model = {
        creator: this.user.rows.userId,
        ladingBillNumber: this.model.ladingbillnumber,
        ctnNo: this.model.ctnno,
        file_id: this.model.file_id,
        token: this.user.token
      };
      this.http.post('/request/create_order', model).subscribe(res => {
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.common.success();
          this.nav.pop();
        } else {
          this.common.errorSync(`重新提交订单错误{${r.resultNode}}`);
        }
      }, err => {
        this.common.errorSync(`重新提交订单错误{${err.message}}`);
      });
    } else {
      this.common.errorSync('请完整填写信息');
    }
  }

  async upload() {
    if (this.model.quit_state == 0) {
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
              this.model.file_id = result.rows.file_id;
              this.addImage = result.rows.file_url;
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
    let nodelete = 0;
    if (this.model.quit_state == 0) {
      nodelete = 1;
    }
    this.router.navigate(['/image-detail'], {
      queryParams: {
        nodelete : nodelete
      }
    });
  }
}
