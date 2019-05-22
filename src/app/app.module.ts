import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HaroonHSharedModule } from 'projects/HaroonH/src/app/app.module';
//import { FormComponent } from './components/form/form.component';

@NgModule({
  declarations: [
    AppComponent,
    //FormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HaroonHSharedModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
