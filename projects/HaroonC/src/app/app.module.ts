import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
