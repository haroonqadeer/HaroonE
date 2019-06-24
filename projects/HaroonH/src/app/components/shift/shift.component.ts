import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {

  serverUrl = "http://localhost:3006/";

  cmbShift = "";
  cmbDepartment = "";
  startTime = "";
  endTime = "";
  
  departmentList = [];
  shiftList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getShift();
    this.getDepartment();
  }

  getShift() {
    
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getShift', { headers: reqHeader }).subscribe((data: any) => {

      this.shiftList = data;
    });
  }

  getDepartment() {
    
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getDepartment', { headers: reqHeader }).subscribe((data: any) => {

      this.departmentList = data;
    });
  }

  saveShift(){
    
    if (this.cmbShift == '') {
      this.toastr.errorToastr('Please select Shift', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.cmbDepartment == '') {
      this.toastr.errorToastr('Please Select Department', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.startTime == '') {
      this.toastr.errorToastr('Please Select Start Time', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.endTime == '') {
      this.toastr.errorToastr('Please Select End Time', 'Error', { toastTimeout: (2500) });
      return;
    } else {

      var saveData = {
        shiftCd: this.cmbShift,
        deptList: JSON.stringify(this.cmbDepartment),
        startTime: this.startTime,
        endTime: this.endTime
      };

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(this.serverUrl + 'api/saveDepartmentShift', saveData, { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg == "Record Saved Successfully!") {
          this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
          this.clear();
          //this.app.hideSpinner();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
          //$('#companyModal').modal('hide');
          //this.app.hideSpinner();
          return false;
        }
      });

    }
  }
  clear(){
    this.cmbDepartment = "";
    this.cmbShift = "";
    this.startTime = "";
    this.endTime = "";
  }
}
