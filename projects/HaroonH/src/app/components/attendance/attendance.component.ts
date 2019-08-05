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

    //serverUrl = "http://localhost:9032/";
    serverUrl = "http://52.163.189.189:9032/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

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
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';


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
        this.getBreakType();

        this.brachList = this.app.branchList;
        this.ddlBranch = this.app.locationId;
    }


    //function for get all saved break types
    getBreakType() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getBreakType', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.breakTypeList.push({
                    label: data[i].typeName,
                    value: data[i].typeCd
                });
            }

        });

    }




    //Function for get all saved department  
    public getDepartment() {

        if (this.app.locationId == undefined ) {

            setTimeout( () => {
                
                var reqData = {
                    "LocationCd": this.app.locationId
                };

                this.app.showSpinner();
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

                    this.app.hideSpinner();

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

            this.app.showSpinner();
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

                this.app.hideSpinner();

            });
        }
    }



    //Function for get all saved sections  
    getSection() {

        if (this.app.locationId == undefined ) {
            return false;
        }
        else {

            this.app.showSpinner();
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

                this.app.hideSpinner();

            });
        }
    }



    //Function for get specific department employee  
    getDeptEmp() {

        this.app.showSpinner();
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
            this.empBreakList = data.breakDetail;

            this.app.hideSpinner();

        });
    
    }



    //Function for get specific section employee
    getSectEmp() {

        this.app.showSpinner();
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

            this.app.hideSpinner();

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

        this.ddlBreakType = "";
        this.chkAddBreak = false;

        this.txtdPassword = '';
        this.txtdPin = ''; 

    }


    edit(item){

        this.clear();

        this.EmpId = item.indvdlID;
        this.myDtID = item.dtID;
        this.myShifhCd = item.shiftCd;
        this.myTimeIn = item.timeIn;
        this.myTimeOut = item.timeOut;
        this.myDeptCd = item.deptCd;


        this.lblEmployee = item.indvdlFullName;
        this.lblJobType = item.jobDesigName;
        this.lblBPS = item.payGradeName;
        this.attStatus = item.attendanceStatCd;

        if(this.attStatus == null || this.attStatus == 0){
            this.attStatus = 2;
        }


        if(this.myTimeOut == null){
            this.chkAddBreak  = false;
        }else{
            this.chkAddBreak = true;
        }

        

        this.getFilterItem("empBreak");

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
        else if (this.chkAddBreak == true && (this.ddlBreakType == undefined || this.ddlBreakType == "" )) {
            this.toastr.errorToastr('Please enter break type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            if (this.attRemarks == undefined || this.attRemarks == "") {
                this.attRemarks = "-";
            }

            var myAddBreak = "No";
            var ManagerId;
            var BreakTypeId;


            if(this.chkAddBreak == true){
                myAddBreak = "Yes";
                this.myTimeIn = this.attTime;
            }


            if(this.ddlManager == undefined || this.ddlManager == ""){
                ManagerId = 0;
            }else{
                ManagerId = this.ddlManager;
            }


            if(this.ddlBreakType == undefined || this.ddlBreakType == ""){
                BreakTypeId = 0;
            }else{
                BreakTypeId = this.ddlBreakType;
            }



            if(this.myTimeIn == null && this.myTimeOut == null){
                this.myTimeIn = this.attTime;
                this.myTimeOut = null;
            }else if (this.myTimeIn != null && this.myTimeOut == null) {
                //this.myTimeIn = this.attTime;
                this.myTimeOut = this.attTime;
            }


            //+ "DeptCd = " + this.myDeptCd + " --- " + "IndvdlID = " + this.EmpId + " ---- " + "DtID = " + this.myDtID + " --- " + "ShiftCd = " + this.myShifhCd + " --- " + "AttendanceStatCd = " + this.attStatus + " --- " 
            // alert("AddBreak = " +  myAddBreak + " --- " + "ApprvngManagerID = " + ManagerId + " --- " + "TimeIn = " + this.myTimeIn + " --- " + "TimeOut = " + this.myTimeOut + " --- " + "Rsn = " + this.attRemarks + " --- " + "TypeCd = " + BreakTypeId);
            // return false;

            this.app.showSpinner();
            
            //* ********************************************save data 
            var saveData = {
                "AddBreak": myAddBreak,
                "DeptCd": this.myDeptCd,
                "IndvdlID": this.EmpId,
                "DtID": this.myDtID,
                "ShiftCd": this.myShifhCd,
                "AttendanceStatCd": this.attStatus,
                "ApprvngManagerID": ManagerId,
                "TimeIn": this.myTimeIn,
                "TimeOut": this.myTimeOut,
                "Rsn": this.attRemarks,
                "TypeCd": BreakTypeId,
                "ConnectedUser": "12000",
                "DelFlag": 0
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/saveEmpAttendance', saveData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Saved Successfully!") {
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {
                    this.app.hideSpinner();
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    
                    if(this.ddlSection == undefined || this.ddlSection == ""){
                        this.getDeptEmp();
                    }else{
                        this.getSectEmp();
                    }

                    this.chkAddBreak = false;

                    $('#profileModal').modal('hide');

                    return false;
                }
            });
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



        if(filterOption == "empBreak"){

            dataList = this.empBreakList.filter(x => x.deptCd == this.myDeptCd && x.empID == this.EmpId && x.dtID == this.myDtID && x.shiftCd == this.myShifhCd);

            this.empBreakList = dataList;
        }


        
    }
}
