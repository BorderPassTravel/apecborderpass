import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicalreportPage } from './medicalreport.page';

const routes: Routes = [
  {
    path: '',
    component: MedicalreportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalreportPageRoutingModule {}
