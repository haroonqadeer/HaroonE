import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OrderPipe } from 'ngx-order-pipe';
import { AppComponent } from 'src/app/app.component';

declare var $: any;

@Component({
    selector: 'app-leavetype',
    templateUrl: './leavetype.component.html',
    styleUrls: ['./leavetype.component.scss']
})
export class LeavetypeComponent implements OnInit {

    serverUrl = "http://localhost:25986/";
    //serverUrl = "http://192.168.200.19:3005/";
    tokenKey = "token";


    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    updateFlag = false;
    //* list for excel data
    excelDataList = [];

    leaveTypeList = [];
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

    leaveNatureId = '';
    leaveNature = '';
    natureDescription = '';

    txtdPassword = '';
    txtdPin = '';


    constructor(
        private toastr: ToastrManager,
        private http: HttpClient,
        private orderPipe: OrderPipe,
        private app: AppComponent
    ) { }

    ngOnInit() {

        this.getLeaveTypes();
        this.getLeaveNature();

    }

    //function for get all saved leave types 
    getLeaveTypes() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getLeaveType', { headers: reqHeader }).subscribe((data: any) => {
            this.leaveTypeList = data
        });

    }


    //function for get all saved leave nature 
    getLeaveNature() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getLeaveNature', { headers: reqHeader }).subscribe((data: any) => {
            this.leaveNatureList = data
        });

    }


    //Function for save and update leave Type 
    saveLeaveType() {
        if (this.leaveType.trim() == '') {
            this.toastr.errorToastr('Please enter leave type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.leaveDescription.trim() == '') {
            this.toastr.errorToastr('Please enter leave type description', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {
            // address type conditions for subsidiary


            if (this.leaveTypeId != '') {

                //this.app.showSpinner();
                // this.app.hideSpinner();
                //* ********************************************update data 
                var updateData = {
                    "LeaveTypeCd": this.leaveTypeId,
                    "LeaveTypeName": this.leaveType,
                    "LeaveTypeDesc": this.leaveDescription,
                    "ConnectedUser": "2",
                    "DelFlag": 0,
                    "DelStatus": "No"
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.put(this.serverUrl + 'api/updateLeaveType', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Updated Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        $('#typeModal').modal('hide');
                        this.getLeaveTypes();
                        return false;
                    }
                });

            }
            else {


                //* ********************************************save data 
                var saveData = {
                    "LeaveTypeName": this.leaveType,
                    "LeaveTypeDesc": this.leaveDescription,
                    "ConnectedUser": "2",
                    "DelFlag": 0,
                    "DelStatus": "No"
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveLeaveType', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
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

            //this.app.showSpinner();
            // this.app.hideSpinner();

            //* ********************************************update data 
            var updateData = {
                "LeaveTypeCd": this.leaveTypeId,
                "LeaveTypeName": null,
                "LeaveTypeDesc": null,
                "ConnectedUser": "3",
                "DelFlag": 1,
                "DelStatus": "Yes"
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.put(this.serverUrl + 'api/updateLeaveType', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Deleted Successfully!") {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {
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

                //this.app.showSpinner();
                // this.app.hideSpinner();
                //* ********************************************update data 
                var updateData = {
                    "LeaveNatureCd": this.leaveNatureId,
                    "LeaveNatureName": this.leaveNature,
                    "LeaveNatureDesc": this.natureDescription,
                    "ConnectedUser": "2",
                    "DelFlag": 0,
                    "DelStatus": "No"
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.put(this.serverUrl + 'api/updateLeaveNature', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Updated Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        $('#leaveNatureModal').modal('hide');
                        this.getLeaveNature();
                        return false;
                    }
                });

            }
            else {


                //* ********************************************save data 
                var saveData = {
                    "LeaveNatureName": this.leaveNature,
                    "LeaveNatureDesc": this.natureDescription,
                    "ConnectedUser": "2",
                    "DelFlag": 0,
                    "DelStatus": "No"
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveLeaveNature', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        $('#leaveNatureModal').modal('hide');
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

            //this.app.showSpinner();
            // this.app.hideSpinner();

            //* ********************************************update data 
            var updateData = {
                "LeaveNatureCd": this.leaveNatureId,
                "LeaveNatureName": null,
                "LeaveNatureDesc": null,
                "ConnectedUser": "3",
                "DelFlag": 1,
                "DelStatus": "Yes"
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.put(this.serverUrl + 'api/updateLeaveNature', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Deleted Successfully!") {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {
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


}
