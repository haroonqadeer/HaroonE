    import { Component, OnInit, Injectable, ViewChild, ElementRef } from '@angular/core';
    import { Chart } from 'angular-highcharts';
    import { ToastrManager } from 'ng6-toastr-notifications';
    import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
    import { throwError } from 'rxjs';
    import { catchError, filter } from 'rxjs/operators';
    import { AppComponent } from 'src/app/app.component';
    import { TreeNode } from '../../nodeTree/TreeNode';
    import { ActivatedRoute} from '@angular/router';
    import {
        IgxExcelExporterOptions,
        IgxExcelExporterService,
        IgxGridComponent,
        IgxCsvExporterService,
        IgxCsvExporterOptions,
        CsvFileTypes
    } from "igniteui-angular";

    import * as jsPDF from 'jspdf';

    //----------------------------------------------------------------------------//
    //-------------------Working of this typescript file are as follows-----------//
    //-------------------Getting filter Item data -------------------//
    //-------------------Getting party data -------------------//
    //-------------------Add action into database --------------------------//
    //-------------------Add new employee into database --------------------------//
    //-------------------Update employee into database ---------------------------//
    //-------------------Export into PDF, CSV, Excel -----------------------------//
    //-------------------Function for action change -----------------------------//
    //-------------------Function for send link -----------------------------//
    //-------------------For sorting the record-----------------------------//
    //----------------------------------------------------------------------------//


    declare var $: any;

    @Component({
        selector: 'app-userprofile',
        templateUrl: './userprofile.component.html',
        styleUrls: ['./userprofile.component.scss']
    })
    export class UserprofileComponent implements OnInit {

    serverUrl = "http://localhost:55536/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    // list for excel data
    excelDataList = [];

    chart: Chart;
    eName = '';

    tblSearch;

        
    roleTree: TreeNode[];

    selectedRole: TreeNode[];
    //* variables for display values on page
    countAddition = 15;
    countUpdation = 10;
    countBanned = 5;
    partyEmail = '';
    partyFatherName = '';
    partyDepartment = '';
    partyBranch = '';
    partyAddress = '';
    userLink = '';
    userLinkCode = '';

    //*Variables for NgModels 
    searchAction = '';
    txtActionPassword = '';
    txtActionPIN = '';
    userId = 0;
    userSearch = '';
    rdbType = 'employee';
    searchEmployee = '';
    txtUsername = '';
    txtPassword = "";
    txtCnfrmPassword = "";

    //*Boolean ng models and variables
    disabledPassword = false;
    showLink = false;
    actionPassRow = false;
    actionPINCodeRow = false;
    actionBlockRow = false;

    //* variables for pagination and orderby pipe
    p = 1;
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';

    //List variables
    public users = [];
    listAction = '';
    listBlockedAction = '';
    cmbEmployee = '';

    userData = [
        {
            uId: 1,
            uName: 'Aamir76',
            uEmail: 'Aamir@gmail.com',
            uRole: 'IT',
            uSince: 'Friday',
            lastLogin: 'Monday'
        },
        {
            uId: 2,
            uName: 'Ali456676',
            uEmail: 'Ali@gmail.com',
            uRole: 'Finance',
            uSince: 'Monday',
            lastLogin: 'Friday'
        },
        {
            uId: 3,
            uName: 'Waqas445776',
            uEmail: 'Waqas@gmail.com',
            uRole: 'HR',
            uSince: 'Tuesday',
            lastLogin: 'Monday'
        },
        {
            uId: 4,
            uName: 'Umair45676',
            uEmail: 'Umair@gmail.com',
            uRole: 'SCM',
            uSince: 'Wednesday',
            lastLogin: 'Thrusday'
        },
        {
            uId: 5,
            uName: 'Touseeq5676',
            uEmail: 'Touseeq@gmail.com',
            uRole: 'IT',
            uSince: 'Tuesday',
            lastLogin: 'Thrusday'
        },
        {
            uId: 6,
            uName: 'Ijaz45676',
            uEmail: 'Ijaz@gmail.com',
            uRole: 'Admin',
            uSince: 'Monday',
            lastLogin: 'Saturday'
        },
        {
            uId: 7,
            uName: 'Zain45676',
            uEmail: 'Zain@gmail.com',
            uRole: 'IT',
            uSince: 'Sunday',
            lastLogin: 'Monday'
        },
        {
            uId: 8,
            uName: 'Shahrukh45676',
            uEmail: 'Shahrukh@gmail.com',
            uRole: 'Admin',
            uSince: 'Saturday',
            lastLogin: 'Monday'
        },
        {
            uId: 9,
            uName: 'Osama6176',
            uEmail: 'Osama@gmail.com',
            uRole: 'Operations',
            uSince: 'Friday',
            lastLogin: 'Tuesday'
        },
        {
            uId: 10,
            uName: 'Bilal9445676',
            uEmail: 'Bilal@gmail.com',
            uRole: 'IT',
            uSince: 'Wednesday',
            lastLogin: 'Monday'
        },
        {
            uId: 11,
            uName: 'Nabeel45676',
            uEmail: 'Nabeel@gmail.com',
            uRole: 'IT',
            uSince: 'Wednesday',
            lastLogin: 'Wednesday'
        },
        {
            uId: 12,
            uName: 'Saad9676',
            uEmail: 'Saad@gmail.com',
            uRole: 'Procurement',
            uSince: 'Employee',
            lastLogin: 'Wednesday'
        },
        {
            uId: 13,
            uName: 'Zohaib676',
            uEmail: 'Zohaib@gmail.com',
            uRole: 'Management',
            uSince: 'Contract',
            lastLogin: 'Wednesday'
        },
        {
            uId: 14,
            uName: 'Zeeshan676',
            uEmail: 'Zeeshan@gmail.com',
            uRole: 'IT',
            uSince: 'Employee',
            lastLogin: 'Wednesday'
        },
        {
            uId: 15,
            uName: 'Arslan676',
            uEmail: 'Arslan@gmail.com',
            uRole: 'IT',
            uSince: 'Permanent',
            lastLogin: 'Wednesday'
        },
    ];

    //Action Combobox object
    actions = [
        {
            actionId: '1',
            actionName: 'Block'
        },
        {
            actionId: '2',
            actionName: 'Delete'
        },
        {
            actionId: '3',
            actionName: 'Generate PIN'
        }
    ];

    // Block Action Combo Box
    blocks = [
        {
            blockId: '1',
            blockName: '1 Hour'
        },
        {
            blockId: '2',
            blockName: '1 Day'
        },
        {
            blockId: '3',
            blockName: '1 Week'
        },
        {
            blockId: '4',
            blockName: '1 Month'
        },
        {
            blockId: '5',
            blockName: 'Manual'
        }
    ]

    //Employee Combobox object
    employees = [
        {
            indvdlId: 1,
            eCNIC: '6110113445676',
            eName: 'Adnan',
            eDept: 'IT',
            eParty: 'Employee'
        },
        {
            indvdlId: 2,
            eCNIC: '6110112455675',
            eName: 'Ahmed',
            eDept: 'Accounts',
            eParty: 'Visitor'
        },
        {
            indvdlId: 3,
            eCNIC: '6110114356574',
            eName: 'Ali',
            eDept: 'Sales',
            eParty: 'Employee'
        },
        {
                indvdlId: 4,
                eCNIC: '6110116367563',
                eName: 'Amir',
                eDept: 'IT',
                eParty: 'Visitor'
            },
            {
                indvdlId: 5,
                eCNIC: '6110167345672',
                eName: 'Haroon',
                eDept: 'IT',
                eParty: 'Employee'
            }
        ];

        constructor(private http: HttpClient,
            private excelExportService: IgxExcelExporterService,
            private csvExportService: IgxCsvExporterService,
            private app: AppComponent,
            public toastr: ToastrManager,
            private actRoute: ActivatedRoute) { }

    ngOnInit() {
        this.init();

        this.getParty();
        // this.rdbType = 'employee';
        // this.getFilterItem(this.rdbType);
    }

    @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent;//For excel
    @ViewChild("exportPDF") public exportPDF: ElementRef;// for pdf

    //get user management chart data
    init() {

        let chart = new Chart({
            chart: {
                type: 'area'
            },
            credits: {
                enabled: false
            },
            title: {
                text: ""
            },
            yAxis: {
                title: {
                    text: 'USER'
                }
            },
            series: [{
                name: 'UPDATIONS',
                data: [300, 500, 250, 200, 800, 1000, 2000]
            }, {
                name: 'DEACTIVATED',
                data: [250, 100, 300, 650, 450, 800, 600]
            }, {
                name: 'ADDITIONS',
                data: [1, 1, 1, 100, 500, 800, 450]
            }]
        });

        this.chart = chart;
    }

    //party list filter method 
    getFilterItem(type) {
        return this.users.filter(x => x.type == type);
    }


    //get partys function 
    getParty() {

        var itemBackup = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + itemBackup });

        this.http.get(this.serverUrl + 'api/usersDetail', { headers: reqHeader }).subscribe((data: any) => {
            this.users = data
        });
    }


    //bloock, delete and generate pin for user
    saveAction() {
        if (this.listAction == '') {
            this.toastr.errorToastr('Please Select Action Type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {
            if (this.listAction == 'Block' && this.listBlockedAction == '') {
                //this.isLoginError = true;
                this.toastr.errorToastr('Please Select Block Time', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else if (this.txtActionPassword == '') {
                //this.isLoginError = true;
                this.toastr.errorToastr('Please Enter Password', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else if (this.txtActionPIN == '') {
                this.toastr.errorToastr('Please Enter PIN Code', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {
                this.app.showSpinner();
                this.app.hideSpinner();

                var data = { "empId": this.userId, "action": this.listAction, "duration": this.listBlockedAction, "password": this.txtActionPassword, "pin": this.txtActionPIN };

                var token = localStorage.getItem(this.tokenKey);

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                return this.http.post(this.serverUrl + 'api/action', data, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != undefined) {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        $('#actionModal').modal('hide');
                        return false;
                    }
                });
            }
        }
    }


    //create user name and password for party and send user name password
    saveEmployee() {
        if (this.rdbType == '') {
            this.toastr.errorToastr('Please select user type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.rdbType == 'employee' || this.rdbType == 'visitor') {
            if (this.cmbEmployee == '') {
                this.toastr.errorToastr('Please select user', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else if (this.txtUsername.trim().length == 0) {
                this.toastr.errorToastr('Please enter user name', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else if (this.txtPassword.trim().length == 0) {
                this.toastr.errorToastr('Please enter password', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else if (this.txtPassword != this.txtCnfrmPassword) {
                this.toastr.errorToastr('Your password and confirmation password do not match.', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {
                this.app.showSpinner();
                this.app.hideSpinner();

                var data = { "partyId": this.userId };

                var token = localStorage.getItem(this.tokenKey);

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                this.http.put(this.serverUrl + 'api/pwCreate', data, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != undefined) {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr('Record Inserted Successfully', 'Success!', { toastTimeout: (2500) });
                        $('#actionModal').modal('hide');
                        return false;
                    }

                });
            }
        }
        else {
            return false;
        }
    }


    //if you want to clear input
    clear() {

        this.userId = 0;
        this.txtUsername = '';

    }


    //on Employee change model and action btn click 
    edit(item, actionType) {

        if (actionType == 'block') {

            this.userId = item.indvdlId;

        }
        else if (actionType == 'link') {

            this.userId = item.indvdlId;
            this.userLink = "localhost:4200?code=";
            this.userLinkCode = btoa(this.userId + "");

            this.partyEmail = item.emailAddrss;
            this.partyFatherName = '';
            this.partyDepartment = '';
            this.partyBranch = '';
            this.partyAddress = item.indvdlFirstName;

            this.showLink = true;
        }
    }


    // For Print Purpose 
    printDiv() {

        // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

        // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
        // var cssAddress = ".cssAddress {font-size: 16px; }";
        // var cssContact = ".cssContact {font-size: 16px; }";

        // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

        // var printCss = commonCss + cssHeading + cssAddress + cssContact + tableCss;

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


    downPDF() {
        let doc = new jsPDF();
        let specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        }
        let content = this.exportPDF.nativeElement;
        doc.fromHTML(content.innerHTML, 15, 15, {
            'width': 190,
            'elementHandlers ': specialElementHandlers
        });
        doc.save('testabc.pdf');
    }


    //For CSV File 
    public downloadCSV() {
        // case 1: When userSearch is empty then assign full data list
        if (this.userSearch == "") {
            var completeDataList = [];
            for (var i = 0; i < this.userData.length; i++) {
                completeDataList.push({
                    userName: this.userData[i].uName,
                    email: this.userData[i].uEmail,
                    role: this.userData[i].uRole,
                    userSince: this.userData[i].uSince,
                    lastLogin: this.userData[i].lastLogin
                });
            }
            this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("UserProfileCompleteCSV", CsvFileTypes.CSV));
        }
        // case 2: When userSearch is not empty then assign new data list
        else if (this.userSearch != "") {
            var filteredDataList = [];
            for (var i = 0; i < this.userData.length; i++) {

                if (this.userData[i].uName.toUpperCase().includes(this.userSearch.toUpperCase()) ||
                    this.userData[i].uEmail.toUpperCase().includes(this.userSearch.toUpperCase()) ||
                    this.userData[i].uRole.toUpperCase().includes(this.userSearch.toUpperCase()) ||
                    this.userData[i].uSince.toUpperCase().includes(this.userSearch.toUpperCase()) ||
                    this.userData[i].lastLogin.toUpperCase().includes(this.userSearch.toUpperCase())) {
                    filteredDataList.push({
                        userName: this.userData[i].uName,
                        email: this.userData[i].uEmail,
                        role: this.userData[i].uRole,
                        userSince: this.userData[i].uSince,
                        lastLogin: this.userData[i].lastLogin
                    });
                }
            }

            if (filteredDataList.length > 0) {
                this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("UserProfileFilterCSV", CsvFileTypes.CSV));
            }
            else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
        }
    }


    //For Exce File
    public downloadExcel() {
        // case 1: When userSearch is empty then assign full data list
        if (this.userSearch == "") {
            for (var i = 0; i < this.userData.length; i++) {
                this.excelDataList.push({
                    userName: this.userData[i].uName,
                    email: this.userData[i].uEmail,
                    role: this.userData[i].uRole,
                    userSince: this.userData[i].uSince,
                    lastLogin: this.userData[i].lastLogin
                });
            }

            this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("UserProfileCompleteExcel"));
            this.excelDataList = [];
        }
        // case 2: When userSearch is not empty then assign new data list
        else if (this.userSearch != "") {

            for (var i = 0; i < this.userData.length; i++) {
                if (this.userData[i].uName.toUpperCase().includes(this.userSearch.toUpperCase()) ||
                    this.userData[i].uEmail.toUpperCase().includes(this.userSearch.toUpperCase()) ||
                    this.userData[i].uRole.toUpperCase().includes(this.userSearch.toUpperCase()) ||
                    this.userData[i].uSince.toUpperCase().includes(this.userSearch.toUpperCase()) ||
                    this.userData[i].lastLogin.toUpperCase().includes(this.userSearch.toUpperCase())) {
                    this.excelDataList.push({
                        userName: this.userData[i].uName,
                        email: this.userData[i].uEmail,
                        role: this.userData[i].uRole,
                        userSince: this.userData[i].uSince,
                        lastLogin: this.userData[i].lastLogin
                    });
                }
            }

            if (this.excelDataList.length > 0) {

                this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("UserProfileFilterExcel"));
                this.excelDataList = [];

            }
            else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
        }
    }


    // On Action Change Modal Window Combo Box
    onActionChange() {
        // When user selects "Delete" in the Combo Box
        if (this.listAction == 'Delete') {
            this.actionBlockRow = false;
            this.actionPassRow = true;
            this.actionPINCodeRow = true;
            //Clear Text Boxes
            this.txtActionPassword = '';
            this.txtActionPIN = '';
        }
        // When user selects "Block" in the Combo Box
        else if (this.listAction == 'Block') {
            this.actionBlockRow = true;
            this.actionPassRow = true;
            this.actionPINCodeRow = true;
            //Clear Text Boxes
            this.listBlockedAction = '';
            this.txtActionPassword = '';
            this.txtActionPIN = '';
        }
        // When user selects "Generate PIN" in the Combo Box
        else if (this.listAction == 'Generate PIN') {
            this.actionBlockRow = false;
            this.actionPassRow = true;
            this.actionPINCodeRow = false;
            //Clear Text Boxes
            this.listBlockedAction = '';
            this.txtActionPassword = '';
            this.txtActionPIN = '';
        }
        else {
            return false;
        }
    }


    //create user name and password for party and send user name password
    sendLink() {
        if (this.rdbType == '') {
            this.toastr.errorToastr('Please select user type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.rdbType == 'employee' || this.rdbType == 'visitor') {

            if (this.cmbEmployee == '') {
                this.toastr.errorToastr('Please select user', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {
                this.app.showSpinner();
                this.app.hideSpinner();

                var data = { "partyId": this.userId };

                var token = localStorage.getItem(this.tokenKey);

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                this.http.put(this.serverUrl + 'api/pwCreate', data, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != undefined) {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr('Record Inserted Successfully', 'Success!', { toastTimeout: (2500) });
                        $('#actionModal').modal('hide');
                        return false;
                    }

                });
            }
        }
        else {
            return false;
        }
    }


    //*function for sort table data 
    setOrder(value: string) {

        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }
    }

