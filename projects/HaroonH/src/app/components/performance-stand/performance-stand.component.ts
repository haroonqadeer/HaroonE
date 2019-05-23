import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-performance-stand',
  templateUrl: './performance-stand.component.html',
  styleUrls: ['./performance-stand.component.scss']
})
export class PerformanceStandComponent implements OnInit {

  edited = false;
  edited1 = false;

  performanceId = '';
  txtdPassword = '';
  txtdPin = '';
  
  selectedSkill: string[] = [];
  selectedType: string[] = [];
  selectedDeduction: string[] = [];
  profiles: SelectItem[];
  skills: SelectItem[];
  
  constructor() {
    this.profiles = [
      {label: 'Accountant', value: 'Accountant'},
      {label: 'Assistant', value: 'Assistant'},
      {label: 'Cashier', value: 'Cashier'}
    ];
    this.skills = [
      {label: 'Communication Skills', value: 'Communication Skills'},
      {label: 'PHP', value: 'PHP'},
      {label: 'C#', value: 'C#'},
      {label: 'Angular', value: 'Angular'}
    ];
  }

  ngOnInit() {
    document.getElementById("addProfile").style.visibility = "hidden";
  }

  add(){
    document.getElementById("addProfile").style.visibility = "visible";
   // $('.addProfile').toggle();  
    //window.alert('ok')
  }
  
  addData(){
    document.getElementById("addProfile").style.visibility = "hidden";
   // $('.addProfile').toggle();  
    //window.alert('ok')
  }
}
