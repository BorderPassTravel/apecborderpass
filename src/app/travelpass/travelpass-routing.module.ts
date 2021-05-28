import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TravelpassPage } from './travelpass.page';

const routes: Routes = [
  {
    path: '',
    component: TravelpassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelpassPageRoutingModule {}
