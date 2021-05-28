import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifydetailsPageRoutingModule } from './verifydetails-routing.module';

import { VerifydetailsPage } from './verifydetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifydetailsPageRoutingModule
  ],
  declarations: [VerifydetailsPage]
})
export class VerifydetailsPageModule {}
