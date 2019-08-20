import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { UserrolesComponent } from './components/userroles/userroles.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreatepasswordComponent } from './components/createpassword/createpassword.component';

@NgModule({
  declarations: [
    AppComponent,
    UserprofileComponent,
    UserrolesComponent,
    DashboardComponent,
    CreatepasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
