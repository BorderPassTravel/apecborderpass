import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { AccessProviders } from '../providers/access-providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-medicalreport',
  templateUrl: './medicalreport.page.html',
  styleUrls: ['./medicalreport.page.scss'],
})
export class MedicalreportPage implements OnInit {

  qrData = null;
  createdCode = null;

  datastorage: any;
  name: string;
  ppnum: string;
  userid: string;

  documentNumber: string;
  passportstorage: any;

  newppnumber: any;
  newuserfullname: string;
  providerName: any;
  
  constructor(
    private route: Router,
    public navCtrl: NavController,
    public alertController: AlertController,
    private accsPrvds: AccessProviders,
    private storage: Storage,
  ) {
   
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.storage.get('userinfo').then((res) => {
      console.log("USER DATA: " + JSON.stringify(res));
      this.datastorage = res;
      this.name = this.datastorage.fullname;
      this.ppnum = this.datastorage.ppnumber;
      this.userid = this.datastorage.userid;
      console.log(this.name);
      console.log(this.ppnum);
    });

    this.storage.get('newppnumber').then((res) =>{
      this.newppnumber = res;
    });

    this.storage.get('newfullname').then((res) =>{
      this.newuserfullname = res;
    });

    this.storage.get('providername').then((res) =>{
      this.providerName = res;
    });
  }


  logout() {
    console.log("Clicked on logout");
    this.storage.clear();
    this.navCtrl.navigateRoot('login')
  }

  createCode() {
    console.log("Clicked on generate QR Code");
    console.log(this.userid);
    //PASS USER ID AND FETCH EVERYTHING
    this.createdCode = "https://apec.borderpass.com/verification/medicalcard.php?userid=" + this.userid + "&provider=" + this.providerName;
  }

}
