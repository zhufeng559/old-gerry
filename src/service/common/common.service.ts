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
      spinner: 'circles',
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

  startCheckLogin() {
    const user = this.storage.read<any>('user');
    if (!user) {
      return null;
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
        return '建单';
      case '1':
        return '审核不通过';
      case '2':
        return '审核通过';
      case '3':
        return '作废';
      case '4':
        return '重新发送';
      case '5':
        return '已发送';
    }
  }
}
