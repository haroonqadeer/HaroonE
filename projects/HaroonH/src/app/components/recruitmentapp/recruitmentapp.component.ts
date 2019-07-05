import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

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
    selector: 'app-recruitmentapp',
    templateUrl: './recruitmentapp.component.html',
    styleUrls: ['./recruitmentapp.component.scss']
})
export class RecruitmentappComponent implements OnInit {

    serverUrl = "http://192.168.200.19:3013/";
    //serverUrl = "http://localhost:52929/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    //*Bolean variable 
    updateFlag = false;

    //* variables for pagination and orderby pipe
    p = 1;
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';

    //* Excel Data List
    excelDataList = [];

    recruitmetAppsList = [];
    publishingChannelList = [];
    approvalReqList = [];
    apprProcessList = [];
    apprAuthorigyList = [];
    interviewPanelList = [];
    testSubjectList = [];
    subjectList = []


    tempPublishingChannelList = [];

    //*hidden variables
    VacancyId = "";
    JobPostVcncyID = 1;

    prInterviewCode = 0;

    //* Variables for NgModels
    tblSearch

    JobDesigID = "";
    JobPostDeptCd = "";
    JobPostLocationCd = "";
    OfficeName = "";
    Department = "";
    Section = "";
    JobProfile = "";
    totalVacancies = 0;

    //* step 1 ngModels
    startDate;
    endDate;
    Quantity;
    Description;

    //* step 2 ngModels
    ddlApprProcess;
    ddlApprAuthority;

    //* step 3 ngModels
    ddlInterviewOfficial;

    //* step 4 ngModels
    ddlSubject
    totalMarks;
    passingMarks;

    //*step 5 ngModels
    ddlPubChannel;



    txtdPassword = '';
    txtdPin = '';



    constructor(public toastr: ToastrManager,
        private app: AppComponent,
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService,
        private http: HttpClient) { }

    ngOnInit() {

        this.getRecruitmentApps();
        this.getPubChannel();
        this.getApprProcess();
        this.getApprAuthority();
        this.getSubjct();

    }

    @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel


    //function for get all saved recruitment applications 
    getRecruitmentApps() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getRecruitmentApprovalMain', { headers: reqHeader }).subscribe((data: any) => {

            this.recruitmetAppsList = data;
        });

    }

    //function for get all saved publishing channel 
    getPubChannel() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getPubChannel', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.tempPublishingChannelList.push({
                    label: data[i].pblshngChnnlName,
                    value: data[i].pblshngChnnlCd,
                });
            }

        });

    }

    //function for get all saved approving process 
    getApprProcess() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getApprProcess', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.apprProcessList.push({
                    label: data[i].apprvngPrcssName,
                    value: data[i].apprvngPrcssCd,
                });

                if (data[i].apprvngPrcssName == 'Interview') {
                    this.prInterviewCode = data[i].apprvngPrcssCd;
                }

            }

        });

    }

    //function for get all saved approving authority 
    getApprAuthority() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getApprAuthority', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.apprAuthorigyList.push({
                    label: data[i].indvdlFullName + " - " + data[i].jobDesigName,
                    value: data[i].empID,
                    desgId: data[i].jobDesigID,
                    postId: data[i].jobPostDeptCd,
                    locationId: data[i].jobPostLocationCd
                });
            }
        });
    }

    //function for get all saved subjects 
    getSubjct() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getTestSubject', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.subjectList.push({
                    label: data[i].testSbjctName,
                    value: data[i].testSbjctCd
                });
            }
        });
    }








    //Function for add new publishng chanel  row
    addPubChannel() {

        if (this.ddlPubChannel == undefined || this.ddlPubChannel == "") {
            this.toastr.errorToastr('Please select publishing channel', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            var duplicateChk = false;

            for (var i = 0; i < this.publishingChannelList.length; i++) {
                if (this.publishingChannelList[i].PblshngChnnlCd == this.ddlPubChannel) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true) {
                this.toastr.errorToastr('Publishing channel already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

                var dataList = [];
                dataList = this.tempPublishingChannelList.filter(x => x.value == this.ddlPubChannel);

                this.publishingChannelList.push({
                    PblshngChnnlCd: this.ddlPubChannel,
                    PblshngChnnlName: dataList[0].label,
                    PblshingStatus: false
                });

            }
        }
    }

    //Deleting publishing channel row
    removePubChannel(item) {
        this.publishingChannelList.splice(item, 1);
    }

    //Function for add new desc row
    addApprAuthority() {

        if (this.ddlApprProcess == undefined || this.ddlApprProcess == "") {
            this.toastr.errorToastr('Please select approval stage', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.ddlApprAuthority == undefined || this.ddlApprAuthority == "") {
            this.toastr.errorToastr('Please select approving authority', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            var duplicateChk = false;

            for (var i = 0; i < this.approvalReqList.length; i++) {
                if (this.approvalReqList[i].ActlApprvngAthrtyEmpID == this.ddlApprAuthority && this.approvalReqList[i].ApprvngPrcssCd == this.ddlApprProcess) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true) {
                this.toastr.errorToastr('Stage and authority already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

                var dataList = [];
                dataList = this.apprProcessList.filter(x => x.value == this.ddlApprProcess);

                var dataList1 = [];
                dataList1 = this.apprAuthorigyList.filter(x => x.value == this.ddlApprAuthority);

                this.approvalReqList.push({
                    ApprvngPrcssCd: this.ddlApprProcess,
                    ActlApprvngAthrtyEmpID: this.ddlApprAuthority,
                    ActlApprvngAthrtyJobDesigID: dataList1[0].desgIdz,
                    ActlApprvngAthrtyJobPostDeptCd: dataList1[0].postId,
                    ActlApprvngAthrtyJobPostLocationCd: dataList1[0].locationId,
                    Stage: dataList[0].label,
                    Authority: dataList1[0].label
                });

            }
        }
    }

    //Deleting publishing channel row
    removeApprAuthority(item) {
        this.approvalReqList.splice(item, 1);
    }

    //Function for add new interview official row
    addInterviewPanel() {

        if (this.ddlInterviewOfficial == undefined || this.ddlInterviewOfficial == "") {
            this.toastr.errorToastr('Please select official', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            var duplicateChk = false;

            for (var i = 0; i < this.interviewPanelList.length; i++) {
                if (this.interviewPanelList[i].OfficialEmpID == this.ddlInterviewOfficial) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true) {
                this.toastr.errorToastr('Official already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

                var dataList = [];
                dataList = this.apprAuthorigyList.filter(x => x.value == this.ddlInterviewOfficial);

                this.interviewPanelList.push({
                    ApprvngPrcssCd: this.prInterviewCode,
                    OfficialEmpID: this.ddlInterviewOfficial,
                    JobDesigID: dataList[0].desgId,
                    JobPostDeptCd: dataList[0].postId,
                    JobPostLocationCd: dataList[0].locationId,
                    Official: dataList[0].label
                });
            }
        }
    }

    //Deleting interview official row
    removeInterviewPanel(item) {
        this.interviewPanelList.splice(item, 1);
    }

    //Function for add new interview official row
    addTest() {

        if (this.ddlSubject == undefined || this.ddlSubject == "") {
            this.toastr.errorToastr('Please select subject', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.totalMarks == undefined || this.totalMarks == "") {
            this.toastr.errorToastr('Please enter total marks', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.passingMarks == undefined || this.passingMarks == "") {
            this.toastr.errorToastr('Please enter passing marks', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.totalMarks <= 0 || this.totalMarks > 100) {
            this.toastr.errorToastr('Invalid total marks', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.passingMarks <= 0 || this.passingMarks > 100) {
            this.toastr.errorToastr('Invalid passing marks', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.passingMarks > this.totalMarks) {
            this.toastr.errorToastr('Invalid passing marks', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            var duplicateChk = false;

            for (var i = 0; i < this.testSubjectList.length; i++) {
                if (this.testSubjectList[i].TestSbjctCd == this.ddlSubject) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true) {
                this.toastr.errorToastr('Subject already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

                var dataList = [];
                dataList = this.subjectList.filter(x => x.value == this.ddlSubject);

                this.testSubjectList.push({
                    ApprvngPrcssCd: this.prInterviewCode,
                    TestSbjctCd: this.ddlSubject,
                    JobPostVcncyID: this.JobPostVcncyID,
                    VcncyTestSbjctTotMrks: this.totalMarks,
                    VcncyTestSbjctPssngMrks: this.passingMarks,
                    Subject: dataList[0].label
                });
            }
        }
    }

    //Deleting interview official row
    removeTest(item) {
        this.testSubjectList.splice(item, 1);
    }













    //Function for save and update publishig channel 
    savePubChannel() {

        if (this.publishingChannelList.length == 0) {
            this.toastr.errorToastr('Please enter publishing channel', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            // alert('ok');
            // return false; 

            if (this.VacancyId != '') {

                // //this.app.showSpinner();
                // // this.app.hideSpinner();
                // //* ********************************************update data 
                // var updateData = {
                //     "LeaveNatureCd": this.leaveNatureId,
                //     "LeaveNatureName": this.leaveNature,
                //     "LeaveNatureDesc": this.natureDescription,
                //     "ConnectedUser": "2",
                //     "DelFlag": 0,
                //     "DelStatus": "No"
                // };

                // //var token = localStorage.getItem(this.tokenKey);

                // //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                // this.http.put(this.serverUrl + 'api/updateLeaveNature', updateData, { headers: reqHeader }).subscribe((data: any) => {

                //     if (data.msg != "Record Updated Successfully!") {
                //         this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                //         return false;
                //     } else {
                //         this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                //         $('#leaveNatureModal').modal('hide');
                //         this.getLeaveNature();
                //         return false;
                //     }
                // });

            }
            else {

                //* ********************************************save data 
                var saveData = {
                    "VcncyID": 1,
                    "pubChannelList": JSON.stringify(this.publishingChannelList),
                    "ConnectedUser": "12000",
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/savePubChannel', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        //this.getJobDesc();
                        return false;
                    }
                });
            }
        }
    }

    //Function for save and update performance standard 
    saveRequest() {

        if (this.JobDesigID == undefined || this.JobDesigID == '') {
            this.toastr.errorToastr('Invalid request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.startDate == undefined || this.startDate == null) {
            this.toastr.errorToastr('Please enter start date', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.endDate == undefined || this.endDate == null) {
            this.toastr.errorToastr('Please enter end date', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.Quantity == undefined || this.Quantity == "") {
            this.toastr.errorToastr('Please select quantity', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.Description == undefined || this.Description == "") {
            this.toastr.errorToastr('Please enter description', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            if (this.VacancyId != '') {

                // //this.app.showSpinner();
                // // this.app.hideSpinner();
                // //* ********************************************update data 
                // var updateData = {
                //     "PrcssStepID": this.pStandardId,
                //     "ProcessStepTitle": this.pTitle,
                //     "ProcessStepDesc": this.pDescription,
                //     "PrcssID": 1,
                //     "PrcssTypeCd": 1,
                //     "ConnectedUser": "3",
                //     "DelFlag": 0,
                //     "DelStatus": "No"
                // };

                // //var token = localStorage.getItem(this.tokenKey);

                // //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                // this.http.put(this.serverUrl + 'api/updatePStandard', updateData, { headers: reqHeader }).subscribe((data: any) => {

                //     if (data.msg != "Record Updated Successfully!") {
                //         this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                //         return false;
                //     } else {
                //         this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                //         $('#standardModal').modal('hide');
                //         this.getPStandard();
                //         return false;
                //     }
                // });

            }
            else {

                //* ********************************************save data 
                var saveData = {
                    "JobPostVcncyID": 0,
                    "VcncyID": 0,
                    "VcncyDocLnk": null,
                    "VcncyStartDt": this.startDate,
                    "VcncyExprtnDt": this.endDate,
                    "JobDesigID": this.JobDesigID,
                    "JobPostDeptCd": this.JobPostDeptCd,
                    "JobPostLocationCd": this.JobPostLocationCd,
                    "JobPostVcncyQty": this.Quantity,
                    "JobPostVcncyFnnclImpct": 0,
                    "Description": this.Description,
                    "ConnectedUser": "12000",
                    "DelFlag": 0
                };
                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveRequest', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        //$('#standardModal').modal('hide');
                        //this.getPStandard();
                        return false;
                    }
                });
            }
        }
    }

    //Function for save and update approving authority 
    saveApprAuthority() {

        if (this.JobPostVcncyID == undefined || this.JobPostVcncyID == 0) {
            this.toastr.errorToastr('Invalid request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.approvalReqList.length == 0) {
            this.toastr.errorToastr('Please enter approving authority detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            if (this.VacancyId != '') {

                // //this.app.showSpinner();
                // // this.app.hideSpinner();
                // //* ********************************************update data 
                // var updateData = {
                //     "PrcssStepID": this.pStandardId,
                //     "ProcessStepTitle": this.pTitle,
                //     "ProcessStepDesc": this.pDescription,
                //     "PrcssID": 1,
                //     "PrcssTypeCd": 1,
                //     "ConnectedUser": "3",
                //     "DelFlag": 0,
                //     "DelStatus": "No"
                // };

                // //var token = localStorage.getItem(this.tokenKey);

                // //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                // this.http.put(this.serverUrl + 'api/updatePStandard', updateData, { headers: reqHeader }).subscribe((data: any) => {

                //     if (data.msg != "Record Updated Successfully!") {
                //         this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                //         return false;
                //     } else {
                //         this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                //         $('#standardModal').modal('hide');
                //         this.getPStandard();
                //         return false;
                //     }
                // });

            }
            else {

                //* ********************************************save data 
                var saveData = {
                    "JobPostVcncyID": this.JobPostVcncyID,
                    "ApprovalAuthorityList": JSON.stringify(this.approvalReqList),
                    "ConnectedUser": "12000",
                    "DelFlag": 0
                };
                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveApproval', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        //$('#standardModal').modal('hide');
                        //this.getPStandard();
                        return false;
                    }
                });
            }
        }
    }

    //Function for save and update approving authority 
    saveInterviewPanel() {

        if (this.interviewPanelList.length == 0) {
            this.toastr.errorToastr('Please enter interview panel detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            if (this.VacancyId != '') {

                // //this.app.showSpinner();
                // // this.app.hideSpinner();
                // //* ********************************************update data 
                // var updateData = {
                //     "PrcssStepID": this.pStandardId,
                //     "ProcessStepTitle": this.pTitle,
                //     "ProcessStepDesc": this.pDescription,
                //     "PrcssID": 1,
                //     "PrcssTypeCd": 1,
                //     "ConnectedUser": "3",
                //     "DelFlag": 0,
                //     "DelStatus": "No"
                // };

                // //var token = localStorage.getItem(this.tokenKey);

                // //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                // this.http.put(this.serverUrl + 'api/updatePStandard', updateData, { headers: reqHeader }).subscribe((data: any) => {

                //     if (data.msg != "Record Updated Successfully!") {
                //         this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                //         return false;
                //     } else {
                //         this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                //         $('#standardModal').modal('hide');
                //         this.getPStandard();
                //         return false;
                //     }
                // });

            }
            else {

                //* ********************************************save data 
                var saveData = {
                    "JobPostVcncyID": this.JobPostVcncyID,
                    "InterviewPanelList": JSON.stringify(this.interviewPanelList),
                    "ConnectedUser": "12000",
                    "DelFlag": 0
                };
                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveInterviewPanel', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        //$('#standardModal').modal('hide');
                        //this.getPStandard();
                        return false;
                    }
                });
            }
        }
    }

    //Function for save and update test  
    saveTest() {

        if (this.testSubjectList.length == 0) {
            this.toastr.errorToastr('Please enter test detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            if (this.VacancyId != '') {

                // //this.app.showSpinner();
                // // this.app.hideSpinner();
                // //* ********************************************update data 
                // var updateData = {
                //     "PrcssStepID": this.pStandardId,
                //     "ProcessStepTitle": this.pTitle,
                //     "ProcessStepDesc": this.pDescription,
                //     "PrcssID": 1,
                //     "PrcssTypeCd": 1,
                //     "ConnectedUser": "3",
                //     "DelFlag": 0,
                //     "DelStatus": "No"
                // };

                // //var token = localStorage.getItem(this.tokenKey);

                // //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                // this.http.put(this.serverUrl + 'api/updatePStandard', updateData, { headers: reqHeader }).subscribe((data: any) => {

                //     if (data.msg != "Record Updated Successfully!") {
                //         this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                //         return false;
                //     } else {
                //         this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                //         $('#standardModal').modal('hide');
                //         this.getPStandard();
                //         return false;
                //     }
                // });

            }
            else {

                //* ********************************************save data 
                var saveData = {
                    "TestSubjectList": JSON.stringify(this.testSubjectList),
                    "ConnectedUser": "12000",
                    "DelFlag": 0
                };
                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveTest', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        //$('#standardModal').modal('hide');
                        //this.getPStandard();
                        return false;
                    }
                });
            }
        }
    }




    //function for get existing vacancy detail 
    getDetail(item) {

        this.clear();
        this.updateFlag = true;

        this.JobDesigID = item.jobDesigID;
        this.JobPostDeptCd = item.jobPostDeptCd;
        this.JobPostLocationCd = item.jobPostLocationCd;
        this.OfficeName = item.officeName;

        if (item.department == null) {
            this.Department = "-";
        } else {
            this.Department = item.department;
        }

        this.Section = item.section;
        this.JobProfile = item.jobTitle;

        this.totalVacancies = item.vacancies1 + item.vacancies2;

    }

    clear() {

        this.JobDesigID = "";
        this.JobPostDeptCd = "";
        this.JobPostLocationCd = "";
        this.OfficeName = "";
        this.Department = "";
        this.Section = "";
        this.JobProfile = "";
        this.totalVacancies = 0;

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


    downloadPDF() { }


    downloadCSV() {
        //alert('CSV works');
        // case 1: When tblSearch is empty then assign full data list
        if (this.tblSearch == "") {
            var completeDataList = [];
            for (var i = 0; i < this.recruitmetAppsList.length; i++) {
                //alert(this.tblSearch + " - " + this.skillCriteriaList[i].departmentName)
                completeDataList.push({
                    Office: this.recruitmetAppsList[i].officeName,
                    Department: this.recruitmetAppsList[i].department,
                    Section: this.recruitmetAppsList[i].section,
                    JobProfie: this.recruitmetAppsList[i].jobTitle,
                    BPS: this.recruitmetAppsList[i].bps,
                    Vacancies: (this.recruitmetAppsList[i].vacancies1 + this.recruitmetAppsList[i].vacancies2),
                    Requests: this.recruitmetAppsList[i].request
                });
            }
            this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("RecApprovalCompleteCSV", CsvFileTypes.CSV));
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.tblSearch != "") {
            var filteredDataList = [];
            for (var i = 0; i < this.recruitmetAppsList.length; i++) {
                if (this.recruitmetAppsList[i].officeName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.recruitmetAppsList[i].department.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.recruitmetAppsList[i].section.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.recruitmetAppsList[i].jobTitle.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.recruitmetAppsList[i].bps == this.tblSearch) {
                    filteredDataList.push({
                        Office: this.recruitmetAppsList[i].officeName,
                        Department: this.recruitmetAppsList[i].department,
                        Section: this.recruitmetAppsList[i].section,
                        JobProfie: this.recruitmetAppsList[i].jobTitle,
                        BPS: this.recruitmetAppsList[i].bps,
                        Vacancies: (this.recruitmetAppsList[i].vacancies1 + this.recruitmetAppsList[i].vacancies2),
                        Requests: this.recruitmetAppsList[i].request
                    });
                }
            }

            if (filteredDataList.length > 0) {
                this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("RecApprovalFilterCSV", CsvFileTypes.CSV));
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
            for (var i = 0; i < this.recruitmetAppsList.length; i++) {
                this.excelDataList.push({
                    Office: this.recruitmetAppsList[i].officeName,
                    Department: this.recruitmetAppsList[i].department,
                    Section: this.recruitmetAppsList[i].section,
                    JobProfie: this.recruitmetAppsList[i].jobTitle,
                    BPS: this.recruitmetAppsList[i].bps,
                    Vacancies: (this.recruitmetAppsList[i].vacancies1 + this.recruitmetAppsList[i].vacancies2),
                    Requests: this.recruitmetAppsList[i].request
                });
            }
            this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("RecApprovalCompleteExcel"));
            this.excelDataList = [];
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.tblSearch != "") {
            for (var i = 0; i < this.recruitmetAppsList.length; i++) {
                if (this.recruitmetAppsList[i].officeName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.recruitmetAppsList[i].department.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.recruitmetAppsList[i].section.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.recruitmetAppsList[i].jobTitle.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.recruitmetAppsList[i].bps == this.tblSearch) {
                    this.excelDataList.push({
                        Office: this.recruitmetAppsList[i].officeName,
                        Department: this.recruitmetAppsList[i].department,
                        Section: this.recruitmetAppsList[i].section,
                        JobProfie: this.recruitmetAppsList[i].jobTitle,
                        BPS: this.recruitmetAppsList[i].bps,
                        Vacancies: (this.recruitmetAppsList[i].vacancies1 + this.recruitmetAppsList[i].vacancies2),
                        Requests: this.recruitmetAppsList[i].request
                    });
                }
            }

            if (this.excelDataList.length > 0) {
                //alert("Filter List " + this.excelDataList.length);

                this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("RecApprovalFilterExcel"));
                this.excelDataList = [];
            }
            else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
        }
    }

}
