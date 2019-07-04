import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

declare var $: any;

@Component({
    selector: 'app-attendance',
    templateUrl: './attendance.component.html',
    styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  //serverUrl = "http://192.168.200.19:3009/";
    serverUrl = "http://localhost:40035/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    //*Bolean variable 
    updateFlag = false;

    //* list variables
    brachList = [];
    deptList = [];
    sectnList = [];
    employeeList = [];
    empAttDetList = [];
    
    tempAttDetList = [];
    tempSectnList = [];
    excelDataList = [];


    //* variables for pagination and orderby pipe
    p = 1;
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';


    //*hidden variables 
    EmpId;
    EmpCalCd;
    attStatus;
    editFlag = false;


    //* Variables for NgModels
    tblSearch;
    
    attendanceDate;
    ddlBranch;
    ddlDepartment;
    ddlSection;

    attTime;
    attRemarks;

    lblBPS;
    lblJobType;
    lblEmployee;

    txtdPassword = '';
    txtdPin = '';   

    constructor(
        private _formBuilder: FormBuilder,
        private toastr: ToastrManager,
        private http: HttpClient,
        private app: AppComponent
    ) { }

    ngOnInit() {    

        this.attendanceDate = new Date();

        this.getDepartment();
        this.getSection();

        this.brachList = this.app.branchList;
        this.ddlBranch = this.app.locationId;
    }



    //Function for get all saved department  
    public getDepartment() {

        if (this.app.locationId == undefined ) {

            setTimeout( () => {
                
                var reqData = {
                    "LocationCd": this.app.locationId
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/getDepartment', reqData, { headers: reqHeader }).subscribe((data: any) => {

                    for (var i = 0; i < data.rows.length; i++) {
                        this.deptList.push({
                            label: data.rows[i].deptName,
                            value: data.rows[i].deptCd
                        });
                    }

                });

                this.getSection();
                this.brachList = this.app.branchList;
                this.ddlBranch = this.app.locationId;

            }, 5000 );

        }
        else {

            //* ********************************************save data 
            var reqData = {
                "LocationCd": this.app.locationId
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/getDepartment', reqData, { headers: reqHeader }).subscribe((data: any) => {

                for (var i = 0; i < data.rows.length; i++) {
                    this.deptList.push({
                        label: data.rows[i].deptName,
                        value: data.rows[i].deptCd
                    });
                }

            });
        }
    }



    //Function for get all saved sections  
    getSection() {

        if (this.app.locationId == undefined ) {
            return false;
        }
        else {

            //* ********************************************save data 
            var reqData = {
                "LocationCd": this.app.locationId
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/getSection', reqData, { headers: reqHeader }).subscribe((data: any) => {

                
                for (var i = 0; i < data.rows.length; i++) {
                    this.tempSectnList.push({
                        label: data.rows[i].deptName,
                        value: data.rows[i].deptCd,
                        parentDeptCd: data.rows[i].parentDeptCd
                    });
                }

            });
        }
    }



    //Function for get specific department employee  
    getDeptEmp() {

        //* ********************************************save data 
        var reqData = {
            "LocationCd": this.ddlBranch,
            "DeptCd": this.ddlDepartment,
            "ParentDeptCd": this.ddlDepartment,
            "AttDate": this.attendanceDate

        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/getDeptEmp', reqData, { headers: reqHeader }).subscribe((data: any) => {

            this.employeeList = data.rows;
            this.empAttDetList = data.det_rows;

        });
    
    }



    //Function for get specific section employee
    getSectEmp() {

        //* ********************************************save data 
        var reqData = {
            "LocationCd": this.ddlBranch,
            "DeptCd": this.ddlSection,
            "ParentDeptCd": this.ddlDepartment,
            "AttDate": this.attendanceDate
        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/getSectEmp', reqData, { headers: reqHeader }).subscribe((data: any) => {

            this.employeeList = data.rows;
            this.empAttDetList = data.det_rows;
        });
    
    }



    clear(){

        this.EmpCalCd = "";
        this.lblBPS = "";
        this.lblJobType = "";
        this.lblEmployee = "";

        this.EmpId = "";
        this.attStatus = 0;

        this.editFlag = false;

        this.attTime = "";
        this.attRemarks = "";

        this.txtdPassword = '';
        this.txtdPin = ''; 

    }


    edit(item){

        this.clear();

        this.EmpId = item.indvdlID;
        this.lblEmployee = item.indvdlFullName;
        this.lblJobType = item.jobDesigName;
        this.lblBPS = item.payGradeName;
        this.attStatus = item.attendanceStatCd;

        if(this.attStatus == 1){
            this.attStatus = 2;
        }else if(this.attStatus == 2){
            this.attStatus = 1;
        }

    }


    //Function for save and update leave nature 
    save() {

        if (this.ddlDepartment == undefined || this.ddlDepartment == "" ) {
            this.toastr.errorToastr('Please select department', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.attendanceDate == undefined || this.attendanceDate == "" ) {
            this.toastr.errorToastr('Please enter date', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.attTime == undefined || this.attTime == "" ) {
            this.toastr.errorToastr('Please enter time', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            if (this.attRemarks == undefined || this.attRemarks == "") {
                this.attRemarks = "-";
            }

            if (this.EmpCalCd != '') {

                //this.app.showSpinner();
                // this.app.hideSpinner();
                //* ********************************************update data 
                var updateData = {
                    "EmpCalCd": this.EmpCalCd,
                    "DeptCd": this.ddlDepartment,
                    "IndvdlID": this.EmpId,
                    "AttendanceStatCd": this.attStatus,
                    "AttTime": this.attTime,
                    "Remarks": this.attRemarks,
                    "AttDate": this.attendanceDate,
                    "ConnectedUser": "12000",
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token 

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveEmpAttendance', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Updated Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        if(this.ddlSection == undefined || this.ddlSection == ""){
                            this.getDeptEmp();
                        }else{
                            this.getSectEmp();
                        }
                        return false;
                    }
                });

            }
            else {

                //* ********************************************save data 
                var saveData = {
                    "EmpCalCd": 0,
                    "DeptCd": this.ddlDepartment,
                    "IndvdlID": this.EmpId,
                    "AttendanceStatCd": this.attStatus,
                    "AttTime": this.attTime,
                    "Remarks": this.attRemarks,
                    "AttDate": this.attendanceDate,
                    "ConnectedUser": "12000",
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveEmpAttendance', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        
                        if(this.ddlSection == undefined || this.ddlSection == ""){
                            this.getDeptEmp();
                        }else{
                            this.getSectEmp();
                        }
                        return false;
                    }
                });
            }
        }
    }


    //function for get filtere list from job post
    getFilterItem(filterOption) {
        
        var dataList = [];

        if(filterOption == "section"){

            this.sectnList = [];
            this.ddlSection = "";

            dataList = this.tempSectnList.filter(x => x.parentDeptCd == this.ddlDepartment);

            for (var i = 0; i < dataList.length; i++) {
                this.sectnList.push({
                    label: dataList[i].label,
                    value: dataList[i].value,
                });
            }

            this.getDeptEmp();
        }
    }
}
