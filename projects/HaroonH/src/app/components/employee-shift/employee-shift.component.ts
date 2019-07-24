import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';

declare var $: any;

@Component({
  selector: 'app-employee-shift',
  templateUrl: './employee-shift.component.html',
  styleUrls: ['./employee-shift.component.scss']
})
export class EmployeeShiftComponent implements OnInit {

  //serverUrl = "http://localhost:9027/";
  serverUrl = "http://52.163.189.189:9027/";
  
  //* variables for pagination and orderby pipe
  p = 1;
  //pGroup = 1;
  order = 'info.name';
  reverse = false;
  // orderGroup = 'info.name';
  // reverseGroup = false;
  sortedCollection: any[];
  itemPerPage = '7';

  shiftSearch = '';
  officeName = '';
  departmentName = '';
  designationName = '';

  employeeShift = [];
  officeList = [];
  departmentList = [];
  designationList = [];
  shiftList = [];

  constructor(private toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient) { }

  ngOnInit() {
  
    this.getShift();
    this.getEmployeeShift();
    this.getBranch();
  }

  getBranch(){
    
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getBranch?cmpnyID=59', { headers: reqHeader }).subscribe((data: any) => {

      this.officeList = data;
      
      this.app.hideSpinner();

    });

  }

  getShift(){
    
    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getShift', { headers: reqHeader }).subscribe((data: any) => {

      this.shiftList = data;

      this.app.hideSpinner();

    });

  }

  getDepartment(){

  }
  
  getDesignation(){
    
  }

  getEmployeeShift(){
    
    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getEmployeeShift?cmpnyID=59', { headers: reqHeader }).subscribe((data: any) => {

      this.employeeShift = data;

      this.app.hideSpinner();

    });

  }

  onBranchChange(item){
    
  }
  
  onDepartmentChange(item){
    
  }
  
  onDesignationChange(item){
    
  }

  saveEmployeeShift(item){

    // alert(item.shiftCd)
    // alert(item.toDate)
    if(item.fromDate > item.toDate){
      this.toastr.errorToastr("Select Correct Date!", 'Error!', { toastTimeout: (2500) });
        return;
    }
    // alert(item.fromDate);//return;
    this.app.showSpinner();

    var saveData = {
      empID: item.empID,
      shiftCd: item.shiftCd,
      DeptCd: item.deptCd,
      fromDate: item.fromDate,
      toDate: item.toDate
    };

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(this.serverUrl + 'api/saveEmployeeShift', saveData, { headers: reqHeader }).subscribe((data: any) => {

      if (data.msg == "Record Saved Successfully!") {
        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
        this.getEmployeeShift();
        this.app.hideSpinner();
        return false;
      } else if (data.msg == "Record Updated Successfully!") {
        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
        this.getEmployeeShift();
        this.app.hideSpinner();
        return false;
      } else {
        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
        this.app.hideSpinner();
        return false;
      }
    });

  }

  //function for sort table data 
  setOrder(value: string) {
    if (this.order === value) {
        this.reverse = !this.reverse;
    }
    this.order = value;
  }

}
