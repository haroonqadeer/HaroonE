import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { OrderPipe } from 'ngx-order-pipe';
import { strictEqual } from 'assert';
//import { AppComponent } from 'src/app/app.component';

import * as jsPDF from 'jspdf';
import {
    IgxExcelExporterOptions,
    IgxExcelExporterService,
    IgxGridComponent,
    IgxCsvExporterService,
    IgxCsvExporterOptions,
    CsvFileTypes
} from "igniteui-angular";
//import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting currency data into main table -------------------//
//-------------------Add new currency into database --------------------------//
//-------------------Update currency into database ---------------------------//
//-------------------Delete currency from database ---------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//-------------------For sorting the record-----------------------------//
//----------------------------------------------------------------------------//


declare var $: any;
@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html',
    styleUrls: ['./currency.component.scss']
})

export class CurrencyComponent implements OnInit {

    //export file as pdf
    // exportAsConfig: ExportAsConfig = {
    //     type: 'pdf',
    //     elementId: 'mytable',
    // };


    serverUrl = "http://localhost:23842/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    // list for excel data
    excelDataList = [];

    //* variables for pagination and orderby pipe
    p = 1;
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';


    //*variable for print css
    printCss = "{table: {'border': 'solid 1px', 'width' : '100%'}}";

    //*Variables for NgModels
    tblSearch;
    dCurrencyId = '';
    currencyId = '';
    currencyName = '';
    countryName = '';
    txtdPassword = '';
    txtdPin = '';

    updateFlag = false;

    //*List Variables
    currencies = [];

    constructor(
        //private exportAsService: ExportAsService,
        private toastr: ToastrManager,
        //private app: AppComponent,
        private http: HttpClient,
        private orderPipe: OrderPipe,
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService
    ) { }

    ngOnInit() {
        //this.getCurrency();
    }


    @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent;//For excel
    @ViewChild("exportPDF") public exportPDF: ElementRef;

    //function for get all saved currencies from db
    getCurrency() {
        //return false;

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getCurrency', { headers: reqHeader }).subscribe((data: any) => {
            this.currencies = data
        });
    }


    //Function for  and update currency 
    save() {
        if (this.currencyName.trim() == '') {
            this.toastr.errorToastr('Please enter currency name', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.countryName.trim() == '') {
            this.toastr.errorToastr('Please enter country name', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {
            if (this.currencyId != '') {
                //this.app.showSpinner();
                //this.toastr.successToastr('updated successfully', 'Success', { toastTimeout: (2500) });
                //this.clear();
                //return false;

                var updateData = { currencyId: this.currencyId, currencyName: this.currencyName, cntryName: this.countryName };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.put(this.serverUrl + 'api/updateCurrency', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != undefined) {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });

                        //this.app.hideSpinner();
                        this.clear();
                        $('#currencyModal').modal('hide');
                        this.getCurrency();
                        return false;
                    } else {
                        this.toastr.errorToastr('Error Occured', 'Error!', { toastTimeout: (2500) });
                        //this.app.hideSpinner();
                        $('#currencyModal').modal('hide');
                        return false;
                    }
                });
            }
            else {
                //this.app.showSpinner();
                // //this.app.hideSpinner();
                // this.toastr.successToastr('saved successfully', 'Error', { toastTimeout: (2500) });
                // this.clear();
                // return false;

                var saveData = { currencyName: this.currencyName, cntryName: this.countryName };
                //var token = localStorage.getItem(this.tokenKey);

                // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveCurrency', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != undefined) {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });

                        //this.app.hideSpinner();
                        $('#currencyModal').modal('hide');
                        this.getCurrency();
                        this.clear();
                        return false;
                    } else {
                        this.toastr.errorToastr('Error Occured', 'Error!', { toastTimeout: (2500) });
                        //this.app.hideSpinner();
                        $('#currencyModal').modal('hide');
                        return false;
                    }
                });
            }
        }
    }


    //function for empty all fields
    clear() {
        this.currencyId = '';
        this.dCurrencyId = ''
        this.currencyName = '';
        this.countryName = '';
        this.txtdPassword = '';
        this.txtdPin = '';
    }


    //function for edit existing currency 
    edit(item) {
        this.currencyId = item.currencyId;
        this.currencyName = item.currencyName;
        this.countryName = item.cntryName;
    }


    //functions for delete currency
    deleteTemp(item) {
        this.clear();
        this.dCurrencyId = item.currencyId;
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
        else if (this.dCurrencyId == '') {
            this.toastr.errorToastr('Invalid delete request', 'Error', { toastTimeout: (2500) });
            return false
        }
        else {
            //this.app.showSpinner();
            // //this.app.hideSpinner();

            // this.toastr.successToastr('Deleted successfully', 'Error', { toastTimeout: (2500) });
            // this.clear();

            // $('#closeDeleteModel').click();

            // return false;

            // var data = { "ID": this.dCurrencyId, Password: this.txtdPassword, PIN: this.txtdPin };

            // var token = localStorage.getItem(this.tokenKey);

            // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.delete(this.serverUrl + 'api/deleteCurrency?currencyId=' + this.dCurrencyId).subscribe((data: any) => {

                if (data.msg != "Error Occured") {
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    //this.app.hideSpinner();
                    $('#deleteModal').modal('hide');
                    this.getCurrency();
                    this.clear();

                    return false;
                } else {
                    this.toastr.errorToastr('Error Occured', 'Error!', { toastTimeout: (2500) });
                    //this.app.hideSpinner();
                    $('#deleteModal').modal('hide');
                    return false;
                }
            });
        }
    }


    //function for sort table data 
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }


    // Function for Print Dive *******************/
    printDiv() {

        // // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

        // // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
        // // var cssAddress = ".cssAddress {font-size: 16px; }";
        // // var cssContact = ".cssContact {font-size: 16px; }";

        // // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

        // var printCss = this.app.printCSS();

        // //printCss = printCss + "";


        // var contents = $("#printArea").html();

        // var frame1 = $('<iframe />');
        // frame1[0].name = "frame1";
        // frame1.css({ "position": "absolute", "top": "-1000000px" });
        // $("body").append(frame1);
        // var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        // frameDoc.document.open();

        // //Create a new HTML document.
        // frameDoc.document.write('<html><head><title>DIV Contents</title>' + "<style>" + printCss + "</style>");


        // //Append the external CSS file.  <link rel="stylesheet" href="../../../styles.scss" />  <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
        // frameDoc.document.write('<style type="text/css" media="print">/*@page { size: landscape; }*/</style>');

        // frameDoc.document.write('</head><body>');

        // //Append the DIV contents.
        // frameDoc.document.write(contents);
        // frameDoc.document.write('</body></html>');
        // frameDoc.document.close();

        // //alert(frameDoc.document.head.innerHTML);
        // // alert(frameDoc.document.body.innerHTML);

        // setTimeout(function () {
        //     window.frames["frame1"].focus();
        //     window.frames["frame1"].print();
        //     frame1.remove();
        // }, 500);
    }
}

