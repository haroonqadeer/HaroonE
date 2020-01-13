import { Component, OnInit, ViewChild } from "@angular/core";
import { SelectItem } from "primeng/api";
import { ToastrManager } from "ng6-toastr-notifications";
import { HttpHeaders, HttpClient } from "@angular/common/http";

import { AppComponent } from "src/app/app.component";

import {
    IgxExcelExporterOptions,
    IgxExcelExporterService,
    IgxGridComponent,
    IgxCsvExporterService,
    IgxCsvExporterOptions,
    CsvFileTypes
} from "igniteui-angular";
import { asElementData } from '@angular/core/src/view';

declare var $: any;

@Component({
    selector: "app-transferposting",
    templateUrl: "./transferposting.component.html",
    styleUrls: ["./transferposting.component.scss"]
})
export class TransferpostingComponent implements OnInit {
    serverUrl = "http://localhost:9029/";
  //serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9029/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

  //*Bolean variable
    updateFlag = false;

    //* list for excel data
    excelDataList = [];

    transferType = "";
    srchPostFrom = '';
    srchPostTo = '';
    srchEmp1 = '';
    srchEmp2 = '';
    tblSearch = '';


    transferTypeList = [
        {transferType: 'Transfer'},
        {transferType: 'Permotion'},
        {transferType: 'Demotion'}];
        
    transfersList = [];
    branchList = [];
    departmentList1 = [];
    sectionList1 = [];
    departmentList2 = [];
    sectionList2 = [];
    jobsList = [];
    tempJobList1 = [];
    tempJobList2 = [];
    employeeList = [];
    tempEmpList1 = [];
    tempEmpList2 = [];


    branch1 = '';
    department1 = '';
    section1 = '';
    branch2 = '';
    department2 = '';
    section2 = '';
    postFrom = '';
    postTo = '';
    ddlEmployee1 = '';
    ddlEmployee2 = '';
    efectDate;

    lblPayGrade1;
    lblDesignation1;
    lblPayGrade2;
    lblDesignation2;

    JobDesigIDTo;
    JobPostDeptCdTo;
    JobPostLocationCdTo;

    JobDesigIDFrom;
    JobPostDeptCdFrom;
    JobPostLocationCdFrom;

    tempJobNameFrom = '';
    tempJobNameTo = '';

  //* variables for pagination and orderby pipe
    p = 1;
    order = "info.name";
    reverse = false;
    sortedCollection: any[];
    itemPerPage = "10";

    

    
    // lblBranch1;
    // lblDepartment1;
    

    
    // lblBranch2;
    // lblDepartment2;
    

    txtdPassword = "";
    txtdPin = "";

    constructor(
        public toastr: ToastrManager,
        private app: AppComponent,
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        // this.getAppointedEmployee();
        this.getEmployee();
        this.getBranch();
        this.getJobs();
    }

  @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel

    //function for get all available posts
    getAppointedEmployee() {
        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http.get(this.serverUrl + "api/getAppointedEmployee", { headers: reqHeader }).subscribe((data: any) => {
            this.employeeList = data;

            this.app.hideSpinner();
        });
    }

    getJobs() {
        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http.get(this.serverUrl + "api/getJobs", { headers: reqHeader }).subscribe((data: any) => {
            this.jobsList = data;
            this.tempJobList1 = data;
            this.tempJobList2 = data;
            this.app.hideSpinner();
        });
    }

    //function for get brnaches
    getBranch() {
        
        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
        
        this.http.get(this.serverUrl + "api/getBranches?cmpnyID=59", { headers: reqHeader }).subscribe((data: any) => {
            
            this.branchList = data;

            this.app.hideSpinner();
        });
    }

    //function for get departments 
    getDepartment(BranchCode, BranchNo) {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
        
        this.http.get(this.serverUrl + "api/getDepartments?cmpnyID=" + this.app.cmpnyId + "&locationCd="+ BranchCode +"", { headers: reqHeader }).subscribe((data: any) => {

            if (BranchNo == 1){
                this.department1 = '';
                this.departmentList1 = data;
            }else{
                this.department2 = '';
                this.departmentList2 = data
            }

            this.app.hideSpinner();
        });
    }

    //function for get section 
    getSection(DepartmentId, DepartmentNo) {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
        
        this.http.get(this.serverUrl + "api/getSection?cmpnyID=" + this.app.cmpnyId + "&deptId="+ DepartmentId +"", { headers: reqHeader }).subscribe((data: any) => {

            if (DepartmentNo == 1){
                this.section1 = '';
                this.sectionList1 = data;
            }else{
                this.section2 = '';
                this.sectionList2 = data
            }

            this.app.hideSpinner();
        });
    }


    getEmployee() {
        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http.get(this.serverUrl + "api/getEmployee", { headers: reqHeader }).subscribe((data: any) => {

            this.employeeList = data;
            this.tempEmpList1 = data;
            this.tempEmpList2 = data; 

            // for (var i = 0; i < data.length; i++) {
            //   this.emp1List.push({
            //     label: data[i].indvdlFullName + " - " + data[i].payGradeName,
            //     value: data[i].indvdlID,
            //     jobDesigID: data[i].jobDesigID,
            //     jobDesigName: data[i].jobDesigName,
            //     jobPostDeptCd: data[i].jobPostDeptCd,
            //     jobPostLocationCd: data[i].jobPostLocationCd,
            //     payGradeName: data[i].payGradeName,
            //     deptName: data[i].deptName,
            //     locationName: data[i].locationName
            //   });
            // }

            this.app.hideSpinner();
        });
    }

    //Function for save and update leave Type
    save() {
        if (this.efectDate == undefined || this.efectDate == "") {
            this.toastr.errorToastr("Please enter date", "Error", {toastTimeout: 2500});
            return false;
        } 
        else if (this.transfersList.length == 0) {
            this.toastr.errorToastr("Please add employee for transfer", "Error", {toastTimeout: 2500});
            return false;
        } 
        else if (this.efectDate == undefined || this.efectDate == "") {
            this.toastr.errorToastr("Please enter effect date", "Error", {toastTimeout: 2500});
            return false;
        } 
        else 
        {

            var flag = false;

            for (var i = 0; i < this.transfersList.length; i++){

                if(this.transfersList[i].status == 1){
                    flag = true;
                }
            }


            if(flag == true ){
                this.toastr.errorToastr("Invalid transfers record", "Error", {toastTimeout: 2500});
                return false;
            }
            else 
            {
                this.app.showSpinner();
                //* ********************************************save data
                var saveData = {
                    TransfersList: JSON.stringify(this.transfersList),
                    ConnectedUser: 12000, //this.app.empId,
                    DelFlag: 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

                this.http.post(this.serverUrl + "api/transferEmpList", saveData, {headers: reqHeader}).subscribe((data: any) => {
                    if (data.msg != "Record Saved Successfully!") {
                        this.app.hideSpinner();
                        this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
                        return false;
                    } else {
                        this.app.hideSpinner();
                        this.toastr.successToastr(data.msg, "Success!", { toastTimeout: 2500 });
                        this.reset();
                        this.getEmployee();
                        this.getJobs();
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
    }

    //function for empty all fields
    clear() {

        this.updateFlag = false;

        this.srchPostFrom = '';
        this.srchPostTo = '';
        this.branch1 = '';
        this.branch2 = '';
        this.department1 = '';
        this.department2 = '';
        this.section1 = '';
        this.section2 = '';
        this.postFrom = '';
        this.postTo = '';
        this.ddlEmployee1 = '';
        this.ddlEmployee2 = '';        
        this.lblDesignation1 = '';
        this.lblDesignation2 = '';
        this.lblPayGrade1 = '';
        this.lblPayGrade2 = '';
        this.srchEmp1 = '';
        this.srchEmp2 = '';
        this.tempJobNameFrom = '';
        this.tempJobNameTo = '';

        this.ddlEmployee1;
        this.ddlEmployee2;
        this.efectDate;

        this.departmentList1 = [];
        this.departmentList2 = [];
        this.sectionList1 = [];
        this.sectionList2 = [];

        this.tempJobList1 = this.jobsList;
        this.tempJobList2 = this.jobsList;
        this.tempEmpList1 = this.employeeList;
        this.tempEmpList2 = this.employeeList;

        this.JobDesigIDFrom;
        this.JobPostDeptCdFrom;
        this.JobPostLocationCdFrom;
        this.JobDesigIDTo;
        this.JobPostDeptCdTo;
        this.JobPostLocationCdTo;

    }

    //function for empty all fields
    reset() {

        this.clear();
        this.transfersList = [];
        this.efectDate = '';
        this.transferType = '';
    }

    //function for add post into temp array 
    add() {
        
        if (this.efectDate == undefined || this.efectDate == "") {
            this.toastr.errorToastr("Please enter effect date", "Error", { toastTimeout: 2500 });
            return false;
        }
        else if (this.transferType == undefined || this.transferType == "") {
            this.toastr.errorToastr("Please enter transfer type", "Error", { toastTimeout: 2500 });
            return false;
        }
        else if (this.postFrom == undefined || this.postFrom == "") {
            this.toastr.errorToastr("Please enter post from", "Error", { toastTimeout: 2500 });
            return false;
        }
        if (this.postTo == undefined || this.postTo == "") {
            this.toastr.errorToastr("Please enter post to", "Error", { toastTimeout: 2500 });
            return false;
        }
        else if (this.ddlEmployee1 == undefined || this.ddlEmployee1 == "") {
            this.toastr.errorToastr("Please select employee", "Error", { toastTimeout: 2500 });
            return false;
        }
        else if (this.JobDesigIDFrom == this.JobDesigIDTo && this.JobPostDeptCdFrom == this.JobPostDeptCdTo && this.JobPostLocationCdFrom == this.JobPostLocationCdTo) {
            this.toastr.errorToastr("Post from and post to are same", "Error", { toastTimeout: 2500 });
            return false;
        } 
        else 
        {
            //var myDate = new Date();
            var convertedDate = this.app.convertDate(this.efectDate);
            var dataList = [];

            dataList = this.transfersList.filter(x => x.IndvdlID == this.ddlEmployee1);

            if(dataList.length > 0){
                this.toastr.errorToastr(dataList[0].EmpName + " Already Added", "Error", { toastTimeout: 2500 });
                return false;
            }

            this.app.showSpinner();

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

            this.http.get(this.serverUrl + "api/chkEmpPost?JobDesigID="+ this.JobDesigIDTo +"&JobPostDeptCd="+ this.JobPostDeptCdTo +"&JobPostLocationCd="+ this.JobPostLocationCdTo +"&EmpJobLastDt="+ convertedDate +"", { headers: reqHeader }).subscribe((data: any) => {

                var exist = 0;
                var dataList = [];

                if (data.length > 0){
                    exist = 1;
                }

                dataList = this.employeeList.filter(x => x.indvdlID == this.ddlEmployee1);

                this.transfersList.push({
                    IndvdlID: this.ddlEmployee1,
                    IndvdlID2: this.ddlEmployee1,
                    JobDesigID: this.JobDesigIDFrom,
                    JobPostDeptCd: this.JobPostDeptCdFrom,
                    JobPostLocationCd: this.JobPostLocationCdFrom,
                    JobDesigID2: this.JobDesigIDTo,
                    JobPostDeptCd2: this.JobPostDeptCdTo,
                    JobPostLocationCd2: this.JobPostLocationCdTo,
                    EmpJobAppntmntDt: this.efectDate,
                    TransferType: this.transferType,

                    EmpName: dataList[0].indvdlFullName,
                    PostFrom: this.tempJobNameFrom,
                    PostTo: this.tempJobNameTo,
                    EmpFrom: this.ddlEmployee1,
                    status: exist
                });



                for (var i = 0; i < this.transfersList.length; i++) {

                    for (var j = 0; j < this.transfersList.length; j++) {

                        if(this.transfersList[i].JobDesigID2 == this.transfersList[j].JobDesigID
                            && this.transfersList[i].JobPostDeptCd2 == this.transfersList[j].JobPostDeptCd
                            && this.transfersList[i].JobPostLocationCd2 == this.transfersList[j].JobPostLocationCd
                        ){
                            this.transfersList[i].status = 0;
                        }

                    }

                }

                
                this.clear();
                this.app.hideSpinner();

            });
        }
    }

    //function for remove post into temp array 
    remove(index){
        this.transfersList.splice(index, 1);
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

        if (filterOption == "filteremp1") {

            dataList = this.employeeList.filter(x => x.indvdlID == this.ddlEmployee1);

            this.lblDesignation1 = dataList[0].desigName;
            this.lblPayGrade1 = dataList[0].payGradeName;

            this.postFrom = dataList[0].jobDesigID;

            this.JobDesigIDFrom = dataList[0].jobDesigID;
            this.JobPostDeptCdFrom = dataList[0].jobPostDeptCd;
            this.JobPostLocationCdFrom = dataList[0].jobPostLocationCd;
            this.tempJobNameFrom = dataList[0].jobDesigName;
        }

        if (filterOption == "filteremp2") {
            dataList = this.employeeList.filter(x => x.indvdlID == this.ddlEmployee2);

            // this.lblBranch2 = dataList[0].locationName;
            // this.lblDepartment2 = dataList[0].deptName;
            this.lblDesignation2 = dataList[0].desigName;
            this.lblPayGrade2 = dataList[0].payGradeName;

            this.postTo = dataList[0].jobDesigID;
            this.JobDesigIDTo = dataList[0].jobDesigID;
            this.JobPostDeptCdTo = dataList[0].jobPostDeptCd;
            this.JobPostLocationCdTo = dataList[0].jobPostLocationCd;
            this.tempJobNameTo = dataList[0].jobDesigName;
        }



        if (filterOption == "filterjob1") {

            dataList = this.employeeList.filter(x => x.jobDesigID == this.postFrom);

            if(dataList.length > 0){

                this.ddlEmployee1 = dataList[0].indvdlID;
                this.lblDesignation1 = dataList[0].desigName;
                this.lblPayGrade1 = dataList[0].payGradeName;

                this.JobDesigIDFrom = dataList[0].jobDesigID;
                this.JobPostDeptCdFrom = dataList[0].jobPostDeptCd;
                this.JobPostLocationCdFrom = dataList[0].jobPostLocationCd;
                this.tempJobNameFrom = dataList[0].jobDesigName;
            }
            else
            {
                this.ddlEmployee1 = '';
                this.lblDesignation1 = '';
                this.lblPayGrade1 = '';

                this.JobDesigIDFrom = '';
                this.JobPostDeptCdFrom = '';
                this.JobPostLocationCdFrom = '';
                this.tempJobNameFrom = '';

            }

        }

        if (filterOption == "filterjob2") {

            dataList = this.jobsList.filter(x => x.jobDesigID == this.postTo);

            if(dataList.length > 0){

                this.ddlEmployee2 = dataList[0].indvdlID;
                this.lblDesignation2 = dataList[0].desigName;
                this.lblPayGrade2 = dataList[0].payGradeName;

                this.JobDesigIDTo = dataList[0].jobDesigID;
                this.JobPostDeptCdTo = dataList[0].jobPostDeptCd;
                this.JobPostLocationCdTo = dataList[0].jobPostLocationCd;
                this.tempJobNameTo = dataList[0].jobDesigName;
            }
            else
            {
                this.ddlEmployee2 = '';
                this.lblDesignation2 = '';
                this.lblPayGrade2 = '';

                this.JobDesigIDTo = '';
                this.JobPostDeptCdTo = '';
                this.JobPostLocationCdTo = '';
                this.tempJobNameTo = '';
            }

        }



        if (filterOption == "filterbranch1") {

            dataList = this.jobsList.filter(x => x.jobPostLocationCd == this.branch1);
            this.tempJobList1 = dataList;

            dataList = this.employeeList.filter(x => x.jobPostLocationCd == this.branch1);
            this.tempEmpList1 = dataList;

            this.srchPostFrom = '';
            this.srchEmp1 = '';
            this.ddlEmployee1 = '';
            this.postFrom = '';
            this.lblDesignation1 = '';
            this.lblPayGrade1 = '';

        }

        if (filterOption == "filterdepart1") {

            dataList = this.jobsList.filter(x => x.jobPostLocationCd == this.branch1 && x.jobPostDeptCd == this.department1);
            this.tempJobList1 = dataList;
            
            dataList = this.employeeList.filter(x => x.jobPostLocationCd == this.branch1 && x.jobPostDeptCd == this.department1);
            this.tempEmpList1 = dataList;

            this.srchPostFrom = '';
            this.srchEmp1 = '';
            this.ddlEmployee1 = '';
            this.postFrom = '';
            this.lblDesignation1 = '';
            this.lblPayGrade1 = '';

        }

        if (filterOption == "filtersection1") {

            dataList = this.jobsList.filter(x => x.jobPostLocationCd == this.branch1 && x.jobPostDeptCd == this.section1 && x.managerJobPostLocationCd == this.branch1 && x.managerJobPostDeptCd == this.department1);
            this.tempJobList1 = dataList;
            
            dataList = this.employeeList.filter(x => x.jobPostLocationCd == this.branch1 && x.jobPostDeptCd == this.section1 && x.managerJobPostLocationCd == this.branch1 && x.managerJobPostDeptCd == this.department1);
            this.tempEmpList1 = dataList;

            this.srchPostFrom = '';
            this.srchEmp1 = '';
            this.ddlEmployee1 = '';
            this.postFrom = '';
            this.lblDesignation1 = '';
            this.lblPayGrade1 = '';


        }




        if (filterOption == "filterbranch2") {

            dataList = this.jobsList.filter(x => x.jobPostLocationCd == this.branch2);
            this.tempJobList2 = dataList;

            dataList = this.employeeList.filter(x => x.jobPostLocationCd == this.branch2);
            this.tempEmpList2 = dataList;

            this.srchPostTo = '';
            this.srchEmp2 = '';
            this.ddlEmployee2 = '';
            this.postTo = '';
            this.lblDesignation2 = '';
            this.lblPayGrade2 = '';

        }

        if (filterOption == "filterdepart2") {

            dataList = this.jobsList.filter(x => x.jobPostLocationCd == this.branch2 && x.jobPostDeptCd == this.department2);
            this.tempJobList2 = dataList;
            
            dataList = this.employeeList.filter(x => x.jobPostLocationCd == this.branch2 && x.jobPostDeptCd == this.department2);
            this.tempEmpList2 = dataList;

            this.srchPostTo = '';
            this.srchEmp2 = '';
            this.ddlEmployee2 = '';
            this.postTo = '';
            this.lblDesignation2 = '';
            this.lblPayGrade2 = '';

        }

        if (filterOption == "filtersection2") {

            dataList = this.jobsList.filter(x => x.jobPostLocationCd == this.branch2 && x.jobPostDeptCd == this.section2 && x.managerJobPostLocationCd == this.branch2 && x.managerJobPostDeptCd == this.department2);
            this.tempJobList2 = dataList;
            
            dataList = this.employeeList.filter(x => x.jobPostLocationCd == this.branch2 && x.jobPostDeptCd == this.section2 && x.managerJobPostLocationCd == this.branch2 && x.managerJobPostDeptCd == this.department2);
            this.tempEmpList2 = dataList;

            this.srchPostTo = '';
            this.srchEmp2 = '';
            this.ddlEmployee2 = '';
            this.postTo = '';
            this.lblDesignation2 = '';
            this.lblPayGrade2 = '';


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

        var frame1 = $("<iframe />");
        frame1[0].name = "frame1";
        frame1.css({ position: "absolute", top: "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow
        ? frame1[0].contentWindow
        : frame1[0].contentDocument.document
        ? frame1[0].contentDocument.document
        : frame1[0].contentDocument;
        frameDoc.document.open();

        //Create a new HTML document.
        frameDoc.document.write(
        "<html><head><title>DIV Contents</title>" +
            "<style>" +
            printCss +
            "</style>"
        );

        //Append the external CSS file.  <link rel="stylesheet" href="../../../styles.scss" />  <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
        frameDoc.document.write(
        '<style type="text/css" media="print">/*@page { size: landscape; }*/</style>'
        );

        frameDoc.document.write("</head><body>");

        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write("</body></html>");

        frameDoc.document.close();

        //alert(frameDoc.document.head.innerHTML);
        // alert(frameDoc.document.body.innerHTML);

        setTimeout(function() {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        frame1.remove();
        }, 500);
    }

    downloadPDF() {}

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
}
