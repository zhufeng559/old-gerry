import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private toastCtrl: ToastController) { }

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
}
