import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material.module';
import { PNPrimeModule } from './shared/pnprime/pnprime.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchPipe } from './shared/pipe-filters/pipe-search';
import { ChartModule } from 'angular-highcharts';
// import { HttpModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from 'ng6-toastr-notifications';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule} from 'primeng/checkbox';
import { InputSwitchModule} from 'primeng/inputswitch';
import { NgxSpinnerModule } from 'ngx-spinner';

import { IgxGridModule, IgxExcelExporterService, IgxCsvExporterService } from "igniteui-angular";
import { NgxMaskModule} from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { UserrolesComponent } from './components/userroles/userroles.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreatepasswordComponent } from './components/createpassword/createpassword.component';
// import { ErpBottomSheetComponent } from './components/erp-bottom-sheet/erp-bottom-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    UserprofileComponent,
    UserrolesComponent,
    DashboardComponent,
    CreatepasswordComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    IgxGridModule,
    CheckboxModule,
    InputSwitchModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
    MatPasswordStrengthModule
  ],
  providers: [IgxExcelExporterService, IgxCsvExporterService],
  bootstrap: [AppComponent],
  // entryComponents: [ErpBottomSheetComponent],
})
export class AppModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers: []
    }
  }
 }
