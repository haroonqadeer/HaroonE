import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material.module';
import { PNPrimeModule } from './shared/pnprime/pnprime.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { SearchPipe } from './shared/pipe-filters/pipe-search';
import { ChartModule } from 'angular-highcharts';
//import { HttpModule } from '@angular/http';
import { MatRadioModule } from '@angular/material/radio';
import { NgCircleProgressModule } from 'ng-circle-progress';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HRSharedModule } from 'projects/HaroonH/src/app/app.module';
import { ConfigSharedModule } from 'projects/HaroonConfig/src/app/app.module';
import { NavComponent } from './components/nav/nav.component';
import { IgxGridModule, IgxExcelExporterService, IgxCsvExporterService } from "igniteui-angular";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from 'ng6-toastr-notifications';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SearchPipe } from './shared/pipe-filters/pipe-search';
import { LoginComponent } from './components/login/login.component';



@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SearchPipe,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HRSharedModule.forRoot(),
    ConfigSharedModule.forRoot(),



    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ChartModule,
    ReactiveFormsModule,
    PNPrimeModule,
    //HttpModule,
    MatRadioModule,
    NgCircleProgressModule.forRoot({}),
    ToastrModule.forRoot(),
    HttpClientModule,
    OrderModule,
    NgxPaginationModule,
    InputTextModule,
    DropdownModule,
    IgxGridModule
    //SearchPipe
  ],
  providers: [NavComponent, IgxExcelExporterService, IgxCsvExporterService],
  bootstrap: [AppComponent],
  entryComponents: [NavComponent],
})
export class AppModule { }
