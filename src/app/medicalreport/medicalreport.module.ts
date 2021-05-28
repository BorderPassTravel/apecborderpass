import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { MedicalreportPageRoutingModule } from './medicalreport-routing.module';

import { MedicalreportPage } from './medicalreport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicalreportPageRoutingModule,
    NgxQRCodeModule
  ],
  declarations: [MedicalreportPage]
})
export class MedicalreportPageModule {}
