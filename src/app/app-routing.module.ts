import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HRSharedModule } from "projects/HaroonH/src/app/app.module";
import { ConfigSharedModule } from "projects/HaroonConfig/src/app/app.module";
import { UMSharedModule } from "projects/HaroonU/src/app/app.module";
import { CompSharedModule } from "projects/HaroonC/src/app/app.module";

import { LoginComponent } from "./components/login/login.component";
import { IntroPageComponent } from "../../projects/HaroonH/src/app/components/intro-page/intro-page.component";
import { ForgotpasswordComponent } from "./components/forgotpassword/forgotpassword.component";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "home",
    component: IntroPageComponent
  },
  {
    path: "Config",
    // loadChildren: () => ConfigSharedModule
    loadChildren:
      () => import('../../projects/HaroonConfig/src/app/app.module').then(m => m.ConfigSharedModule)
  },
  {
    path: "HR",
    // loadChildren: () => HRSharedModule
    loadChildren: () => import('../../projects/HaroonH/src/app/app.module').then(m => m.HRSharedModule)
  },
  {
    path: "UM",
    // loadChildren: () => UMSharedModule
    loadChildren: () => import('../../projects/HaroonH/src/app/app.module').then(m => m.HRSharedModule)
  },
  {
    path: "Comp",
    // loadChildren: () => CompSharedModule
    loadChildren: () => import('../../projects/HaroonH/src/app/app.module').then(m => m.HRSharedModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
    //ConfigSharedModule.forRoot(),
    //HRSharedModule.forRoot()
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
