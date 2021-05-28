import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File, IWriteOptions, FileEntry } from '@ionic-native/file/ngx';
import { UploadService } from '../upload.service';

import { AccessProviders } from '../providers/access-providers';
import { ImageProviders } from '../providers/image-provider';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // options: CameraOptions = {
  //   quality: 10,
  //   destinationType: this.camera.DestinationType.FILE_URI,
  //   encodingType: this.camera.EncodingType.JPEG,
  //   mediaType: this.camera.MediaType.PICTURE,
  //   cameraDirection: 0,
  //   targetHeight: 100,
  //   targetWidth: 100
  // };

  userImage: any = [];
  ppImage: any = [];

  datastorage: any;
  name: string;
  ppnum: string;
  userid: string;

  images = new Array();
  imageURI: [];

  photos: any = [];
  photoname: any = [];

  ppimagestored: string;

  selfieimgsrc: any;
  ppimgsrc: any;

  qrData = null;
  createdCode = null;

  nopassport = null;

  newppnumber: any;

  constructor(
    private route: Router,
    public navCtrl: NavController,
    public file: File,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private camera: Camera,
    private uploadService: UploadService,
    private accsPrvds: AccessProviders,
    private imgPrvds: ImageProviders,
    private storage: Storage,
    private domSanitizer: DomSanitizer,

  ) { }

  ionViewDidEnter() {
    this.storage.get('userinfo').then((res) => {
      console.log("USER DATA: " + JSON.stringify(res));
      this.datastorage = res;
      this.name = this.datastorage.fullname;
      this.ppnum = this.datastorage.ppnumber;
      this.userid = this.datastorage.userid;
      this.ppimagestored = this.datastorage.ppimage;
      console.log(this.name);
      console.log(this.ppnum);
      console.log(this.userid);
      console.log(this.ppimagestored);
    })
  }

  //Capture a selfie for user verification
  takeSelfie() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: 0,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {

        let filename = imageData.substring(imageData.lastIndexOf('/') + 1);
        let path = imageData.substring(0, imageData.lastIndexOf('/') + 1);

        //then use the method reasDataURL  btw. var_picture is ur image variable
        this.file.readAsDataURL(path, filename).then(res => this.selfieimgsrc = res);

        entry.file(file => {
          console.log(file);
          this.photos[0] = file;
          console.log(file.name);
          this.photoname = file.name;
        });
      });
    }, (err) => {
      alert("Error: There was a problem taking the picture")
    });
  }

  //Capture users passport image for verification
  takePassport() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: 0,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {

        let filename = imageData.substring(imageData.lastIndexOf('/') + 1);
        let path = imageData.substring(0, imageData.lastIndexOf('/') + 1);

        //then use the method reasDataURL  btw. var_picture is ur image variable
        this.file.readAsDataURL(path, filename).then(res => this.ppimgsrc = res);

        entry.file(file => {
          console.log(file);
          this.photos[1] = file;
          console.log(file.name);
          this.photoname = file.name;
        });
      });
    }, (err) => {
      alert("Error: There was a problem taking the picture")
    });
  }

  // Submit your selfie and passport images to the server for verification - FACE API
  async readFile() {
    const loading = await this.loadingController.create({
      message: 'Please wait. We are verifying your biometrics. This may take up to 30 seconds',
    });
    await loading.present();

    console.log("READ FILE" + this.userid);
    const selfieReader = new FileReader();
    const ppReader = new FileReader();

    const formData = new FormData();
    let selfieimgBlob: any;
    let ppimgBlob: any;

    selfieReader.onload = () => {
      selfieimgBlob = new Blob([selfieReader.result], {
        type: this.photos[0].type
      });

      formData.append('selfie', selfieimgBlob, this.photos[0].name);
      console.log("11: " + formData.get('selfie'));
    }

    ppReader.onload = () => {
      ppimgBlob = new Blob([ppReader.result], {
        type: this.photos[1].type
      });

      formData.append('passport', ppimgBlob, this.photos[1].name);
      console.log("22: " + formData.get('passport'));

      this.uploadService.uploadImageData(formData).subscribe(data => {

        if (data['success']) {
          //make a call to the FACE API for Passport pic and selfie pic verification
          const formData = new FormData();

          formData.append('personal', data['selfieurl']);
          formData.append('passport', data['passporturl']);

          this.uploadService.faceapi(formData).subscribe(data => {
            console.log(data['success'])
            if (data['success']) {

              this.senduserId();
              console.log(data);
              this.storage.set('passportDetails', data['message']);

              loading.dismiss();
              this.navCtrl.navigateRoot('verifydetails');

            } else {
              loading.dismiss();
              //Display error message fetched from the FACE API
              alert(data['message']);
            }
          });
        }
      });
    }

    selfieReader.readAsArrayBuffer(this.photos[0]);
    ppReader.readAsArrayBuffer(this.photos[1]);
  }

  //Update users passport image name to the database if FACE API is a success
  senduserId() {

    return new Promise(resolve => {
      let body = {
        userid: this.userid,
        photoname: this.photos[1].name,
      }

      this.accsPrvds.postData(body, 'updatepp.php').subscribe((res: any) => {
        if (res.success == true) {
          console.log("RES: " + JSON.stringify(res.result));
        } else {
          console.log("Passport image name saved")
        }
      }, (err) => {
        console.log("passport image name could not be saved")
      }
      );
    });
  }

  //Generate QR Code for border control
  createCode() {
    //if the user is not verified - prompt a message to verify first
    if (this.ppnum == null || this.ppnum == "") {
      alert("Your profile has not been verified yet. Please return to the verification screen")
    }
    else {
      //Pass the user id and generate the border control QR Code
      this.createdCode = "https://apec.borderpass.com/verification/medicalcard.php?userid=" + this.userid;
    }
  }

  //Move to the APEC Partner hospital / clinic page
  clinic() {
    //If the user is not verified - prompt a message to verify first 
    if (this.ppnum == null || this.ppnum == "") {
      alert("Please verify your identity")
    } else {
      this.navCtrl.navigateRoot('travelpass');
    }
  }

  //function to change the value of Ngif to display
  verifyagain() {
    this.nopassport = true;
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