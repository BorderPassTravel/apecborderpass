import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AccessProviders } from '../providers/access-providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-travelpass',
  templateUrl: './travelpass.page.html',
  styleUrls: ['./travelpass.page.scss'],
})

export class TravelpassPage implements OnInit {

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
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    //Get local data storge for user
    this.storage.get('userinfo').then((res) => {
      console.log("USER DATA: " + JSON.stringify(res));
      this.datastorage = res;
      this.name = this.datastorage.fullname;
      this.ppnum = this.datastorage.ppnumber;
      this.userid = this.datastorage.userid;
      console.log(this.name);
      console.log(this.ppnum);
    });

    //Get the new stored passport number for the user
    this.storage.get('newppnumber').then((res) => {
      this.newppnumber = res;
    });

    //Get the new full name as per passport for the user
    this.storage.get('newfullname').then((res) => {
      this.newuserfullname = res;
    });
  }

  //Gnerate QR Code for the APEC Medical Partner Hospitals/Clinics 
  providerQRCode() {
    //Generate QR code with user id
    this.createdCode = "https://apec.borderpass.com/medical/" + this.userid;
  }

  async logout() {
    console.log("Clicked on logout");
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
    this.storage.clear();
    this.navCtrl.navigateRoot('login')
  }

}
