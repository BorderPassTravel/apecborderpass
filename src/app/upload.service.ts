import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadImageData(formData) {
    console.log("IMAGE IS HERE" + formData)
    //return this.http.post('http://saimatrix.net/test/uploadfile.php', formData);
    return this.http.post('https://apec.borderpass.com/apecborderpassapi/uploadfile.php', formData);
  }
  

  faceapi(formData) {
    console.log("REACHED FACE API SENDER " + formData.get('passport'))
    return this.http.post('https://apec.borderpass.com/api/detectface', formData);
  }

}
