import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';


declare var $: any;

@Component({
    selector: 'app-leaverules',
    templateUrl: './leaverules.component.html',
    styleUrls: ['./leaverules.component.scss']
})
export class LeaverulesComponent implements OnInit {

    serverUrl = "http://localhost:13759/";
    //serverUrl = "http://192.168.200.19:3004/";
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

    dateApplied;
    leaveType;
    leaveNature;
    leaveLimit;
    limitType;

    txtdPassword = '';
    txtdPin = '';


    constructor(
        private toastr: ToastrManager,
        private http: HttpClient,
        private app: AppComponent
    ) { }

    ngOnInit() {

        this.getLeaveTypes();
        this.getLeaveNature();
        this.getLeaveLimitType();
        this.getLeaveRules();
    }


    //function for get all saved leave rules 
    getLeaveRules() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getLeaveRule', { headers: reqHeader }).subscribe((data: any) => {
            this.leaveRuleList = data
        });

    }


    //function for get all saved leave limit types 
    getLeaveLimitType() {
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

        });

    }


    //function for get all saved leave types 
    getLeaveTypes() {
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

        });

    }


    //function for get all saved leave nature 
    getLeaveNature() {
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

        });

    }


    //Function for save and update leave Type 
    save() {

        var limitType = parseInt(this.limitType);
        var leaveLimit = parseInt(this.leaveLimit);

        if (this.dateApplied == '') {
            this.toastr.errorToastr('Please enter date', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.leaveType == '') {
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
        else if (limitType == 1 && leaveLimit > 30) {
            this.toastr.errorToastr('Invalid leave limit 1', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (limitType == 2 && leaveLimit > 90) {
            this.toastr.errorToastr('Invalid leave limit 2', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (limitType == 3 && leaveLimit > 180) {
            this.toastr.errorToastr('Invalid leave limit 3', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (limitType == 4 && leaveLimit > 365) {
            this.toastr.errorToastr('Invalid leave limit 4', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            if (this.leaveRuleId != '') {

                //this.app.showSpinner();
                // this.app.hideSpinner();
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
                    "ConnectedUser": "3",
                    "DelFlag": 0,
                    "DelStatus": "No"
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.put(this.serverUrl + 'api/updateLeaveRule', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Updated Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        $('#newRuleModal').modal('hide');
                        this.getLeaveRules();
                        return false;
                    }
                });

            }
            else {


                //* ********************************************save data 
                var saveData = {
                    "LeaveTypeCd": this.leaveType,
                    "LeaveNatureCd": this.leaveNature,
                    "LeaveLmtCd": limitType,
                    "DdctnTypeCd": 1,
                    "DdctnSubTypeCd": 1,
                    "LeaveCalcMthdCd": 1,
                    "LeaveLmtAmoUNt": leaveLimit,
                    "ConnectedUser": "2",
                    "DelFlag": 0,
                    "DelStatus": "No"
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveLeaveRule', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        $('#newRuleModal').modal('hide');
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

            //this.app.showSpinner();
            // this.app.hideSpinner();

            //* ********************************************update data 
            var updateData = {

                "LeaveRuleID": this.leaveRuleId,
                "ConnectedUser": "4",
                "DelFlag": 1,
                "DelStatus": "Yes"
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.put(this.serverUrl + 'api/updateLeaveRule', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Deleted Successfully!") {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
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
        this.dateApplied = '';
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
}
