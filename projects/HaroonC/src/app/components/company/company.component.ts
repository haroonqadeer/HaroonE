import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppComponent } from '../../../../../../src/app/app.component';
import { CurrencyComponent } from '../currency/currency.component';

import { ConfigAddressComponent } from 'src/app/components/config-address/config-address.component';
//import { ConfigSocialMediaComponent } from 'src/app/components/config-social-media/config-social-media.component';



// import * as jsPDF from 'jspdf';
import {
    IgxExcelExporterOptions,
    IgxExcelExporterService,
    IgxGridComponent,
    IgxCsvExporterService,
    IgxCsvExporterOptions,
    CsvFileTypes
} from "igniteui-angular";
import { jsonpCallbackContext } from '@angular/common/http/src/module';


//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting company data into main table -------------------//
//-------------------Add new company into database --------------------------//
//-------------------Add new partner into database --------------------------//
//-------------------Update company into database ---------------------------//
//-------------------Delete company from database ---------------------------//
//-------------------Remove partner from database ---------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//-------------------Function for email validation -----------------------------//
//-------------------For sorting the record-----------------------------//
//-------------------function for hide or unhide div-----------------------------//
//----------------------------------------------------------------------------//


declare var $: any;

//Partners array
export interface Partner {
    pId: number;
    cnic: string;
    ntn: string;
    name: string;
    role: string;
    date: Date;
    share: string;
    position: string;
}


@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {



    // public contactFormSole: FormGroup;
    // public contactFormPartner: FormGroup;
    // public contactFormPPCom: FormGroup;
    // public contactFormCompany: FormGroup;

    // areaCode = false;
    // mobileNetworkCode = false;
    // soleBox = true;
    // partnerBox = true;
    // ppComBox = true;

    @ViewChild(ConfigAddressComponent) child: ConfigAddressComponent;

    companyBox = true;


    serverUrl = "http://localhost:7007/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    // list variables -----------
    excelDataList = [];

    countryListForAddress = [];

    cntryList = [];
    cityList = [];
    cntctTypeList = [];
    crncyList = [];
    businessTypeList = [];


    //*--For Business--// 
    contactType;
    country;
    area;
    network;
    addressType = [];
    emailType;



    
    
    

    //*Variables for NgModels
    srchCntry;
    srchCity;
    srchCrncy;
    tblSearch;
    companyId = '';
    cmbCType = '';
    companyName = '';
    cNtn = '';
    cStrn = '';
    cBusinessType = '';
    cEmployeQty = '';
    cCurrency = '';
    cLogo = '';

    cAddressType = '';
    cAddress = '';
    cCountry = '';
    cCity = '';
    cZipCode = '';

    cContactType = '';
    cContactNumber = '';
    cEmailAdrs = '';


    sCnic = '';
    sNtn = '';
    sOwnerName = '';
    sTelephoneNo = '';
    sMobileNo = '';
    sEmail = '';
    sAddress = '';
    soleContactType = "";
    soleCountryCode = "";
    soleAreaCode = "";
    soleMobileNetworkCode = "";
    soleContactNumber = "";

    pCnic = '';
    pNtn = '';
    pPartnerName = '';
    pPartnerRole = '';
    pDate = '';
    pShare = '';
    pTelephone = '';
    pMobile = '';
    pEmail = '';
    pAddress = '';
    partnerContactType = "";
    partnerCountryCode = "";
    partnerAreaCode = "";
    partnerMobileNetworkCode = "";
    partnerContactNumber = "";

    ppCnic = '';
    ppNtn = '';
    ppDirectorName = '';
    ppPosition = '';
    ppShare = '';
    ppTelephone = '';
    ppMobile = '';
    ppEmail = '';
    ppAddress = '';
    ppComContactType = "";
    ppComCountryCode = "";
    ppComAreaCode = "";
    ppComMobileNetworkCode = "";
    ppComContactNumber = "";

    bNtn = '';
    bStrn = '';
    bTitle = '';
    bNature = '';
    bDescription = '';
    bBusinessAddress = '';
    bMailingAddress = '';
    bTelephone = '';
    bMobile = '';
    bEmail = '';
    bWebsite = '';
    bFacebook = '';
    companyContactType = "";
    companyCountryCode = "";
    companyAreaCode = "";
    companyMobileNetworkCode = "";
    companyContactNumber = "";

    txtdPassword = '';
    txtdPin = '';
    dCompanyId = '';


    //*Boolean ng models and variables
    solePro = true;
    partner = false;
    ppCom = false;

    btnStpr1 = false;
    btnStpr2 = false;

    //* variables for pagination and orderby pipe
    p = 1;
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';

    //* Type combo box  (Business types)
    types = [
        { BusinessTypeCd: 1, BusinessTypeName: 'Sole Proprietorship' },
        { BusinessTypeCd: 2, BusinessTypeName: 'Partnership' },
        { BusinessTypeCd: 3, BusinessTypeName: 'Public Company' },
    ];



    //address Detail Business
    addressList = [];
    
    //contact Detail Business
    contactList = [];

    //Emails Detail Business
    emailList = [];



    companyDetail = [];
    compSumDetail = [];

    //* initializing array for partners detail 
    partners: Partner[] = [];

    constructor(private toastr: ToastrManager,
        private app: AppComponent,
        private http: HttpClient,
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService,
        private fb: FormBuilder) {



    }

    ngOnInit() {        

        //this.getCompany();
        //this.getAddressType();
        this.getCountry();
        this.getContactType();
        this.getCity();
        this.getCurrency();
        this.getBusinessType();
    }

    @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent;//For excel
    @ViewChild("exportPDF") public exportPDF: ElementRef;//for pdf

    getAddressType() {
        //return false;

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getAddressType', { headers: reqHeader }).subscribe((data: any) => {
            //this.addressType = data
            //alert(data.length);
            for (var i = 0; i < data.length; i++) {
                this.addressType.push({
                    label: data[i].addressTypeName,
                    value: data[i].addressTypeCd
                });
            }
            //alert(this.addressType)
        });
    }

    getContactType() {
        //return false;

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getContactType', { headers: reqHeader }).subscribe((data: any) => {
            this.cntctTypeList = data
        });
    }

    getCountry() {
        //return false;

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getCountry', { headers: reqHeader }).subscribe((data: any) => {
            this.cntryList = data
        });
    }

    getCompany() {
        //return false;

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getCompanySummary', { headers: reqHeader }).subscribe((data: any) => {
            //this.addressType = data
            //alert(data.length);
            this.compSumDetail = data;
            for (var i = 0; i < data.length; i++) {
                if (this.companyDetail.length == 0) {
                    this.companyDetail.push({
                        cmpnyCd: data[i].cmpnyID,
                        businessTypeCd: data[i].businessTypeCd,
                        businessType: data[i].businessTypeName,
                        title: data[i].orgName,
                        //nature: data[i].n,
                        ntn: data[i].orgNTN,
                        website: data[i].orgWebsite
                    })
                } else {
                    for (var j = 0; j < this.companyDetail.length; j++) {
                        if (this.companyDetail[j].cmpnyCd != data[i].cmpnyID) {
                            this.companyDetail.push({
                                cmpnyCd: data[i].cmpnyID,
                                businessType: data[i].businessTypeName,
                                title: data[i].orgName,
                                //nature: data[i].n,
                                ntn: data[i].orgNTN,
                                website: data[i].orgWebsite
                            })
                        }
                    }
                }

            }
            //alert(this.addressType)
        });
    }

    getProvince() {
        //return false;

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getProvince', { headers: reqHeader }).subscribe((data: any) => {
            //this.addressType = data
            //alert(data.length);
            //alert(this.addressType)
        });
    }

    getCurrency() {
        //return false;

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getCurrency', { headers: reqHeader }).subscribe((data: any) => {
            this.crncyList = data
        });
    }

    getCity() {
        //return false;

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getCity', { headers: reqHeader }).subscribe((data: any) => {
            this.cityList = data
        });
    }

    getBusinessType() {
        //return false;

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getBusinessType', { headers: reqHeader }).subscribe((data: any) => {
            this.businessTypeList = data
        });
    }

    //* Function for save and update company 
    save() {

        if (this.cmbCType == '') {
            this.toastr.errorToastr('Please select ownership type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.companyName == '') {
            this.toastr.errorToastr('Please enter company name', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.cNtn == '') {
            this.toastr.errorToastr('Please enter registration number or NTN', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.cStrn == '') {
            this.toastr.errorToastr('Please enter STRN', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.cBusinessType == '') {
            this.toastr.errorToastr('Please select business type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.cEmployeQty == '') {
            this.toastr.errorToastr('Please enter number of employees', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.cCurrency == '') {
            this.toastr.errorToastr('Please select currency', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.cAddress == '') {
            this.toastr.errorToastr('Please enter address', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.cCountry == '') {
            this.toastr.errorToastr('Please select country', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.cCity == '') {
            this.toastr.errorToastr('Please select city', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.cZipCode == '') {
            this.toastr.errorToastr('Please enter zip code', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.contactList.length == 0) {
            this.toastr.errorToastr('Please enter contact detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.emailList.length == 0) {
            this.toastr.errorToastr('Please enter email', 'Error', { toastTimeout: (2500) });
            return false;
        }

        else {

            this.addressList.push({

                contactDetailCode: 0,
                addressId: 0,
                addressType: 0,
                address: this.cAddress,
                cityCode: this.cCity,
                districtCode: 0,
                provinceCode: 0,
                countryCode: this.cCountry,
                zipCode: this.cZipCode,
                status: 0

            });


            if (this.companyId != '') {
                alert('record updating successfully!');
                return false;
                this.app.showSpinner();
                this.toastr.successToastr('update successfully', 'Success', { toastTimeout: (2500) });
                //this.clear(this.companyId);
                this.clear(1);
                // this.clearPartner();
                // this.clearBoardDirectors();
                // this.clearOwner();
                $('#companyModal').modal('hide');
                this.app.hideSpinner();
                return false;

                var updateData = { "Password": this.txtdPassword, "PIN": this.txtdPin };

                var token = localStorage.getItem(this.tokenKey);

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                this.http.put(this.serverUrl + 'api/pwCreate', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != undefined) {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr('Record Deleted Successfully', 'Success!', { toastTimeout: (2500) });
                        $('#actionModal').modal('hide');
                        return false;
                    }

                });

                // this.toastr.successToastr('validation complete information', 'Success!', { toastTimeout: (2500) });
                // return false;
            }
            else { 

                this.app.showSpinner();

                //$('#companyModal').modal('hide');
                //this.app.hideSpinner();
                //return false;

                var saveData = {
                    comanyId: 0,
                    companyTitle: this.companyName,
                    businessType: Number(this.cmbCType),
                    companyNtn: this.cNtn,
                    companyStrn: this.cStrn,
                    companyNature: this.cBusinessType,
                    companyDesc: '',
                    website: this.bWebsite,
                    fbId: this.bFacebook,
                    address: JSON.stringify(this.addressList),
                    telephone: JSON.stringify(this.contactList),
                    email: JSON.stringify(this.emailList),
                    employess: this.cEmployeQty, 
                    currency: this.cCurrency

                };

                //alert(saveData.companyStrn);

                // var token = localStorage.getItem(this.tokenKey);

                // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                // this.http.post(this.serverUrl + 'api/saveCompany', saveData, { headers: reqHeader }).subscribe((data: any) => {
                this.http.post(this.serverUrl + 'api/saveCompany', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != undefined) {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        //this.getCompany();
                        //$('#companyModal').modal('hide');
                        this.app.hideSpinner();
                        return false;
                    } else {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        //$('#companyModal').modal('hide');
                        this.app.hideSpinner();
                        return false;
                    }
                });
            }
        }
    }


    //* Function for add new partner for company 
    addPartner() {
        //return false;
        if (this.pCnic == '' || this.pCnic.length < 13) {
            this.toastr.errorToastr('Please enter partner CNIC', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.pNtn == '' || this.pNtn.length < 8) {
            this.toastr.errorToastr('Please enter partner NTN', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.pPartnerName == '') {
            this.toastr.errorToastr('Please enter partner name', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.pPartnerRole == '') {
            this.toastr.errorToastr('Please enter partner role', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.pDate == '') {
            this.toastr.errorToastr('Please enter partner date', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.pShare == '') {
            this.toastr.errorToastr('Please enter partner share', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            let data = this.partners.find(x => x.cnic == this.pCnic);

            if (data != undefined) {

                this.toastr.errorToastr('Partner already exist', 'Error', { toastTimeout: (2500) });
                return false;

            }
            else {

                this.partners.push({
                    pId: this.partners.length + 1,
                    cnic: this.pCnic,
                    ntn: this.pNtn,
                    name: this.pPartnerName,
                    role: this.pPartnerRole,
                    date: new Date(this.pDate),
                    share: this.pShare,
                    position: null
                });

                this.clearPartner();

            }
        }
    }


    //* Function for empty all fields of partner information 
    clearPartner() {
        this.pCnic = '';
        this.pNtn = '';
        this.pPartnerName = '';
        this.pPartnerRole = '';
        this.pDate = '';
        this.pShare = '';

    }


    //function for empty all fields
    clear(cId) {

        if (cId > 0) {

            this.ppCom = false;
            this.partner = false;
            this.solePro = false;

            this.btnStpr1 = false;
            this.btnStpr2 = false;
            this.cmbCType = '';

            this.sCnic = '';
            this.sNtn = '';
            this.sOwnerName = '';
            //this.sTelephoneNo = '';
            //this.sMobileNo = '';
            //this.sEmail = '';
            //this.sAddress = '';

            this.clearPartner();

            this.ppCnic = '';
            this.ppNtn = '';
            this.ppDirectorName = '';
            this.ppPosition = '';
            this.ppShare = '';
            // this.ppTelephone = '';
            // this.ppMobile = '';
            // this.ppEmail = '';
            // this.ppAddress = '';

            this.bNtn = '';
            this.bStrn = '';
            this.bTitle = '';
            this.bNature = '';
            this.bDescription = '';
            // this.bBusinessAddress = '';
            // this.bMailingAddress = '';
            // this.bTelephone = '';
            // this.bMobile = '';
            // this.bEmail = '';
            this.bWebsite = '';
            this.bFacebook = '';

            // this.contactFormSole.reset();
            // this.contactFormPPCom.reset();
            // this.contactFormCompany.reset();

            this.txtdPassword = '';
            this.txtdPin = '';
            this.dCompanyId = '';

            this.addressList = [];

            this.contactList = [];

            this.emailList = [];

        }
    }



    //function for edit existing currency 
    edit(item) {

        this.companyId = item.cmpnyCd;
        this.cmbCType = item.businessTypeCd;

        this.allowDiv();
    }


    //functions for delete company
    deleteTemp(item) {
        //this.clear(item.companyId);
        this.dCompanyId = item.cmpnyCd;
        //alert(this.dCompanyId)
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
        else if (this.dCompanyId == '') {
            this.toastr.errorToastr('Invalid delete request', 'Error', { toastTimeout: (2500) });
            return false
        }
        else {

            this.app.showSpinner();

            //this.toastr.successToastr('Deleted successfully', 'Error', { toastTimeout: (2500) });

            //return false;

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.delete(this.serverUrl + 'api/deleteCompany?companyId=' + this.dCompanyId + '&password=' + this.txtdPassword + '&pin=' + this.txtdPin).subscribe((data: any) => {

                if (data.msg != undefined) {
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    this.getCompany();
                    $('#closeDeleteModel').modal('hide');
                    this.clear(1);
                    this.app.hideSpinner();
                    return false;
                } else {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    //$('#companyModal').modal('hide');
                    this.app.hideSpinner();
                    return false;
                }

            });
        }
    }


    //Function for remote partner from list
    remove(item) {
        var index = this.partners.indexOf(item);
        this.partners.splice(index, 1);
    }


    //Function for validate email address
    isEmail(email) {
        return this.app.validateEmail(email);
    }


    //function for sort table data 
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }


    // For Print Purpose 
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

    // For PDF Download
    downloadPDF() {
        // var doc = new jsPDF("p", "pt", "A4"),
        //     source = $("#printArea")[0],
        //     margins = {
        //         top: 75,
        //         right: 30,
        //         bottom: 50,
        //         left: 30,
        //         width: 50
        //     };
        // doc.fromHTML(
        //     source, // HTML string or DOM elem ref.
        //     margins.left, // x coord
        //     margins.top,
        //     {
        //         // y coord
        //         width: margins.width // max width of content on PDF
        //     },
        //     function (dispose) {
        //         // dispose: object with X, Y of the last line add to the PDF
        //         //          this allow the insertion of new lines after html
        //         doc.save("Test.pdf");
        //     },
        //     margins
        // );
    }

    //For CSV File 
    public downloadCSV() {
    }

    //For Exce File
    public downloadExcel() {
    }


    //* function for hide or unhide div
    allowDiv() {

        //alert(this.cmbCType);

        if (this.cmbCType == '') {
            this.toastr.errorToastr('Please select business type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.cmbCType == '1') {
            this.solePro = true;
            this.partner = false;
            this.ppCom = false;
        }
        else if (this.cmbCType == '2') {
            this.partner = true;
            this.solePro = false;
            this.ppCom = false;
        }
        else if (this.cmbCType == '3') {
            this.ppCom = true;
            this.partner = false;
            this.solePro = false;
        }

        if (this.cmbCType != '') {
            this.btnStpr1 = true;
        }
    }


    //*----------------For Owner Starts---------------//
    owOnContactChange(oContactType, item) {

        if (oContactType == "Fax") {
            item.areaCode = true;
            item.mobileCode = false;
        }
        else if (oContactType == "Telephone") {
            item.areaCode = true;
            item.mobileCode = false;
        }
        else if (oContactType == "Mobile") {
            item.areaCode = false;
            item.mobileCode = true;
        }
        else {
            return;
        }
    }

    //*----------------For Owner Ends---------------//


    //*----------------For Business Starts---------------//
    onContactChange(contactType, item) {

        if (contactType == "Fax") {
            item.areaCode = true;
            item.mobileCode = false;
        }
        else if (contactType == "Telephone") {
            item.areaCode = true;
            item.mobileCode = false;
        }
        else if (contactType == "Mobile") {
            item.areaCode = false;
            item.mobileCode = true;
        }
        else {
            return;
        }
    }


    addCompanyContact() {

        if(this.cContactType == ''){
            this.toastr.errorToastr('Please select contact type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.cContactNumber == ''){
            this.toastr.errorToastr('Please enter contact number', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            var flag = false;

            for (var i = 0; i < this.contactList.length; i++) {
                if(this.contactList[i].contactType == this.cContactType && this.contactList[i].contactNumber == this.cContactNumber){
                    flag = true;
                }
            }

            if (flag == false){

                this.contactList.push({
                    contactDetailCode: 0,
                    telId: 0,
                    contactType: this.cContactType,
                    status: 0,
                    contactNumber: this.cContactNumber,
                    mobileNumber: "",
                    countryCode: 0
                });
    
                this.cContactType = '';
                this.cContactNumber = '';

            }

        }
        

    }

    addAddress() {

        

    }

    addCompanyEmail() {


        if (this.cEmailAdrs == ''){
            this.toastr.errorToastr('Please enter email address', 'Error', { toastTimeout: (2500) });
            return false;
        } 
        else if(this.app.validateEmail(this.cEmailAdrs) == false){
            this.toastr.errorToastr('Invalid email address', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            var flag = false;

            for (var i = 0; i < this.emailList.length; i++) {
                if(this.emailList[i].email == this.cEmailAdrs){
                    flag = true;
                }
            }

            if (flag == false){

                this.emailList.push({
                    contactDetailCode: 0,
                    emailId: 0,
                    type: 0,
                    status: 0,
                    email: this.cEmailAdrs,
                });
    
                this.cEmailAdrs = '';

            }

        }

    }

    //Deleting contact row
    removeContact(index) {
        //this.contactList[index].status = 2;
        this.contactList.splice(index, 1);
    }

    //Deleting address row
    removeAddress(item) {
        this.addressList.splice(item, 1);
    }

    //Deleting address row
    removeEmail(item) {
        this.emailList.splice(item, 1);
    }

    //*----------------For Business Ends---------------//

}