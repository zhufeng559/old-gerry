import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private toastCtrl: ToastController,
     private storage: StorageService,
     public router: Router, ) { }

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

  checkLogin() {
    const user = this.storage.read<any>('user');
    if (!user) {
      this.router.navigate(['/login']);
    } else {
      return user;
    }
  }
}
