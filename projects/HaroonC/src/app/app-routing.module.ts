import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanydashboardComponent } from './components/companydashboard/companydashboard.component';
import { CompanyComponent } from './components/company/company.component';
import { HeadquarterComponent} from './components/headquarter/headquarter.component';
import { BranchComponent } from './components/branch/branch.component';
import { DepartmentComponent } from './components/department/department.component';
import { SectionComponent } from './components/section/section.component';
import { SubsidiarieComponent } from './components/subsidiarie/subsidiarie.component';
import { CurrencyComponent } from './components/currency/currency.component';

const routes: Routes = [
  {
    path: '',
    component: CompanydashboardComponent
  }, {
    path: 'dashboard',
    component: CompanydashboardComponent
  },
  {
    path: 'company',
    component: CompanyComponent
  },
  {
    path: 'headquarter',
    component: HeadquarterComponent
  },
  {
    path: 'branch',
    component: BranchComponent
  },
  {
    path: 'department',
    component: DepartmentComponent
  },
  {
    path: 'section',
    component: SectionComponent
  },
  {
    path: 'subsidiaries',
    component: SubsidiarieComponent
  },
  {
    path: 'currency',
    component: CurrencyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
