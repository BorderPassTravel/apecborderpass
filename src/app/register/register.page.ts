import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import {AccessProviders} from '../providers/access-providers';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  fullname: string = "";
  ppnumber: string = "";
  email: string ="";
  password: string = "";

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders,
    public navCtrl: NavController,
  ) { }

  ngOnInit() { 
  }

  async register(){
    console.log("Clicked on Register")
    if(this.fullname == ""){
      alert("Full name is required")      
    }else if (this.email == ""){
      alert("Email address is required")
    }else if(this.password == ""){
      alert("Password is required")
    } else {
      const loader = await this.loadingCtrl.create({
        message: "Please wait..."
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: 'proses_register',
          fullname: this.fullname,
          ppnumber: this.ppnumber,
          email: this.email,
          password: this.password
        }

        this.accsPrvds.postData(body, 'proses_api.php').subscribe((res:any) =>{
          if(res['success'] == true){
            alert (res.msg);
             console.log("Registered SUCCESS")
             console.log(res.msg)
             loader.dismiss();
             this.navCtrl.navigateRoot('login')
          }else{
            console.log("Registered FAILED")
            loader.dismiss();
            alert(res.msg)
            console.log(res.msg)
          }

        }, (err)=>{
          loader.dismiss();
        }
        );
      });
    }

  }

  async presentToast(a){
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
      position: 'bottom'
    })
  }


   
}
