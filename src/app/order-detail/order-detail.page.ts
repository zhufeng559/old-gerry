import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../service/common/http.service';
import { CommonService } from '../../service/common/common.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ActionSheetController } from '@ionic/angular';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';

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
    reasonstate: 0
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
    private actionSheetCtrl: ActionSheetController) {
  }

  ngOnInit() {
    this.user = this.common.checkLogin();
    this.condition.token = this.user.token;
  }

  ionViewWillEnter() {
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
        if (this.model.reasonstate == 1) {
          this.stateDesc = '已退回';
          this.model.file_id = '';
          this.model.file_url = '';
        } else {
          if (this.model.state == 0) {
            this.stateDesc = '未通过';
          } else{
            this.stateDesc = '已通过';
          }
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
      this.http.post('/request/create_order', this.model).subscribe(res => {
        const r = res as any;
        if (this.common.isSuccess(r.code)) {
          this.common.success();
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
    if (this.model.reasonstate == 1) {
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
              this.model.file_id = '1557039249064';
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
}
