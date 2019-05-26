import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HRSharedModule } from 'projects/HaroonH/src/app/app.module';
import { ConfigSharedModule } from 'projects/HaroonConfig/src/app/app.module';

const routes: Routes = [
  {
    path: 'Config', 
    loadChildren:() => ConfigSharedModule
    // loadChildren: '../../projects/HaroonConfig/src/app/app.module#ConfigSharedModule'
  },
  {
    path: 'HR', 
    loadChildren:() => HRSharedModule
    // loadChildren: '../../projects/HaroonH/src/app/app.module#HRSharedModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    //ConfigSharedModule.forRoot(),
    //HRSharedModule.forRoot()    
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
