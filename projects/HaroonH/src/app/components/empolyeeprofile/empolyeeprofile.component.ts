import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api'

@Component({
  selector: 'app-empolyeeprofile',
  templateUrl: './empolyeeprofile.component.html',
  styleUrls: ['./empolyeeprofile.component.scss']
})
export class EmpolyeeprofileComponent implements OnInit {

  disabled = false;

  cmbJobType: string[] = [];
  types: SelectItem[];
  txtdPassword = '';
  txtdPin = '';
  
  constructor() { }

  ngOnInit() {

    this.types = [
      {label: 'Contract', value: 'Contract'},
      {label: 'Regular', value: 'Regular'}
    ];

  }

  chkJobType(item){
    if(item == "Regular"){
      this.disabled = true;
    }else{
      this.disabled = false;
    }
  }
}
