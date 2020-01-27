import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  continue = false;

  search;
  messages = [];

  constructor(private socket: Socket, public toastController: ToastController) {
    Observable.create((observer) => {
      this.socket.on('reply', (message) => {
          observer.next(message);
      });
    })
      .subscribe((message) => {
        this.messages.push(message);
      });
  }

  getPosts(event) {
    this.presentToast('Click Pause to search again');
    this.messages = [];
    this.continue = true;
    this.socket.emit("message", this.search);
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (!this.continue) {
        event.target.disabled = true;
      }
    }, 500);
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'dark',
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
        }
      ]
    });
    toast.present();
  }

}
