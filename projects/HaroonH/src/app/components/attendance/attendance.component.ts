import {Component, ViewChild, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';

declare var $: any;

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"]
})
export class AttendanceComponent implements OnInit {
  serverUrl = "http://localhost:9032/";
  //serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9032/";

  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  //*Bolean variable
  updateFlag = false;
  disableFlag = true;

  //* list variables
  brachList = [];
  deptList = [];
  sectnList = [];
  employeeList = [];
  empAttDetList = [];
  managerList = [];
  breakTypeList = [];
  empBreakList = [];

  tempAttDetList = [];
  tempSectnList = [];
  excelDataList = [];

  //* variables for pagination and orderby pipe
  p = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  //*hidden variables
  EmpId;
  EmpCalCd;
  attStatus;
  editFlag = false;

  myTimeIn;
  myTimeOut;
  myDeptCd = 0;
  myDtID = 0;
  myShifhCd = 0;

  //* Variables for NgModels
  tblSearch;

  attendanceDate;
  ddlBranch;
  ddlDepartment;
  ddlSection;
  ddlBreakType;
  ddlManager;

  attTime;
  attRemarks;

  lblBPS;
  lblJobType;
  lblEmployee;

  chkAddBreak = false;

  txtdPassword = "";
  txtdPin = "";

  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) {}

  ngOnInit() {
    //this.attendanceDate = new Date();

    //this.brachList = this.app.branchList;
    //this.ddlBranch = this.app.locationId;

    this.getEmployee();
  }

  getEmployee() {

    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getEmployee', { headers: reqHeader }).subscribe((data: any) => {
        
        //this.employeeListMain = data;
        for (var i = 0; i < data.length; i++) {
            this.employeeList.push(data[i]);
        }

        this.app.hideSpinner();
    });

}



  
}
