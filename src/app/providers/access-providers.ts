import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable()
export class AccessProviders {
    
    //server: string = "http://saimatrix.net/test/"  //TESTING SERVER
    server: string = "https://apec.borderpass.com/apecborderpassapi/" //Live Server

    constructor(
        private router: Router,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        public http: HttpClient
      ) { }

      postData(body, file){
          let headers = new HttpHeaders({
               'Content-Type': 'application/json; charset=UTF-8'
          });
          let options = {
              headers: headers
          }

          return this.http.post(this.server + file, JSON.stringify(body), options)
          .map(res => res);
      }
}