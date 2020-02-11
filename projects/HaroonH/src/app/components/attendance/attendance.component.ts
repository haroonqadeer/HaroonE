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
    disableFlag = false;

  //* list variables
    brachList = [];
    deptList = [];
    sectnList = [];
    employeeList = [];
    tempEmployeeList = [];
    empAttDetList = [];
    managerList = [];
    breakTypeList = [];
    empBreakList = [];
    attTypeList = [];

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

    editFlag = false;

    //* Variables for NgModels
    tblSearch;

    attendanceDate;
    ddlEmployee;
    ddlAttType;
    txtPassword;

    myTimeIn;
    myTimeOut;
    myDeptCd = 0;
    myDtID = 0;
    myShifhCd = 0;  

    txtdPassword = "";
    txtdPin = "";


    available = false;
    absent = false;
    inOffice = false;
    onField = false;
    onLeave = false;
    remote = false;

    attStatus;
    imgPath = null;

    constructor(
        private _formBuilder: FormBuilder,
        private toastr: ToastrManager,
        private http: HttpClient,
        private app: AppComponent
    ) {}

    ngOnInit() {
        //this.brachList = this.app.branchList;
        //this.ddlBranch = this.app.locationId;

        this.getEmployee();
        this.getAttType();
    }

    getEmployee() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getEmployee', { headers: reqHeader }).subscribe((data: any) => {
            
            //this.employeeListMain = data;
            // for (var i = 0; i < data.length; i++) {
            //     this.employeeList.push(data[i]);
            // }

            this.employeeList = data;
            this.tempEmployeeList = data;

            this.app.hideSpinner();
        });

    }

    getAttType() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getAttType', { headers: reqHeader }).subscribe((data: any) => {
            
            this.attTypeList = data;

            this.app.hideSpinner();
        });

    }

    //Function for save attendance
    save() {

        if (this.ddlEmployee == undefined || this.ddlEmployee == "") {
            this.toastr.errorToastr("Please select employee", "Error", {toastTimeout: 2500});
            return false;
        } else if (this.txtPassword == undefined || this.txtPassword == "") {
            this.toastr.errorToastr("Please enter code", "Error", {toastTimeout: 2500});
            return false;
        } else if (this.disableFlag == false && (this.ddlAttType == undefined || this.ddlAttType == "")) {
            this.toastr.errorToastr("Please select availibility", "Error", {toastTimeout: 2500});
            return false;
        }else {

            var attDateTime = new Date();
            var remarks = "-";

            var myAddBreak = "No";
            var attType;
            var BreakTypeId;

            if (this.myTimeIn == null && this.myTimeOut == null) {
                this.myTimeIn = new Date();
                this.myTimeOut = null;
            } 
            else if (this.myTimeIn != null && this.myTimeOut == null) {
                this.myTimeOut = new Date();
            } 
            else if (this.myTimeIn != null && this.myTimeOut != null) {
                myAddBreak = "Yes";
                this.myTimeIn = new Date(); // this.myTimeOut;
                //this.myTimeOut = 
            }


            if (this.disableFlag == true ){
                attType = 1;
            }else {
                attType = this.ddlAttType;
            }

            //+ "DeptCd = " + this.myDeptCd + " --- " + "IndvdlID = " + this.EmpId + " ---- " + "DtID = " + this.myDtID + " --- " + "ShiftCd = " + this.myShifhCd + " --- " + "AttendanceStatCd = " + this.attStatus + " --- "
            //alert("AddBreak = " +  myAddBreak + " --- " + "ApprvngManagerID = " + ManagerId + " --- " + "TimeIn = " + this.myTimeIn + " --- " + "TimeOut = " + this.myTimeOut + " --- " + "Rsn = " + this.attRemarks + " --- " + "TypeCd = " + BreakTypeId);
            // return false;

            //alert("AddBreak = " +  myAddBreak + " --- " + "TimeIn = " + this.myTimeIn + " --- " + "TimeOut = " + this.myTimeOut + " --- " + "Rsn = " + remarks);
            //return false;

            this.app.showSpinner();

            //* ********************************************save data
            var saveData = {
                IndvdlID: this.ddlEmployee,
                AttendanceStatCd: attType,
                Code: this.txtPassword,
                AddBreak: myAddBreak,
                TimeIn: this.myTimeIn,
                TimeOut: this.myTimeOut,
                DeptCd: this.myDeptCd,
                DtID: this.myDtID,
                ShiftCd: this.myShifhCd,
                ApprvngManagerID: 0,
                Rsn: remarks,
                TypeCd: 1, //BreakTypeId,
                ConnectedUser: this.app.empId,
                DelFlag: 0
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

            this.http.post(this.serverUrl + "api/saveEmpAttendance", saveData, { headers: reqHeader }) .subscribe((data: any) => {
                if (data.msg != "Record Saved Successfully!") {
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
                    return false;
                } else {
                    this.app.hideSpinner(); 
                    this.toastr.successToastr(data.msg, "Success!", { toastTimeout: 2500 });
                    this.getEmployee();
                    this.clear();
                    return false;
                }
            });
        }
    }

    clear(){

        this.ddlEmployee = "";
        this.txtPassword = "";
        this.ddlAttType = "";
        this.myTimeIn = "";
        this.myTimeOut = "";
        this.disableFlag = false;
        this.myDeptCd = 0;
        this.myShifhCd = 0;
        this.myDtID = 0;

        this.imgPath = null;
        this.attStatus = '';

    }

    //function for get filtere list
    showEmpDetail(item) {


        if(item.timeIn == null){

            this.myTimeIn = null;
            this.myTimeOut = null;
            this.myDtID = item.dtID;
            this.myShifhCd = item.shiftCd;
            this.myDeptCd = item.deptCd;
            this.disableFlag = false;
            this.ddlEmployee = item.empID;
            this.imgPath = item.path;
            $("#attModal").modal("show");

        }
        else{

            this.myTimeIn = item.timeIn;
            this.myTimeOut = item.timeOut;
            this.myDtID = item.dtID;
            this.myShifhCd = item.shiftCd;
            this.myDeptCd = item.deptCd;
            this.ddlEmployee = item.empID;
            this.imgPath = item.path;

            if(item.timeOut == null){
                this.disableFlag = true;
                this.attStatus = '';
            }

            $("#attModal").modal("show");
        }

        if(item.managerJobPostDeptCd == 0){ 
            this.myDeptCd = item.jobPostDeptCd;
        }else{
            this.myDeptCd = item.managerJobPostDeptCd;
        }

    }

    //function for get filtere list
    getFilterItem(filterOption) {
        var dataList = [];

        if (filterOption == "emp") {

            dataList = this.employeeList.filter( x => x.empID == this.ddlEmployee );

            if(dataList[0].timeIn == null){
                //alert('null called');
                this.myTimeIn = null;
                this.myTimeOut = null;
                this.myDtID = dataList[0].dtID;
                this.myShifhCd = dataList[0].shiftCd;
                this.myDeptCd = dataList[0].deptCd;
                this.imgPath = dataList[0].path;
                this.disableFlag = false;

            }
            else{
                //alert('not null called');
                this.myTimeIn = dataList[0].timeIn;
                this.myTimeOut = dataList[0].timeOut;
                this.myDtID = dataList[0].dtID;
                this.myShifhCd = dataList[0].shiftCd;
                this.myDeptCd = dataList[0].deptCd;

                if(dataList[0].timeOut == null){
                    this.disableFlag = true;
                    this.attStatus = '';
                }
            }

            if(dataList[0].managerJobPostDeptCd == 0){ 
                this.myDeptCd = dataList[0].jobPostDeptCd;
            }else{
                this.myDeptCd = dataList[0].managerJobPostDeptCd;
            }

        }


        if (filterOption == "fws") {

            var available = null;
            var absent = null;
            var inOffice = null;
            var onField = null;
            var onLeave = null;
            var remote = null; 

            if(this.available == true){
                available = 2;
            }

            if(this.absent == true){
                absent = 3;
            }

            if(this.inOffice == true){
                inOffice = 4;
            }

            if(this.onField == true){
                onField = 5;
            }

            if(this.onLeave == true){
                onLeave = 6;
            }

            if(this.remote == true){
                remote = 7;
            }


            if (available == null && absent == null && inOffice == null && onField == null && onLeave == null && remote == null ){
                this.tempEmployeeList = this.employeeList;
            }else {
                dataList = this.employeeList.filter( 
                    x => x.attendanceStatCd == available
                    ||  x.attendanceStatCd == absent
                    || x.attendanceStatCd == inOffice
                    || x.attendanceStatCd == onField
                    || x.attendanceStatCd == onLeave
                    || x.attendanceStatCd == remote
                );

                this.tempEmployeeList = dataList;
            }

        }


        if (filterOption == "empStatus") {

            dataList = this.attTypeList.filter( x => x.attendanceStatCd == this.ddlAttType);

            this.attStatus = dataList[0].attendanceStatName;

        }

    }

}
