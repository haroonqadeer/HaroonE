import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';

import {
    IgxExcelExporterOptions,
    IgxExcelExporterService,
    IgxGridComponent,
    IgxCsvExporterService,
    IgxCsvExporterOptions,
    CsvFileTypes
} from "igniteui-angular";

declare var $: any;

@Component({
    selector: 'app-leaverules',
    templateUrl: './leaverules.component.html',
    styleUrls: ['./leaverules.component.scss']
})
export class LeaverulesComponent implements OnInit {

    //serverUrl = "http://localhost:9014/";
    serverUrl = "http://localhost:13759/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }


    //*Bolean variable 
    updateFlag = false;

    //* list for excel data
    excelDataList = [];

    leaveTypeList = [];
    leaveNatureList = [];
    leaveLimitTypeList = [];
    leaveRuleList = [];


    //* variables for pagination and orderby pipe
    p = 1;
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';


    //* Variables for NgModels
    tblSearch;

    leaveRuleId;

    leaveType;
    leaveNature;
    leaveLimit;
    limitType;

    txtdPassword = '';
    txtdPin = '';


    constructor(public toastr: ToastrManager,
        private app: AppComponent,
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService,
        private http: HttpClient) { }

    ngOnInit() {

        this.getLeaveTypes();
        this.getLeaveNature();
        this.getLeaveLimitType();
        this.getLeaveRules();
    }

    @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel


    //function for get all saved leave rules 
    getLeaveRules() {

        this.app.showSpinner();

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getLeaveRule', { headers: reqHeader }).subscribe((data: any) => {
            this.leaveRuleList = data
            
            this.app.hideSpinner();
        });

    }


    //function for get all saved leave limit types 
    getLeaveLimitType() {

        this.app.showSpinner();

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getLeaveLimit', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.leaveLimitTypeList.push({
                    label: data[i].leaveLmtName,
                    value: data[i].leaveLmtCd
                });
            }

            this.app.hideSpinner();

        });

    }


    //function for get all saved leave types 
    getLeaveTypes() {

        this.app.showSpinner();

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getLeaveType', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.leaveTypeList.push({
                    label: data[i].leaveTypeName,
                    value: data[i].leaveTypeCd
                });
            }

            this.app.hideSpinner();

        });

    }


    //function for get all saved leave nature 
    getLeaveNature() {
        
        this.app.showSpinner();

        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getLeaveNature', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.leaveNatureList.push({
                    label: data[i].leaveNatureName,
                    value: data[i].leaveNatureCd
                });
            }

            this.app.hideSpinner();
        });

    }


    //Function for save and update leave Type 
    save() {

        var limitType = parseInt(this.limitType);
        var leaveLimit = parseInt(this.leaveLimit);

        if (this.leaveType == '') {
            this.toastr.errorToastr('Please enter leave type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.leaveNature == '') {
            this.toastr.errorToastr('Please enter leave nature', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.leaveLimit == '' || this.leaveLimit == 0) {
            this.toastr.errorToastr('Please enter leave limit', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.limitType == '') {
            this.toastr.errorToastr('Please enter leave limit type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (limitType == 1 && leaveLimit > 10) {
            this.toastr.errorToastr('Leave limit exceeded. Maximum 10 allowed.', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (limitType == 2 && leaveLimit > 25) {
            this.toastr.errorToastr('Leave limit exceeded. Maximum 25 allowed.', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (limitType == 3 && leaveLimit > 40) {
            this.toastr.errorToastr('Leave limit exceeded. Maximum 40 allowed.', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (limitType == 4 && leaveLimit > 60) {
            this.toastr.errorToastr('Leave limit exceeded. Maximum 60 allowed.', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            this.app.showSpinner();

            if (this.leaveRuleId != '') {

                //* ********************************************update data 
                var updateData = {
                    "LeaveRuleID": this.leaveRuleId,
                    "LeaveTypeCd": this.leaveType,
                    "LeaveNatureCd": this.leaveNature,
                    "LeaveLmtCd": limitType,
                    "DdctnTypeCd": 1,
                    "DdctnSubTypeCd": 1,
                    "LeaveCalcMthdCd": 1,
                    "LeaveLmtAmoUNt": leaveLimit,
                    "ConnectedUser": this.app.empId,
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveLeaveRule', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Updated Successfully!") {
                        this.app.hideSpinner();
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        this.app.hideSpinner();
                        $('#newRuleModal').modal('hide');
                        this.getLeaveRules();
                        return false;
                    }
                });

            }
            else {


                //* ********************************************save data 
                var saveData = {
                    "LeaveRuleID": 0,
                    "LeaveTypeCd": this.leaveType,
                    "LeaveNatureCd": this.leaveNature,
                    "LeaveLmtCd": limitType,
                    "DdctnTypeCd": 1,
                    "DdctnSubTypeCd": 1,
                    "LeaveCalcMthdCd": 1,
                    "LeaveLmtAmoUNt": leaveLimit,
                    "ConnectedUser": this.app.empId,
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveLeaveRule', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.app.hideSpinner();
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.app.hideSpinner();
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        this.getLeaveRules();
                        return false;
                    }
                });
            }
        }
    }


    //function for edit existing leave type 
    edit(item) {

        this.clear();
        this.updateFlag = true;

        this.leaveRuleId = item.leaveRuleID;
        this.leaveType = item.leaveTypeCd;
        this.leaveNature = item.leaveNatureCd;
        this.limitType = item.leaveLmtCd;
        this.leaveLimit = item.leaveLmtAmoUNt;

    }


    //functions for delete leave type
    deleteTemp(item) {
        this.clear();
        this.leaveRuleId = item.leaveRuleID
    }


    delete() {
        if (this.txtdPassword == '') {
            this.toastr.errorToastr('Please enter password', 'Error', { toastTimeout: (2500) });
            return false
        }
        else if (this.txtdPin == '') {
            this.toastr.errorToastr('Please enter PIN', 'Error', { toastTimeout: (2500) });
            return false
        }
        else if (this.leaveRuleId == '') {
            this.toastr.errorToastr('Invalid delete request', 'Error', { toastTimeout: (2500) });
            return false
        }
        else {

            this.app.showSpinner();
            

            //* ********************************************update data 
            var updateData = {

                "LeaveRuleID": this.leaveRuleId,
                "LeaveTypeCd": 0,
                "LeaveNatureCd": 0,
                "LeaveLmtCd": 0,
                "DdctnTypeCd": 1,
                "DdctnSubTypeCd": 1,
                "LeaveCalcMthdCd": 1,
                "LeaveLmtAmoUNt": 0,
                "ConnectedUser": this.app.empId,
                "DelFlag": 1
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/saveLeaveRule', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Deleted Successfully!") {
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    this.app.hideSpinner();
                    $('#deleteModal').modal('hide');
                    this.getLeaveRules();
                    this.clear();
                    return false;
                }
            });
        }
    }


    //function for empty all fields
    clear() {

        this.updateFlag = false;

        this.leaveRuleId = '';
        this.leaveType = '';
        this.leaveNature = '';
        this.leaveLimit = '';
        this.limitType = '';

        this.txtdPassword = '';
        this.txtdPin = '';

    }



    //function for sort table data 
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }

    printDiv() {

        // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

        // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
        // var cssAddress = ".cssAddress {font-size: 16px; }";
        // var cssContact = ".cssContact {font-size: 16px; }";

        // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

        var printCss = this.app.printCSS();


        //printCss = printCss + "";

        var contents = $("#printArea").html();

        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();

        //Create a new HTML document.
        frameDoc.document.write('<html><head><title>DIV Contents</title>' + "<style>" + printCss + "</style>");


        //Append the external CSS file.  <link rel="stylesheet" href="../../../styles.scss" />  <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
        frameDoc.document.write('<style type="text/css" media="print">/*@page { size: landscape; }*/</style>');

        frameDoc.document.write('</head><body>');

        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');

        frameDoc.document.close();


        //alert(frameDoc.document.head.innerHTML);
        // alert(frameDoc.document.body.innerHTML);

        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 500);
    }
    // <<<<<<< HEAD


    downloadPDF() { }


    downloadCSV() {
        //alert('CSV works');
        // case 1: When tblSearch is empty then assign full data list
        if (this.tblSearch == "") {
            var completeDataList = [];
            for (var i = 0; i < this.leaveRuleList.length; i++) {
                //alert(this.tblSearch + " - " + this.skillCriteriaList[i].departmentName)
                completeDataList.push({
                    LeaveType: this.leaveRuleList[i].leaveTypeName,
                    Nature: this.leaveRuleList[i].leaveNatureName,
                    Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
                    Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
                });
            }
            this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("LeaveRulesCompleteCSV", CsvFileTypes.CSV));
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.tblSearch != "") {
            var filteredDataList = [];
            for (var i = 0; i < this.leaveRuleList.length; i++) {
                if (this.leaveRuleList[i].leaveTypeName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.leaveRuleList[i].leaveNatureName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.leaveRuleList[i].leaveLmtName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.leaveRuleList[i].leaveLmtAmoUNt == this.tblSearch) {
                    filteredDataList.push({
                        LeaveType: this.leaveRuleList[i].leaveTypeName,
                        Nature: this.leaveRuleList[i].leaveNatureName,
                        Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
                        Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
                    });
                }
            }

            if (filteredDataList.length > 0) {
                this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("LeaveRulesFilterCSV", CsvFileTypes.CSV));
            } else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
        }
    }


    downloadExcel() {
        //alert('Excel works');
        // case 1: When tblSearch is empty then assign full data list
        if (this.tblSearch == "") {
            //var completeDataList = [];
            for (var i = 0; i < this.leaveRuleList.length; i++) {
                this.excelDataList.push({
                    LeaveType: this.leaveRuleList[i].leaveTypeName,
                    Nature: this.leaveRuleList[i].leaveNatureName,
                    Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
                    Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
                });
            }
            this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("LeaveRulesCompleteExcel"));
            this.excelDataList = [];
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.tblSearch != "") {
            for (var i = 0; i < this.leaveRuleList.length; i++) {
                if (this.leaveRuleList[i].leaveTypeName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.leaveRuleList[i].leaveNatureName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.leaveRuleList[i].leaveLmtName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.leaveRuleList[i].leaveLmtAmoUNt == this.tblSearch) {
                    this.excelDataList.push({
                        LeaveType: this.leaveRuleList[i].leaveTypeName,
                        Nature: this.leaveRuleList[i].leaveNatureName,
                        Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
                        Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
                    });
                }
            }

            if (this.excelDataList.length > 0) {
                //alert("Filter List " + this.excelDataList.length);

                this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("LeaveRulesFilterExcel"));
                this.excelDataList = [];
            }
            else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
        }
    }


    // =======
    // >>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
}
