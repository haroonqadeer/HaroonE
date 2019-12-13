import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecruitmentComponent } from './components/recruitment/recruitment.component';
import { JobprofileComponent } from './components/jobprofile/jobprofile.component';
import { PostComponent } from './components/post/post.component';
import { RecruitmentappComponent } from './components/recruitmentapp/recruitmentapp.component';
import { CommunicationComponent } from "./components/communication/communication.component";

import { TestComponent } from './components/test/test.component';
import { EmpolyeeprofileComponent } from './components/empolyeeprofile/empolyeeprofile.component';
import { SkillstandardComponent } from './components/skillstandard/skillstandard.component';
import { TrainingrequirementsComponent } from './components/trainingrequirements/trainingrequirements.component';
import { YearcalendarComponent } from './components/yearcalendar/yearcalendar.component';

import { LeaverulesComponent } from './components/leaverules/leaverules.component';
import { PerformanceStandComponent } from './components/performance-stand/performance-stand.component';
import { PerformanceEvaComponent } from './components/performance-eva/performance-eva.component';
import { LeavetypeComponent } from './components/leavetype/leavetype.component';
import { HrdashboardComponent } from './components/hrdashboard/hrdashboard.component';
import { ShiftComponent } from './components/shift/shift.component';
//import { IntroPageComponent } from './components/intro-page/intro-page.component';
//import { AppComponent } from 'projects/HaroonH/src/app/app.component';

import { TrainingComponent } from './components/training/training.component';
import { TrainingemployeeComponent } from './components/trainingemployee/trainingemployee.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { EmployeeShiftComponent } from './components/employee-shift/employee-shift.component';
import { AttendanceDashboardComponent } from './components/attendance-dashboard/attendance-dashboard.component';
import { PromotionComponent } from './components/promotion/promotion.component';
import { TransferpostingComponent } from './components/transferposting/transferposting.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: IntroPageComponent,
  // },
  // {
  //   path: 'HR/home',
  //   component: IntroPageComponent,
  // },
  {
    path: 'HR/attendancedashboard',
    component: AttendanceDashboardComponent
  },
  {
    path: 'HR/hrdashboard',
    component: HrdashboardComponent
  },
  {
    path: 'HR/recruitmentApproval',
    component: RecruitmentappComponent
  },
  {
    path: 'HR/communication',
    component: CommunicationComponent
  },
  {
    path: 'HR/job',
    component: JobprofileComponent
  },
  {
    path: 'HR/shift',
    component: ShiftComponent
  },
  {
    path: 'HR/employeeShift',
    component: EmployeeShiftComponent
  },
  {
    path: 'HR/recruitment',
    component: RecruitmentComponent
  },
  {
    path: 'HR/post',
    component: PostComponent
  },
  {
    path: 'HR/test',
    component: TestComponent
  },
  {
    path: 'HR/employee',
    component: EmpolyeeprofileComponent
  },
  {
    path: 'HR/skillstandard',
    component: SkillstandardComponent
  },
  {
    path: 'HR/training',
    component: TrainingComponent
  },
  {
    path: 'HR/trainingreq',
    component: TrainingrequirementsComponent
  },
  {
    path: 'HR/trainingemp',
    component: TrainingemployeeComponent
  },
  {
    path: 'HR/yearcalendar',
    component: YearcalendarComponent
  },
  {
    path: 'HR/leaveRules',
    component: LeaverulesComponent
  },
  {
    path: 'HR/leaveType',
    component: LeavetypeComponent
  },
  {
    path: 'HR/performanceStandard',
    component: PerformanceStandComponent
  },
  {
    path: 'HR/performanceEvaluation',
    component: PerformanceEvaComponent
  },
  {
    path: 'HR/attendance',
    component: AttendanceComponent
  },
  {
    path: 'HR/promotion',
    component: PromotionComponent
  },
  {
    path: 'HR/transfer',
    component: TransferpostingComponent
  },
  // { 
  //   path: 'HR', 
  //   redirectTo: 'HR/home' 
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
