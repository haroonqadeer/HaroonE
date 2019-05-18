import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecruitmentComponent } from './components/recruitment/recruitment.component';
import { JobprofileComponent } from './components/jobprofile/jobprofile.component';
import { PostComponent } from './components/post/post.component';
import { RecruitmentappComponent } from './components/recruitmentapp/recruitmentapp.component';

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
import { IntroPageComponent } from './components/intro-page/intro-page.component';

const routes: Routes = [
  {
    path: 'HR/home',
    component: IntroPageComponent,
  },
  {
    path: 'dashboard',
    component: HrdashboardComponent
  },
  {
    path: 'recruitmentApproval',
    component: RecruitmentappComponent
  },
  {
    path: 'job',
    component: JobprofileComponent
  },
  {
    path: 'recruitment',
    component: RecruitmentComponent
  },
  {
    path: 'post',
    component: PostComponent
  },
  {
    path: 'test',
    component: TestComponent
  }, 
  {
    path: 'employee',
    component: EmpolyeeprofileComponent
  },
  {
    path: 'skillstandard',
    component: SkillstandardComponent
  },
  {
    path: 'trainingreq',
    component: TrainingrequirementsComponent
  },
  {
    path: 'yearcalendar',
    component: YearcalendarComponent
  },
  {
    path: 'leaveRules',
    component: LeaverulesComponent
  },
  {
    path: 'HR/leaveType',
    component: LeavetypeComponent
  },
  {
    path: 'performanceStandard',
    component: PerformanceStandComponent
  },
  {
    path: 'performanceEvaluation',
    component: PerformanceEvaComponent
  },
  { path: 'HR', redirectTo: 'HR/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
