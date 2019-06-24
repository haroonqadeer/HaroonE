import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {TreeTableModule} from 'primeng/treetable';
import {DropdownModule} from 'primeng/dropdown';
import {ToastModule} from 'primeng/toast';
import {MultiSelectModule} from 'primeng/multiselect';
import {CalendarModule} from 'primeng/calendar';
import {SlideMenuModule} from 'primeng/slidemenu';
import {FullCalendarModule} from 'primeng/fullcalendar';

@NgModule({
  imports: [
    CommonModule,
    OrganizationChartModule,
    ButtonModule,
    DialogModule,
    TreeTableModule,
    DropdownModule,
    ToastModule,
    MultiSelectModule,
    CalendarModule,
    SlideMenuModule,
    FullCalendarModule
  ],
  exports: [
    OrganizationChartModule,
    ButtonModule,
    DialogModule,
    TreeTableModule,
    DropdownModule,
    ToastModule,
    MultiSelectModule,
    CalendarModule,
    SlideMenuModule,
    FullCalendarModule
  ],
  declarations: []
})
export class PNPrimeModule { }
