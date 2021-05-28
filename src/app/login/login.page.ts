import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, LoadingController, AlertController, ToastController, } from '@ionic/angular';
import { AccessProviders } from '../providers/access-providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private route: Router,
    public navCtrl: NavController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private accsPrvds: AccessProviders,
    private toastCtrl: ToastController,
    private storage: Storage,
  ) { }

  email: string = "";
  password: string = "";

  ngOnInit() {
  }

  async login() {
    console.log("Clicked on LOGIN")
    if (this.email == "") {
      alert("Email address is required")
    } else if (this.password == "") {
      alert("Password is required")
    } else {
      const loader = await this.loadingController.create({
        message: "Please wait..."
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: 'proses_login',
          email: this.email,
          password: this.password
        }

        this.accsPrvds.postData(body, 'proses_api.php').subscribe((res: any) => {
          if (res.success == true) {
            // alert ("Login Success");
            console.log("RES: " + JSON.stringify(res.result));
            this.storage.set('userinfo', res.result);
            loader.dismiss();
            this.navCtrl.navigateRoot('home');
          } else {
            console.log("Login failed")
            loader.dismiss();
            alert("Email or password is incorrect")
            console.log(res.msg)
          }

        }, (err) => {
          loader.dismiss();
          alert("Error: There was a problem logging in")
          console.log(err)
        }
        );
      });
    }
  }

  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
      position: 'bottom'
    })
  }

}