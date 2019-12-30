import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OrderPipe } from 'ngx-order-pipe';
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
    selector: 'app-leavetype',
    templateUrl: './leavetype.component.html',
    styleUrls: ['./leavetype.component.scss']
})
export class LeavetypeComponent implements OnInit {

    //serverUrl = "http://localhost:9012/";
    serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9012/";

    tokenKey = "token";
leaveHeading = 'Add';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    updateFlag = false;

    //* list for excel data
    excelDataListType = [];
    excelDataListNature = [];

    leaveTypeList = [];
    typeList = [];
    leaveNatureList = [];


    //* variables for pagination and orderby pipe
    p = 1;
    p1 = 1;
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';
    itemPerPage1 = '10';


    //* Variables for NgModels
    tblSearchType;
    tblSearchNature;

    leaveTypeId = '';
    leaveType = '';
    leaveDescription = '';
    noOfLeave = '';
    appliedFrom = '';

    leaveNatureId = '';
    leaveNature = '';
    natureDescription = '';

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

    }

    @ViewChild("excelDataContentType") public excelDataContentType: IgxGridComponent; //For excel
    @ViewChild("excelDataContentNature") public excelDataContentNature: IgxGridComponent; //For excel



    //function for get all saved leave types 
    getLeaveTypes() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getLeaveType', { headers: reqHeader }).subscribe((data: any) => {
            this.leaveTypeList = data;
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
            this.leaveNatureList = data;
            this.app.hideSpinner();
        });

    }


    //Function for save and update leave Type 
    save() {
        if (this.leaveType.trim() == '') {
            this.toastr.errorToastr('Please enter leave type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.leaveDescription.trim() == '') {
            this.toastr.errorToastr('Please enter leave type description', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            if (this.leaveTypeId != '') {

                this.app.showSpinner();
                //* ********************************************update data 
                var updateData = {
                    "LeaveTypeCd": this.leaveTypeId,
                    "LeaveTypeName": this.leaveType.trim(),
                    "LeaveTypeDesc": this.leaveDescription.trim(),
                    "ConnectedUser": this.app.empId,
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveLeaveType', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Updated Successfully!") {
                        this.app.hideSpinner();
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.app.hideSpinner();
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        $('#typeModal').modal('hide');
                        this.getLeaveTypes();
                        return false;
                    }
                });

            }
            else {

                this.app.showSpinner();
                //* ********************************************save data 
                var saveData = {
                    "LeaveTypeCd": 0,
                    "LeaveTypeName": this.leaveType.trim(),
                    "LeaveTypeDesc": this.leaveDescription.trim(),
                    "ConnectedUser": this.app.empId,
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveLeaveType', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.app.hideSpinner();
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.app.hideSpinner();
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        $('#typeModal').modal('hide');
                        this.getLeaveTypes();
                        return false;
                    }
                });
            }
        }
    }


    //function for edit existing leave type 
    editLeaveType(item) {

        this.clear();
        this.leaveHeading = 'Edit';
        this.updateFlag = true;

        this.leaveTypeId = item.leaveTypeCd;
        this.leaveType = item.leaveTypeName;
        this.leaveDescription = item.leaveTypeDesc;
    }


    //functions for delete leave type
    deleteLeaveTypeTemp(item) {
        this.clear();
        this.leaveTypeId = item.leaveTypeCd;
    }


    deleteLeaveType() {
        if (this.txtdPassword == '') {
            this.toastr.errorToastr('Please enter password', 'Error', { toastTimeout: (2500) });
            return false
        }
        else if (this.txtdPin == '') {
            this.toastr.errorToastr('Please enter PIN', 'Error', { toastTimeout: (2500) });
            return false
        }
        else if (this.leaveTypeId == '') {
            this.toastr.errorToastr('Invalid delete request', 'Error', { toastTimeout: (2500) });
            return false
        }
        else {

            this.app.showSpinner();

            //* ********************************************update data 
            var updateData = {
                "LeaveTypeCd":  this.leaveTypeId,
                "LeaveTypeName": null,
                "LeaveTypeDesc": null,
                "ConnectedUser": this.app.empId,
                "DelFlag": 1
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/saveLeaveType', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Deleted Successfully!") {
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                    return false;
                } else {
                    this.app.hideSpinner();
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    $('#deleteModal').modal('hide');
                    this.getLeaveTypes();
                    return false;
                }
            });
        }
    }



    //Function for save and update leave nature 
    saveLeaveNature() {

        if (this.leaveNature.trim() == '') {
            this.toastr.errorToastr('Please enter leave nature', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.natureDescription.trim() == '') {
            this.toastr.errorToastr('Please enter leave nature description', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            if (this.leaveNatureId != '') {

                this.app.showSpinner();
                //* ********************************************update data 
                var updateData = {
                    "LeaveNatureCd": this.leaveNatureId,
                    "LeaveNatureName": this.leaveNature.trim(),
                    "LeaveNatureDesc": this.natureDescription.trim(),
                    "ConnectedUser": this.app.empId,
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveLeaveNature', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Updated Successfully!") {
                        this.app.hideSpinner();
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.app.hideSpinner();
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        $('#leaveNatureModal').modal('hide');
                        this.getLeaveNature();
                        return false;
                    }
                });

            }
            else {

                this.app.showSpinner();
                //* ********************************************save data 
                var saveData = {
                    "LeaveNatureCd": 0,
                    "LeaveNatureName": this.leaveNature.trim(),
                    "LeaveNatureDesc": this.natureDescription.trim(),
                    "ConnectedUser": this.app.empId,
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveLeaveNature', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.app.hideSpinner();
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.app.hideSpinner();
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        this.getLeaveNature();
                        return false;
                    }
                });
            }
        }
    }



    //function for edit existing leave type 
    editLeaveNature(item) {

        this.clear();
        this.updateFlag = true;

        this.leaveNatureId = item.leaveNatureCd;
        this.leaveNature = item.leaveNatureName;
        this.natureDescription = item.leaveNatureDesc;
    }



    //functions for delete leave type
    deleteNatureTypeTemp(item) {
        this.clear();
        this.leaveNatureId = item.leaveNatureCd;
    }


    deletLeaveNature() {
        if (this.txtdPassword == '') {
            this.toastr.errorToastr('Please enter password', 'Error', { toastTimeout: (2500) });
            return false
        }
        else if (this.txtdPin == '') {
            this.toastr.errorToastr('Please enter PIN', 'Error', { toastTimeout: (2500) });
            return false
        }
        else if (this.leaveNatureId == '') {
            this.toastr.errorToastr('Invalid delete request', 'Error', { toastTimeout: (2500) });
            return false
        }
        else {

            this.app.showSpinner();

            //* ********************************************update data 
            var updateData = {
                "LeaveNatureCd": this.leaveNatureId,
                "LeaveNatureName": null,
                "LeaveNatureDesc": null,
                "ConnectedUser": this.app.empId,
                "DelFlag": 1
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/saveLeaveNature', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Deleted Successfully!") {
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {
                    this.app.hideSpinner();
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    $('#deleteNatureModal').modal('hide');
                    this.getLeaveNature();
                    return false;
                }
            });
        }
    }



    //function for empty all fields
    clear() {

        this.updateFlag = false;

        this.leaveHeading = 'Add';
        this.leaveTypeId = '';
        this.leaveType = '';
        this.leaveDescription = '';

        this.leaveNatureId = '';
        this.leaveNature = '';
        this.natureDescription = '';

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


    printDivType() {
        // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

        // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
        // var cssAddress = ".cssAddress {font-size: 16px; }";
        // var cssContact = ".cssContact {font-size: 16px; }";

        // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

        var printCss = this.app.printCSS();


        //printCss = printCss + "";

        var contents = $("#printAreaType").html();

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

    downloadPDFType() { }

    downloadCSVType() {
        //alert('CSV works');
        // case 1: When tblSearch is empty then assign full data list
        if (this.tblSearchType == "") {
            var completeDataList = [];
            for (var i = 0; i < this.leaveTypeList.length; i++) {
                //alert(this.tblSearchType + " - " + this.skillCriteriaList[i].departmentName)
                completeDataList.push({
                    LeaveType: this.leaveTypeList[i].leaveTypeName,
                    Description: this.leaveTypeList[i].leaveTypeDesc
                });
            }
            this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("LeaveTypeCompleteCSV", CsvFileTypes.CSV));
        }
        // case 2: When tblSearchType is not empty then assign new data list
        else if (this.tblSearchType != "") {
            var filteredDataList = [];
            for (var i = 0; i < this.leaveTypeList.length; i++) {
                if (this.leaveTypeList[i].leaveTypeName.toUpperCase().includes(this.tblSearchType.toUpperCase()) ||
                    this.leaveTypeList[i].leaveTypeDesc.toUpperCase().includes(this.tblSearchType.toUpperCase())) {
                    filteredDataList.push({
                        LeaveType: this.leaveTypeList[i].leaveTypeName,
                        Description: this.leaveTypeList[i].leaveTypeDesc
                    });
                }
            }

            if (filteredDataList.length > 0) {
                this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("LeaveTypeFilterCSV", CsvFileTypes.CSV));
            } else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
        }
    }

    downloadExcelType() {
        //alert('Excel works');
        // case 1: When tblSearchType is empty then assign full data list
        if (this.tblSearchType == "") {
            //var completeDataList = [];
            for (var i = 0; i < this.leaveTypeList.length; i++) {
                this.excelDataListType.push({
                    LeaveType: this.leaveTypeList[i].leaveTypeName,
                    Description: this.leaveTypeList[i].leaveTypeDesc
                });
            }
            this.excelExportService.export(this.excelDataContentType, new IgxExcelExporterOptions("LeaveTypeCompleteExcel"));
            this.excelDataListType = [];
        }
        // case 2: When tblSearchType is not empty then assign new data list
        else if (this.tblSearchType != "") {
            for (var i = 0; i < this.leaveTypeList.length; i++) {
                if (this.leaveTypeList[i].leaveTypeName.toUpperCase().includes(this.tblSearchType.toUpperCase()) ||
                    this.leaveTypeList[i].leaveTypeDesc.toUpperCase().includes(this.tblSearchType.toUpperCase())) {
                    this.excelDataListType.push({
                        LeaveType: this.leaveTypeList[i].leaveTypeName,
                        Description: this.leaveTypeList[i].leaveTypeDesc
                    });
                }
            }

            if (this.excelDataListType.length > 0) {
                //alert("Filter List " + this.excelDataList.length);

                this.excelExportService.export(this.excelDataContentType, new IgxExcelExporterOptions("LeaveTypeFilterExcel"));
                this.excelDataListType = [];
            }
            else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
        }
    }

    //*------------------------------- Leave Nature (Print, PDF, CSV, Excel)

    printDivNature() {
        // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

        // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
        // var cssAddress = ".cssAddress {font-size: 16px; }";
        // var cssContact = ".cssContact {font-size: 16px; }";

        // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

        var printCss = this.app.printCSS();


        //printCss = printCss + "";

        var contents = $("#printAreaNature").html();

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

    downloadPDFNature() { }

    downloadCSVNature() {
        //alert('CSV works');
        // case 1: When tblSearchNature is empty then assign full data list
        if (this.tblSearchNature == "") {
            var completeDataList = [];
            for (var i = 0; i < this.leaveNatureList.length; i++) {
                //alert(this.tblSearchNature + " - " + this.skillCriteriaList[i].departmentName)
                completeDataList.push({
                    LeaveNature: this.leaveNatureList[i].leaveNatureName,
                    Description: this.leaveNatureList[i].leaveNatureDesc
                });
            }
            this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("LeaveNatureCompleteCSV", CsvFileTypes.CSV));
        }
        // case 2: When tblSearchNature is not empty then assign new data list
        else if (this.tblSearchNature != "") {
            var filteredDataList = [];
            for (var i = 0; i < this.leaveNatureList.length; i++) {
                if (this.leaveTypeList[i].leaveNatureName.toUpperCase().includes(this.tblSearchType.toUpperCase()) ||
                    this.leaveTypeList[i].leaveNatureDesc.toUpperCase().includes(this.tblSearchType.toUpperCase())) {
                    filteredDataList.push({
                        LeaveNature: this.leaveNatureList[i].leaveNatureName,
                        Description: this.leaveNatureList[i].leaveNatureDesc
                    });
                }
            }

            if (filteredDataList.length > 0) {
                this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("LeaveNatureFilterCSV", CsvFileTypes.CSV));
            } else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
        }
    }

    downloadExcelNature() {
        //alert('Excel works');
        // case 1: When tblSearchNature is empty then assign full data list
        if (this.tblSearchNature == "") {
            //var completeDataList = [];
            for (var i = 0; i < this.leaveNatureList.length; i++) {
                this.excelDataListNature.push({
                    LeaveNature: this.leaveNatureList[i].leaveNatureName,
                    Description: this.leaveNatureList[i].leaveNatureDesc
                });
            }
            this.excelExportService.export(this.excelDataContentNature, new IgxExcelExporterOptions("LeaveNatureCompleteExcel"));
            this.excelDataListNature = [];
        }
        // case 2: When tblSearchNature is not empty then assign new data list
        else if (this.tblSearchNature != "") {
            for (var i = 0; i < this.leaveNatureList.length; i++) {
                if (this.leaveTypeList[i].leaveNatureName.toUpperCase().includes(this.tblSearchType.toUpperCase()) ||
                    this.leaveTypeList[i].leaveNatureDesc.toUpperCase().includes(this.tblSearchType.toUpperCase())) {
                    this.excelDataListNature.push({
                        LeaveNature: this.leaveNatureList[i].leaveNatureName,
                        Description: this.leaveNatureList[i].leaveNatureDesc
                    });
                }
            }

            if (this.excelDataListNature.length > 0) {
                //alert("Filter List " + this.excelDataList.length);

                this.excelExportService.export(this.excelDataContentNature, new IgxExcelExporterOptions("LeaveNatureFilterExcel"));
                this.excelDataListNature = [];
            }
            else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
        }
    }

}
