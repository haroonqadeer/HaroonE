import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { ChartModule } from 'angular-highcharts';
import { ToastrModule } from 'ng6-toastr-notifications';
//import { HttpModule } from '@angular/http';
// import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// import { NgxMaskModule } from "ngx-mask";
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
// import { NgxSpinnerModule } from 'ngx-spinner';
// import { ExportAsModule } from 'ngx-export-as';
import { IgxGridModule, IgxExcelExporterService, IgxCsvExporterService } from "igniteui-angular";


//shared items
import { MaterialModule } from '../../../../src/app/shared/material.module';
import { PNPrimeModule } from '../../../../src/app/shared/pnprime/pnprime.module';
import { SearchPipe } from '../../../../src/app/shared/pipe-filters/pipe-search';


//components 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BranchComponent } from './components/branch/branch.component';
import { CompanyComponent } from './components/company/company.component';
import { CompanydashboardComponent } from './components/companydashboard/companydashboard.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { DepartmentComponent } from './components/department/department.component';
import { HeadquarterComponent } from './components/headquarter/headquarter.component';
import { SectionComponent } from './components/section/section.component';
import { SubsidiarieComponent } from './components/subsidiarie/subsidiarie.component';

@NgModule({
    declarations: [
        AppComponent,
        SearchPipe,
        BranchComponent,
        CompanyComponent,
        CompanydashboardComponent,
        CurrencyComponent,
        DepartmentComponent,
        HeadquarterComponent,
        SectionComponent,
        SubsidiarieComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,

        MaterialModule,
        BrowserAnimationsModule,
        FormsModule,
        // ChartModule,
        ReactiveFormsModule,
        PNPrimeModule,
        ToastrModule.forRoot(),
        //HttpModule,
        HttpClientModule,
        // NgxMaskModule.forRoot(),
        // IgxGridModule,
        NgxPaginationModule,
        OrderModule,
        // NgxSpinnerModule,
        // ExportAsModule

    ],
    providers: [IgxExcelExporterService, IgxCsvExporterService],
    bootstrap: [AppComponent]
    })
export class AppModule { }
