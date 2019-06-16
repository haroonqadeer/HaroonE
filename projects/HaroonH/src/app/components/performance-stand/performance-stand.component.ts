import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OrderPipe } from 'ngx-order-pipe';

import { AppComponent } from 'src/app/app.component';

declare var $: any;
@Component({
    selector: 'app-performance-stand',
    templateUrl: './performance-stand.component.html',
    styleUrls: ['./performance-stand.component.scss']
})
export class PerformanceStandComponent implements OnInit {

    //serverUrl = "http://localhost:11664/";
    serverUrl = "http://192.168.200.19:3006/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    //*Bolean variable 
    updateFlag = false;

    //* list for excel data
    excelDataList = [];

    pStandardList = [];

    //* variables for pagination and orderby pipe
    p = 1;
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';


    //* Variables for NgModels
    tblSearch;

    pStandardId;

    pTitle;
    pDescription;
    lblMainGroup;
    lblSubGroup;

    txtdPassword = '';
    txtdPin = '';


    constructor(
        private toastr: ToastrManager,
        private http: HttpClient,
        private app: AppComponent
    ) { }

    ngOnInit() {

        this.getPStandard();
    }

    //function for get all saved performance standards 
    getPStandard() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getPStandard', { headers: reqHeader }).subscribe((data: any) => {
            this.pStandardList = data
        });

    }



    //Function for save and update performance standard 
    save() {

        if (this.pTitle == '') {
            this.toastr.errorToastr('Please enter performance title', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.pDescription == '') {
            this.toastr.errorToastr('Please enter performance description', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            if (this.pStandardId != '') {

                //this.app.showSpinner();
                // this.app.hideSpinner();
                //* ********************************************update data 
                var updateData = {
                    "PrcssStepID": this.pStandardId,
                    "ProcessStepTitle": this.pTitle,
                    "ProcessStepDesc": this.pDescription,
                    "PrcssID": 1,
                    "PrcssTypeCd": 1,
                    "ConnectedUser": "3",
                    "DelFlag": 0,
                    "DelStatus": "No"
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.put(this.serverUrl + 'api/updatePStandard', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Updated Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        $('#standardModal').modal('hide');
                        this.getPStandard();
                        return false;
                    }
                });

            }
            else {


                //* ********************************************save data 
                var saveData = {
                    "ProcessStepTitle": this.pTitle,
                    "ProcessStepDesc": this.pDescription,
                    "PrcssID": 1,
                    "PrcssTypeCd": 1,
                    "ConnectedUser": "2",
                    "DelFlag": 0,
                    "DelStatus": "No"
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/savePStandard', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        $('#standardModal').modal('hide');
                        this.getPStandard();
                        return false;
                    }
                });
            }
        }
    }


    //function for edit existing performance standard 
    edit(item) {

        this.clear();
        this.updateFlag = true;

        this.pStandardId = item.prcssStepID;
        this.pTitle = item.processStepTitle;
        this.pDescription = item.processStepDesc;
        this.lblMainGroup = item.prcssTitle;
        this.lblSubGroup = item.prcssTypeName;

    }


    //functions for delete performance standard
    deleteTemp(item) {
        this.clear();
        this.pStandardId = item.prcssStepID
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
        else if (this.pStandardId == '') {
            this.toastr.errorToastr('Invalid delete request', 'Error', { toastTimeout: (2500) });
            return false
        }
        else {

            //this.app.showSpinner();
            // this.app.hideSpinner();

            //* ********************************************update data 
            var updateData = {

                "PrcssStepID": this.pStandardId,
                "ConnectedUser": "4",
                "DelFlag": 1,
                "DelStatus": "Yes"
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.put(this.serverUrl + 'api/updatePStandard', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Deleted Successfully!") {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    $('#deleteModal').modal('hide');
                    this.getPStandard();
                    return false;
                }
            });
        }
    }


    //function for empty all fields
    clear() {

        this.updateFlag = false;

        this.pStandardId = '';
        this.pTitle = '';
        this.pDescription = '';
        this.lblMainGroup = '';
        this.lblSubGroup = '';

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
