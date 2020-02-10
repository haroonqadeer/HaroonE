import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TreeNode } from "primeng/api";
import { ToastrManager } from "ng6-toastr-notifications";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";

import { AppComponent } from "src/app/app.component";

declare var $: any;

@Component({
    selector: "app-employee-shift",
    templateUrl: "./employee-shift.component.html",
    styleUrls: ["./employee-shift.component.scss"]
})
export class EmployeeShiftComponent implements OnInit {

    serverUrl = "http://localhost:9027/";
    //serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9027/";

    //* variables for pagination and orderby pipe
    p = 1;
    //pGroup = 1;
    order = "info.name";
    reverse = false;
    // orderGroup = 'info.name';
    // reverseGroup = false;
    sortedCollection: any[];
    itemPerPage = "7";

    officeName = "";
    departmentName = "";
    designationName = "";
    tblSearch;
    shiftSearch;


    ddlShift;
    dtpFromDate;
    dtpToDate;
    lblEmpName;
    lblEmpDesig;
    hdnEmpId = 0;
    hdnDeptId;

    employeeShift = [];
    officeList = [];
    departmentList = [];
    designationList = [];
    shiftList = [];
    employeeShiftDetail = [];

    constructor(
        private toastr: ToastrManager,
        private app: AppComponent,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.getShift();
        this.getEmployeeShift();
        this.getBranch();
    }

    getBranch() {
        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http
        .get(this.serverUrl + "api/getBranch?cmpnyID=59", { headers: reqHeader })
        .subscribe((data: any) => {
            this.officeList = data;

            this.app.hideSpinner();
        });
    }

    getShift() {

        this.app.showSpinner();

        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http.get(this.serverUrl + "api/getShift", { headers: reqHeader }).subscribe((data: any) => {

            this.shiftList = data;
            this.app.hideSpinner();

        });
    }

    //function for get departments 
    getDepartment(BranchCode) {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
        
        this.http.get(this.serverUrl + "api/getDepartment?cmpnyID=" + this.app.cmpnyId + "&branchCd="+ BranchCode +"", { headers: reqHeader }).subscribe((data: any) => {

            this.departmentList = data;

            this.app.hideSpinner();
        });
    }

    //function for get departments 
    getDesignation(BranchCode, DeptCode) {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
        
        this.http.get(this.serverUrl + "api/getDesignation?cmpnyID=" + this.app.cmpnyId + "&branchCd="+ BranchCode + "&deptCd=" + DeptCode + "", { headers: reqHeader }).subscribe((data: any) => {

            this.designationList = data;

            this.app.hideSpinner();
        });
    }

    getEmployeeShift() {
        this.app.showSpinner();

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http.get(this.serverUrl + "api/getEmployeeShift?cmpnyID=59", {headers: reqHeader}).subscribe((data: any) => {
            this.employeeShift = data;
            this.app.hideSpinner();
        });
    }


    saveEmployeeShift(item) {

        if (item.shiftCd == undefined || item.shiftCd == "" || item.shiftCd == null ) {
            this.toastr.errorToastr("Please Select Shift!", "Error!", { toastTimeout: 2500 });
            return;
        } else if (item.fromDate == undefined || item.fromDate == "" || item.fromDate == null ) {
            this.toastr.errorToastr("Please Select From Date!", "Error!", { toastTimeout: 2500 });
            return;
        } else if (item.toDate == undefined || item.toDate == "" || item.toDate == null ) {
            this.toastr.errorToastr("Please Select To Date!", "Error!", { toastTimeout: 2500 });
            return;
        } else if (item.fromDate > item.toDate) {
            this.toastr.errorToastr("Select Correct Date!", "Error!", { toastTimeout: 2500 });
            return;
        }

        
        //alert("Employee = " + item.empID + " ===== Shift = " + item.shiftCd + " ===== Depart = " + item.deptCd + " ===== fromDate = " + item.fromDate + " ===== toDate = " + item.toDate);
        //return false

        this.app.showSpinner();

        var saveData = {
            empID: item.empID,
            shiftCd: item.shiftCd,
            DeptCd: item.deptCd,
            fromDate: item.fromDate,
            toDate: item.toDate
        };

        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http.post(this.serverUrl + "api/saveEmployeeShift", saveData, { headers: reqHeader }).subscribe((data: any) => {
            if (data.msg == "Record Saved Successfully!") {
                this.toastr.successToastr(data.msg, "Success!", {toastTimeout: 2500});
                this.getEmployeeShift();
                this.app.hideSpinner();
                return false;
            } else if (data.msg == "Record Updated Successfully!") {
                this.toastr.successToastr(data.msg, "Success!", {toastTimeout: 2500});
                this.getEmployeeShift();
                this.app.hideSpinner();
                return false;
            } else {
                this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
                this.app.hideSpinner();
                return false;
            }
        });
    }

    updateEmployeeShift() {

        if (this.hdnEmpId == undefined || this.hdnEmpId == 0 ) {
            this.toastr.errorToastr("Please Select Employee!", "Error!", { toastTimeout: 2500 });
            return;
        } else if (this.dtpFromDate == undefined || this.dtpFromDate == "" || this.dtpFromDate == null ) {
            this.toastr.errorToastr("Please Select From Date!", "Error!", { toastTimeout: 2500 });
            return;
        } else if (this.dtpToDate == undefined || this.dtpToDate == "" || this.dtpToDate == null ) {
            this.toastr.errorToastr("Please Select To Date!", "Error!", { toastTimeout: 2500 });
            return;
        } else if (this.dtpFromDate > this.dtpToDate) {
            this.toastr.errorToastr("Select Correct Date!", "Error!", { toastTimeout: 2500 });
            return;
        }

        
        //alert("Employee = " + this.hdnEmpId + " ===== Shift = " + this.ddlShift + " ===== Depart = " + this.hdnDeptId + " ===== fromDate = " + this.dtpFromDate + " ===== toDate = " + this.dtpToDate);
        //return false

        this.app.showSpinner();

        var saveData = {
            empID: this.hdnEmpId,
            shiftCd: this.ddlShift,
            DeptCd: this.hdnDeptId,
            fromDate: this.dtpFromDate,
            toDate: this.dtpToDate
        };

        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http.post(this.serverUrl + "api/saveEmployeeShift", saveData, { headers: reqHeader }).subscribe((data: any) => {
            if (data.msg == "Record Saved Successfully!") {
                this.toastr.successToastr(data.msg, "Success!", {toastTimeout: 2500});
                this.getEmployeeShift();
                this.app.hideSpinner();
                return false;
            } else if (data.msg == "Record Updated Successfully!") {
                this.toastr.successToastr(data.msg, "Success!", {toastTimeout: 2500});
                this.getEmployeeShift();
                this.app.hideSpinner();
                return false;
            } else {
                this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
                this.app.hideSpinner();
                return false;
            }
        });
    }


    //function for edit shift
    editShift(item) {

        this.hdnEmpId = item.empID;
        this.hdnDeptId = item.deptCd;

        this.ddlShift = item.shiftCd;
        this.dtpFromDate = item.fromDate;
        this.dtpToDate = item.toDate;

    }

    //function for sort table data
    setOrder(value: string) {
        if (this.order === value) {
        this.reverse = !this.reverse;
        }
        this.order = value;
    }


    //function for get filtere list
    getFilterItem(filterData, dList) {
        
        var dataList = [];
        this.hdnEmpId = 0;

        if (filterData == "branch") {
            dataList = this.officeList.filter( x => x.locationCd == this.officeName);

            this.tblSearch = dataList[0].locationName;
        }

        if (filterData == "dept") {
            dataList = this.departmentList.filter( x => x.deptCd == this.departmentName);

            this.tblSearch = dataList[0].deptName;
        }

        if (filterData == "desig") {
            dataList = this.designationList.filter( x => x.jobDesigID == this.designationName);

            this.tblSearch = dataList[0].jobDesigName;
        }

        if (filterData == "empdetail") {

            this.lblEmpName = dList.indvdlFullName;
            this.lblEmpDesig = dList.jobDesigName;
            this.hdnDeptId = dList.deptCd;
            this.hdnEmpId = dList.empID;

            dataList = this.employeeShift.filter( x => x.empID == dList.empID);
            
            this.employeeShiftDetail = dataList;
        }

    }

}
