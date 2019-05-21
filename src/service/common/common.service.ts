import { Injectable } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  loader: HTMLIonLoadingElement;
  public isLoading = false;

  constructor(private toastCtrl: ToastController,
     private storage: StorageService,
     public router: Router,
     public loading: LoadingController,
     public nav: NavController ) { }

  async errorSync(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'top',
    });
    await toast.present();
  }

  async success(msg = '操作成功') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'top',
    });
    await toast.present();
  }

  async requestError(err) {
    await this.hideLoading();
    await this.errorSync(`服务器请求失败:${err.message}`);
  }

  async showLoading(msg = '') {
    this.isLoading = true;
    this.loader = await this.loading.create({
      spinner: 'crescent',
      message: msg,
      duration: 6000
    });
    await this.loader.present();
  }

  async hideLoading() {
    this.isLoading = false;
    if (this.loader) {
      this.loader.dismiss().then(() => {
        this.loader = null;
      });
    }
  }

  checkLogin() {
    const user = this.storage.read<any>('user');
    if (!user) {
      this.nav.navigateRoot('login');
    } else {
      return user;
    }
  }

  isSuccess(res) {
    return res >= 0;
  }

  getStatusDesc(status) {
    switch (status) {
      case '0':
        return '未审核';
      case '1':
        return '退回';
      case '2':
        return '审核通过';
      case '6':
        return '已发送';
    }
  }
}
