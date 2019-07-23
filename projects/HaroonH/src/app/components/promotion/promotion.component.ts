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
    selector: 'app-promotion',
    templateUrl: './promotion.component.html',
    styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

    //serverUrl = "http://localhost:9028/";
    serverUrl = "http://52.163.189.189:9028/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    //*Bolean variable 
    updateFlag = false;

    //* list for excel data
    excelDataList = [];

    availablePostsList = [];
    employeeList = [];
    
    

    //* variables for pagination and orderby pipe
    p = 1;
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';

    //* Variables for NgModels
    tblSearch;

    ddlJobPost;
    efectDate;
    IndvdlID;

    pJobDesigID;
    pJobPostDeptCd;
    pJobPostLocationCd
    lblPBranch;
    lblPDepartment;
    lblPPayGrade;

    cJobDesigID;
    cJobPostDeptCd;
    cJobPostLocationCd
    lblCBranch;
    lblDesignation;
    lblDepartment;
    lblPayGrade;
    lblJoiningDate;


    txtdPassword = '';
    txtdPin = '';

    constructor(
        public toastr: ToastrManager,
        private app: AppComponent,
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService,
        private http: HttpClient) { }

    ngOnInit() {

        this.getAvailablePosts();
        this.getEmployee();

    }


    @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel


    //function for get all available posts 
    getAvailablePosts() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getAvailablePosts', { headers: reqHeader }).subscribe((data: any) => {
            
            for (var i = 0; i < data.length; i++) {
                this.availablePostsList.push({
                    label: data[i].jobDesigName,
                    value: data[i].jobDesigID,
                    jobPostDeptCd: data[i].jobPostDeptCd,
                    jobPostLocationCd: data[i].jobPostLocationCd,
                    payGradeName: data[i].payGradeName,
                    deptName: data[i].deptName,
                    locationName: data[i].locationName
                });
            }

        });

    }


    //function for get employees 
    getEmployee() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getEmployee', { headers: reqHeader }).subscribe((data: any) => {

            this.employeeList = data;

        });

    }



    //Function for save and update leave Type 
    save() {
        
        if (this.ddlJobPost == undefined || this.ddlJobPost == "") {
            this.toastr.errorToastr('Please select job post', 'Error', { toastTimeout: (2500) });
            return false;
        } else if (this.efectDate == undefined || this.efectDate == "") {
            this.toastr.errorToastr('Please enter effect date', 'Error', { toastTimeout: (2500) });
            return false;
        } else if (this.cJobDesigID == "" || this.pJobDesigID == "") {
            this.toastr.errorToastr('Invalid request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            //* ********************************************save data 
            var saveData = {
                "IndvdlID": this.IndvdlID,
                "JobDesigID": this.cJobDesigID,
                "JobPostDeptCd": this.cJobPostDeptCd,
                "JobPostLocationCd": this.cJobPostLocationCd,
                "EmpJobStartDt": this.efectDate,
                "P_JobDesigID": this.pJobDesigID,
                "P_JobPostDeptCd": this.pJobPostDeptCd,
                "P_JobPostLocationCd": this.pJobPostLocationCd,
                "ConnectedUser": 12000, //this.app.empId,
                "DelFlag": 0
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/promoteEmployee', saveData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Updated Successfully!") {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    this.getEmployee();
                    this.clear();
                    return false;
                }
            });
        }
    }


    //function for edit existing leave type 
    edit(item) {

        this.clear();
        this.updateFlag = true;

        this.IndvdlID = item.indvdlID;

        this.cJobDesigID = item.jobDesigID;
        this.cJobPostDeptCd = item.jobPostDeptCd;
        this.cJobPostLocationCd = item.jobPostLocationCd;
        this.lblCBranch = item.locationName;
        this.lblDesignation = item.jobDesigName;
        this.lblDepartment = item.deptName;
        this.lblPayGrade = item.payGradeName;
        this.lblJoiningDate = item.empJobStartDt;

    }



    //function for empty all fields
    clear() {

        this.IndvdlID = "";
        this.updateFlag = false;

        this.ddlJobPost = "";
        this.efectDate = "";

        this.pJobDesigID = "";  
        this.pJobPostDeptCd = "";
        this.pJobPostLocationCd = "";
        this.lblPBranch = "";
        this.lblPDepartment = "";
        this.lblPPayGrade = "";

        this.cJobDesigID = "";
        this.cJobPostDeptCd = "";
        this.cJobPostLocationCd = "";
        this.lblCBranch = "";
        this.lblDesignation = "";
        this.lblDepartment = "";
        this.lblPayGrade = "";
        this.lblJoiningDate = "";
        
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



    //function for get filtere data from list 
    getFilterItem(filterOption) {
        
        var dataList = [];
        
        if(filterOption == "promote"){

            dataList = this.availablePostsList.filter(x => x.value == this.ddlJobPost);
        
            this.lblPBranch = dataList[0].locationName;
            this.lblPDepartment = dataList[0].deptName;
            this.lblPPayGrade = dataList[0].payGradeName;

            this.pJobDesigID = this.ddlJobPost;
            this.pJobPostDeptCd = dataList[0].jobPostDeptCd;
            this.pJobPostLocationCd = dataList[0].jobPostLocationCd;

        }

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
        // //alert('CSV works');
        // // case 1: When tblSearch is empty then assign full data list
        // if (this.tblSearch == "") {
        //     var completeDataList = [];
        //     for (var i = 0; i < this.leaveRuleList.length; i++) {
        //         //alert(this.tblSearch + " - " + this.skillCriteriaList[i].departmentName)
        //         completeDataList.push({
        //             LeaveType: this.leaveRuleList[i].leaveTypeName,
        //             Nature: this.leaveRuleList[i].leaveNatureName,
        //             Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
        //             Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
        //         });
        //     }
        //     this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("LeaveRulesCompleteCSV", CsvFileTypes.CSV));
        // }
        // // case 2: When tblSearch is not empty then assign new data list
        // else if (this.tblSearch != "") {
        //     var filteredDataList = [];
        //     for (var i = 0; i < this.leaveRuleList.length; i++) {
        //         if (this.leaveRuleList[i].leaveTypeName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
        //             this.leaveRuleList[i].leaveNatureName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
        //             this.leaveRuleList[i].leaveLmtName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
        //             this.leaveRuleList[i].leaveLmtAmoUNt == this.tblSearch) {
        //             filteredDataList.push({
        //                 LeaveType: this.leaveRuleList[i].leaveTypeName,
        //                 Nature: this.leaveRuleList[i].leaveNatureName,
        //                 Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
        //                 Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
        //             });
        //         }
        //     }

        //     if (filteredDataList.length > 0) {
        //         this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("LeaveRulesFilterCSV", CsvFileTypes.CSV));
        //     } else {
        //         this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
        //     }
        // }
    }


    downloadExcel() {
        // //alert('Excel works');
        // // case 1: When tblSearch is empty then assign full data list
        // if (this.tblSearch == "") {
        //     //var completeDataList = [];
        //     for (var i = 0; i < this.leaveRuleList.length; i++) {
        //         this.excelDataList.push({
        //             LeaveType: this.leaveRuleList[i].leaveTypeName,
        //             Nature: this.leaveRuleList[i].leaveNatureName,
        //             Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
        //             Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
        //         });
        //     }
        //     this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("LeaveRulesCompleteExcel"));
        //     this.excelDataList = [];
        // }
        // // case 2: When tblSearch is not empty then assign new data list
        // else if (this.tblSearch != "") {
        //     for (var i = 0; i < this.leaveRuleList.length; i++) {
        //         if (this.leaveRuleList[i].leaveTypeName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
        //             this.leaveRuleList[i].leaveNatureName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
        //             this.leaveRuleList[i].leaveLmtName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
        //             this.leaveRuleList[i].leaveLmtAmoUNt == this.tblSearch) {
        //             this.excelDataList.push({
        //                 LeaveType: this.leaveRuleList[i].leaveTypeName,
        //                 Nature: this.leaveRuleList[i].leaveNatureName,
        //                 Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
        //                 Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
        //             });
        //         }
        //     }

        //     if (this.excelDataList.length > 0) {
        //         //alert("Filter List " + this.excelDataList.length);

        //         this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("LeaveRulesFilterExcel"));
        //         this.excelDataList = [];
        //     }
        //     else {
        //         this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
        //     }
        // }
    }


    // =======
    // >>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9


}
