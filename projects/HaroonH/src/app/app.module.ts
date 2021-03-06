import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./shared/material.module";
import { PNPrimeModule } from "./shared/pnprime/pnprime.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SearchPipe } from "./shared/pipe-filters/pipe-search";
import { ChartModule } from "angular-highcharts";
//import { HttpModule } from '@angular/http';
import { MatRadioModule } from "@angular/material/radio";
import { NgCircleProgressModule } from "ng-circle-progress";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { EmpolyeeprofileComponent } from "./components/empolyeeprofile/empolyeeprofile.component";
import { ErpBottomSheetComponent } from "./components/erp-bottom-sheet/erp-bottom-sheet.component";
import { HrdashboardComponent } from "./components/hrdashboard/hrdashboard.component";
import { IntroPageComponent } from "./components/intro-page/intro-page.component";
import { JobprofileComponent } from "./components/jobprofile/jobprofile.component";
import { LeaverulesComponent } from "./components/leaverules/leaverules.component";
import { LeavetypeComponent } from "./components/leavetype/leavetype.component";
import { PerformanceEvaComponent } from "./components/performance-eva/performance-eva.component";
import { PerformanceStandComponent } from "./components/performance-stand/performance-stand.component";
import { PostComponent } from "./components/post/post.component";
import { RecruitmentComponent } from "./components/recruitment/recruitment.component";
import { RecruitmentappComponent } from "./components/recruitmentapp/recruitmentapp.component";
import { SkillstandardComponent } from "./components/skillstandard/skillstandard.component";
import { TestComponent } from "./components/test/test.component";
import { TrainingrequirementsComponent } from "./components/trainingrequirements/trainingrequirements.component";
import { YearcalendarComponent } from "./components/yearcalendar/yearcalendar.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from "ng6-toastr-notifications";
import { OrderModule } from "ngx-order-pipe";
import { NgxPaginationModule } from "ngx-pagination";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { CheckboxModule } from "primeng/checkbox";
import { InputSwitchModule } from "primeng/inputswitch";
import { NgxSpinnerModule } from "ngx-spinner";

// import { IgxGridModule, IgxExcelExporterService, IgxCsvExporterService } from "igniteui-angular";
import { TrainingComponent } from "./components/training/training.component";
import { TrainingemployeeComponent } from "./components/trainingemployee/trainingemployee.component";
import { ShiftComponent } from "./components/shift/shift.component";
import { CommunicationComponent } from "./components/communication/communication.component";
import { AttendanceComponent } from "./components/attendance/attendance.component";
import { EmployeeShiftComponent } from "./components/employee-shift/employee-shift.component";
import { AttendanceDashboardComponent } from "./components/attendance-dashboard/attendance-dashboard.component";
import { NgxMaskModule } from "ngx-mask";
import { PromotionComponent } from "./components/promotion/promotion.component";
import { TransferpostingComponent } from "./components/transferposting/transferposting.component";

import { SharedmodModule } from "src/app/components/sharedmod.module";
import { ConfigAddressComponent } from "src/app/components/config-address/config-address.component";
import { ConfigContactComponent } from "src/app/components/config-contact/config-contact.component";

@NgModule({
  declarations: [
    AppComponent,
    EmpolyeeprofileComponent,
    ErpBottomSheetComponent,
    HrdashboardComponent,
    IntroPageComponent,
    JobprofileComponent,
    LeaverulesComponent,
    LeavetypeComponent,
    PerformanceEvaComponent,
    PerformanceStandComponent,
    PostComponent,
    RecruitmentComponent,
    RecruitmentappComponent,
    SkillstandardComponent,
    TestComponent,
    TrainingrequirementsComponent,
    YearcalendarComponent,
    SearchPipe,
    TrainingComponent,
    TrainingemployeeComponent,
    ShiftComponent,
    AttendanceComponent,
    EmployeeShiftComponent,
    AttendanceDashboardComponent,
    PromotionComponent,
    TransferpostingComponent,
    CommunicationComponent
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
    // IgxGridModule,
    CheckboxModule,
    InputSwitchModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
    SharedmodModule
  ],
  providers: [
    // IgxExcelExporterService,
    // IgxCsvExporterService,
    ConfigAddressComponent,
    ConfigContactComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErpBottomSheetComponent]
})
export class AppModule {}

@NgModule({})
export class HRSharedModule {
  static forRoot(): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: []
    };
  }
}
