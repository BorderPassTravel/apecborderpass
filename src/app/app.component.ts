import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private storage: Storage,
    public navCtrl: NavController
  ) {
    this.initializeApp()
  }

  initializeApp(){
    this.platform.ready().then((res) =>{
    });

    this.storage.get('userinfo').then((res) =>{
      if(res == null){
        this.navCtrl.navigateRoot('/login');
      }
      else {
        this.navCtrl.navigateRoot('/home')
      }
    });
  }
}
