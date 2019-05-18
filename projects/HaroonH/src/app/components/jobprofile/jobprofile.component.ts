import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-jobprofile',
  templateUrl: './jobprofile.component.html',
  styleUrls: ['./jobprofile.component.scss']
})
export class JobprofileComponent implements OnInit {

  edited = false;
  edited1 = false;

  show=false;

  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  formGroup4: FormGroup;
  formGroup5: FormGroup;
  formGroup6: FormGroup;

  cmbType: string[] = [];
  cmbDegree: string[] = [];
  cmbCertificate: string[] = [];
  
  offices: SelectItem[];
  sects: SelectItem[];
  officers: SelectItem[];

  scales: SelectItem[];
  types: SelectItem[];
  // degrees: SelectItem[];
  degrees = [];

  // certificates: SelectItem[];
  certificates = [];
  roles: SelectItem[];
  rules: SelectItem[];
  years: SelectItem[];

  orgs: SelectItem[];
  times: SelectItem[];
  depts: SelectItem[];

  fourthCtrl = '';
  txtdPassword = '';
  txtdPin = '';
  searchDegree = '';
  searchcertification = '';

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
  
    this.formGroup1 = this._formBuilder.group({
      cmbType: ['', Validators.required]
    });
    this.formGroup2 = this._formBuilder.group({
      cmbDegree: ['', Validators.required]
    });
    this.formGroup3 = this._formBuilder.group({
      cmbCertificate: ['', Validators.required]
    });
    this.formGroup4 = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
    this.formGroup5 = this._formBuilder.group({
      fifthCtrl: ['', Validators.required]
    });

    this.offices = [
      {label: 'Head Quarter', value: 'Head Quarter'},
      {label: 'Lahore Branch', value: 'Lahore Branch'}
    ];
    
    this.depts = [
      {label: 'Finance', value: 'Finance'},
      {label: 'Admin', value: 'Admin'},
      {label: 'HR', value: 'HR'}
    ];
    
    this.sects = [
      {label: 'Tax', value: 'Tax'},
      {label: 'Audit', value: 'Audit'}
    ];

    this.officers = [
      {label: 'AD', value: 'AD'},
      {label: 'DD', value: 'DD'},
      {label: 'Director', value: 'Director'}
    ];
    
    this.scales = [
      {label: '1', value: '1'},
      {label: '2', value: '2'},
      {label: '3', value: '3'},
      {label: '4', value: '4'},
      {label: '5', value: '5'},
      {label: '6', value: '6'},
      {label: '7', value: '7'},
      {label: '8', value: '8'},
      {label: '9', value: '9'},
      {label: '10', value: '10'},
      {label: '11', value: '11'},
      {label: '12', value: '12'},
      {label: '13', value: '13'},
      {label: '14', value: '14'},
      {label: '15', value: '15'}
    ];
    
    this.types = [
      {label: 'Regular', value: 'Regular'},
      {label: 'Daily Wages', value: 'Daily Wages'},
      {label: 'Contract', value: 'Contract'}
    ];

    this.degrees = [
      {id: '1', dName: 'BSc', dDesc: 'Bachelor in Computer Science', cName: 'Computer', cDesc: 'Degree Computer Science'},
      {id: '2', dName: 'MBA', dDesc: 'Masters in Accounts', cName: 'Accounts', cDesc: 'Degree Accounts'},
      {id: '3', dName: 'ICs', dDesc: 'Inter In Computer Science', cName: 'Computer', cDesc: 'Inter Degree Computer'}
    ];

    this.certificates = [
      {id: '1', dName: 'VB.Net', dDesc: 'Visual Basic', cName: 'Language', cDesc: 'Certification'},
      {id: '2', dName: 'Quality Assurance', dDesc: 'Software Tesing', cName: 'Testing', cDesc: 'Certifications'},
      {id: '3', dName: 'Game Development', dDesc: 'Making Games', cName: 'Development', cDesc: 'Certifications'}
    ];

    this.roles = [
      {label: 'Voucher Entry', value: 'Voucher Entry'},
      {label: 'Hr Admin', value: 'Hr Admin'},
      {label: 'Finance', value: 'Finance'}
    ];
    
    this.rules = [
      {label: 'Medical Leave', value: 'Medical Leaves'},
      {label: 'Casual Leave', value: 'Casual Leave'},
      {label: 'Sick Leave', value: 'Sick Leave'}
    ];
    
    this.years = [
      {label: '14', value: '14'},
      {label: '12', value: '12'},
      {label: '16', value: '16'}
    ];
    
    this.orgs = [
      {label: 'Private', value: 'Private'},
      {label: 'Govt.', value: 'Govt.'}
    ];

    this.times = [
      {label: '1', value: '1'},
      {label: '2', value: '2'},
      {label: '3', value: '3'}
    ];

  }

  onTypeChange(item){
    
    if(item.label=='Contract'){
      this.show=true;    
    }else{
      this.show=false;
    }
  }
}
