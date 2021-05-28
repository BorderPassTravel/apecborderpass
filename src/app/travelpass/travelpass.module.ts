import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravelpassPageRoutingModule } from './travelpass-routing.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { TravelpassPage } from './travelpass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravelpassPageRoutingModule,
    NgxQRCodeModule
  ],
  declarations: [TravelpassPage]
})
export class TravelpassPageModule {}
