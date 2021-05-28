import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { UploadService } from '../upload.service';

import { AccessProviders } from '../providers/access-providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-verifydetails',
  templateUrl: './verifydetails.page.html',
  styleUrls: ['./verifydetails.page.scss'],
})
export class VerifydetailsPage implements OnInit {

  ppdata: any;
  name: string;
  ppnum: string;

  userid: string;
  datastorage: any;

  passportstorage: any;
  surname: string = "";
  ppname: string = "";
  country: string = "";
  dob: string = "";
  doe: string = "";
  sex: string = "";
  documentType: string = "";
  documentNumber: string = "";

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private http: HttpClient,
    private uploadService: UploadService,
    private accsPrvds: AccessProviders,
    private storage: Storage,

  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    //Get users data stored on the local storage
    this.storage.get('userinfo').then((res) => {
      console.log("USER DATA: " + JSON.stringify(res));
      this.datastorage = res;
      this.name = this.datastorage.fullname;
      this.ppnum = this.datastorage.ppnumber;
      this.userid = this.datastorage.userid
      console.log(this.name);
      console.log(this.ppnum);
      console.log(this.userid);
    });

    //Get the users passport data from the passport image
    this.storage.get('passportDetails').then((res) => {
      console.log("PASSPORT DATA: " + JSON.stringify(res));
      this.passportstorage = res;
      this.ppname = this.passportstorage.name;
      this.country = this.passportstorage.country;
      this.dob = this.passportstorage.birth_date;
      this.sex = this.passportstorage.sex;
      this.documentNumber = this.passportstorage.document_number;
    });
  }

  //Submit users confirmed details
  async confirmDetails() {
    if (this.ppname == "") {
      alert("Please enter your full name as per your passport");
    }

    else if (this.documentNumber == "") {
      alert("Please enter your passport number");
    }

    else {
      const loading = await this.loadingController.create({

        message: 'Please wait...',
        duration: 3000
      });
      await loading.present();

      return new Promise(resolve => {
        let body = {
          userid: this.userid,
          surname: this.surname,
          ppname: this.ppname,
          country: this.country,
          dob: this.dob,
          doe: this.doe,
          sex: this.sex,
          documentType: this.documentType,
          documentNumber: this.documentNumber
        }

        this.storage.set('newppnumber', this.documentNumber);
        this.storage.set('newfullname', this.ppname);

        this.accsPrvds.postData(body, 'updateuserdetails.php').subscribe((res: any) => {
          if (res['success']) {
            console.log("RES: " + JSON.stringify(res.result));
            console.log("passport has been saved");

          } else {
            console.log("passport could not be saved")
          }
        }, (err) => {

        });

        //Create a new Storage
        let newUserStorage = {
          userid: this.userid,
          fullname: this.ppname,
          ppnumber: this.documentNumber
        }
        this.storage.set('userinfo', newUserStorage);
        //End new storage
        this.navCtrl.navigateRoot('travelpass');
      });
    }
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