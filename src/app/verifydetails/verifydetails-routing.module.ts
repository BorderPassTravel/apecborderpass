import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifydetailsPage } from './verifydetails.page';

const routes: Routes = [
  {
    path: '',
    component: VerifydetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifydetailsPageRoutingModule {}
