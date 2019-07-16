import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

declare var $: any;

@Component({
selector: 'app-recruitmentapp',
templateUrl: './recruitmentapp.component.html',
styleUrls: ['./recruitmentapp.component.scss']
})
export class RecruitmentappComponent implements OnInit {

    serverUrl = "http://192.168.200.19:9025/";
// <<<<<<< HEAD
    // serverUrl = "http://localhost:9025/";
// =======
    //serverUrl = "http://localhost:9025/";
// >>>>>>> 9522997859b027767e91c6b1f89039f147fa33af
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

    //* list variables
    excelDataList = [];

    recruitmetAppsList = [];
    publishingChannelList = [];
    approvalReqList = [];
    apprProcessList = [];
    apprAuthorigyList = [];
    interviewPanelList = [];
    testSubjectList = [];
    subjectList = []
    jobPostVacancyIdList = [];


    tempPublishingChannelList = [];

    //*hidden variables
    VacancyId = "";
    JobPostVcncyID = "";

    prInterviewCode = 0;

    //* Variables for NgModels
    tblSearch

    JobDesigID = "";
    JobPostDeptCd = "";
    JobPostLocationCd = "" ;
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
    ddlJobPostVacancyId;
    jobPostVacancyFlag = false;
    JobPostVcncyFnnclImpct = 0;

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



    constructor(
            private _formBuilder: FormBuilder,
            private toastr: ToastrManager,
            private http: HttpClient,
            private app: AppComponent
    ) { }

    ngOnInit() {

        this.getRecruitmentApps();
        this.getPubChannel();
        this.getApprProcess();
        this.getApprAuthority();
        this.getSubjct();

    }


    //function for get all saved recruitment applications 
    getRecruitmentApps() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getRecruitmentApprovalMain', { headers: reqHeader }).subscribe((data: any) => {
            
            this.recruitmetAppsList = data;

            this.app.hideSpinner();
        });

    }

    //function for get all saved publishing channel 
    getPubChannel() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getPubChannel', { headers: reqHeader }).subscribe((data: any) => {

            this.publishingChannelList = [];

            for (var i = 0; i < data.length; i++) {
                // this.tempPublishingChannelList.push({
                //     label: data[i].pblshngChnnlName,
                //     value: data[i].pblshngChnnlCd,
                // });

                this.publishingChannelList.push({
                    pblshngChnnlCd: data[i].pblshngChnnlCd,
                    pblshngChnnlName: data[i].pblshngChnnlName,
                    pblshingStatus: false
                });
            }

            this.app.hideSpinner();

        });

    }

    //function for get all saved approving process 
    getApprProcess() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getApprProcess', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.apprProcessList.push({
                    label: data[i].apprvngPrcssName,
                    value: data[i].apprvngPrcssCd,
                });

                if(data[i].apprvngPrcssName == 'Interview'){
                    this.prInterviewCode = data[i].apprvngPrcssCd;
                }

            }

            this.app.hideSpinner();

        });

    }

    //function for get all saved approving authority 
    getApprAuthority() {

        this.app.showSpinner();
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
        
            this.app.hideSpinner();
        });
    }

    //function for get all saved subjects 
    getSubjct() {

        this.app.showSpinner();
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
            
            this.app.hideSpinner();
        });
    }

    //Function for get job post vacancy ids 
    getJobPostVacancyId() {

        if (this.JobDesigID == "" || this.JobPostDeptCd == "" || this.JobPostLocationCd == "") {
            this.toastr.errorToastr('Invalid Request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            this.app.showSpinner();

            //* ********************************************save data 
            var reqData = {
                "JobDesigID":               this.JobDesigID,
                "JobPostDeptCd":            this.JobPostDeptCd,
                "JobPostLocationCd":        this.JobPostLocationCd,
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/getJobPostVacancyId', reqData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Done") {
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                    return false;
                } else {


                    if(data.vacancyIdList.length > 0){
                        this.jobPostVacancyFlag = true;
                        this.jobPostVacancyIdList = data.vacancyIdList;
                    }
                    //this.tempDegreeList =           data.degreeList;
                    //this.tempCertificateList =      data.certificateList;
                    //this.tempExperienceList =       data.experienceList;
                    //this.tempDescList =             data.descList;
                    //this.tempLeaveRulesList =       data.leaveRuleList;
                    //this.jobFacilityList =         data.facilityList;
                    this.app.hideSpinner();
                }
            });
        }
    }
    
    //Function for get job post vacancy detail 
    getJobPostVacancyDetail() {

        if (this.ddlJobPostVacancyId == undefined || this.ddlJobPostVacancyId == "") {
            this.toastr.errorToastr('Invalid Request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            this.app.showSpinner();

            //* ********************************************save data 
            var reqData = {
                "JobPostVcncyID":  this.ddlJobPostVacancyId,
                "VcncyID":         this.ddlJobPostVacancyId
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/getJobPostVacancyDetail', reqData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Done") {
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {

                    this.startDate = new Date(data.vcncyDetlList[0].vcncyStartDt);
                    this.endDate = new Date(data.vcncyDetlList[0].vcncyExprtnDt);
                    this.Quantity = data.vcncyDetlList[0].jobPostVcncyQty.toString();
                    this.totalVacancies += data.vcncyDetlList[0].jobPostVcncyQty;
                    this.VacancyId = data.vcncyDetlList[0].vcncyID;
                    this.JobPostVcncyID = data.vcncyDetlList[0].jobPostVcncyID;
                    this.JobPostVcncyFnnclImpct = data.vcncyDetlList[0].jobPostVcncyFnnclImpct;

                    this.approvalReqList = data.aprList;
                    this.interviewPanelList = data.intrvwList;
                    this.testSubjectList = data.txtList;
                    this.publishingChannelList = data.pubChnlList;

                    this.app.hideSpinner()

                }
            });
        }
    }




    

    //Function for add new publishng chanel  row
    addPubChannel() {

        if (this.ddlPubChannel == undefined || this.ddlPubChannel == "" ) {
            this.toastr.errorToastr('Please select publishing channel', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{            

            var duplicateChk = false;

            for (var i = 0; i < this.publishingChannelList.length; i++) {
                if (this.publishingChannelList[i].pblshngChnnlCd == this.ddlPubChannel) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true){
                this.toastr.errorToastr('Publishing channel already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

                var dataList = [];
                dataList = this.tempPublishingChannelList.filter(x => x.value == this.ddlPubChannel);

                this.publishingChannelList.push({
                    pblshngChnnlCd: this.ddlPubChannel,
                    pblshngChnnlName: dataList[0].label,
                    pblshingStatus: false
                });

                this.ddlPubChannel = "";

            }
        }        
    }
    
    //Deleting publishing channel row
    removePubChannel(item) {
        this.publishingChannelList.splice(item, 1);
    }

    //Function for add new desc row
    addApprAuthority() {

        if (this.ddlApprProcess == undefined || this.ddlApprProcess == "" ) {
            this.toastr.errorToastr('Please select approval stage', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.ddlApprAuthority == undefined || this.ddlApprAuthority == "" ) {
            this.toastr.errorToastr('Please select approving authority', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{            

            var duplicateChk = false;

            for (var i = 0; i < this.approvalReqList.length; i++) {
                if (this.approvalReqList[i].actlApprvngAthrtyEmpID == this.ddlApprAuthority && this.approvalReqList[i].apprvngPrcssCd == this.ddlApprProcess) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true){
                this.toastr.errorToastr('Stage and authority already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

                var dataList = [];
                dataList = this.apprProcessList.filter(x => x.value == this.ddlApprProcess);

                var dataList1 = [];
                dataList1 = this.apprAuthorigyList.filter(x => x.value == this.ddlApprAuthority);

                this.approvalReqList.push({
                    apprvngPrcssCd: this.ddlApprProcess,
                    actlApprvngAthrtyEmpID: this.ddlApprAuthority,
                    actlApprvngAthrtyJobDesigID: dataList1[0].desgId,
                    actlApprvngAthrtyJobPostDeptCd: dataList1[0].postId,
                    actlApprvngAthrtyJobPostLocationCd: dataList1[0].locationId,
                    apprvngPrcssName: dataList[0].label,
                    authority: dataList1[0].label
                });

                this.ddlApprAuthority = "";
                this.ddlApprProcess = "";

            }
        }        
    }
    
    //Deleting publishing channel row
    removeApprAuthority(item) {
        this.approvalReqList.splice(item, 1);
    }

    //Function for add new interview official row
    addInterviewPanel() {

        if (this.ddlInterviewOfficial == undefined || this.ddlInterviewOfficial == "" ) {
            this.toastr.errorToastr('Please select official', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{            

            var duplicateChk = false;

            for (var i = 0; i < this.interviewPanelList.length; i++) {
                if (this.interviewPanelList[i].empID == this.ddlInterviewOfficial) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true){
                this.toastr.errorToastr('Official already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

                var dataList = [];
                dataList = this.apprAuthorigyList.filter(x => x.value == this.ddlInterviewOfficial);

                this.interviewPanelList.push({
                    apprvngPrcssCd: this.prInterviewCode,
                    empID: this.ddlInterviewOfficial,
                    jobDesigID: dataList[0].desgId,
                    jobPostDeptCd: dataList[0].postId,
                    jobPostLocationCd: dataList[0].locationId,
                    official: dataList[0].label
                });

                this.ddlInterviewOfficial = "";
            }
        }
    }
    
    //Deleting interview official row
    removeInterviewPanel(item) {
        this.interviewPanelList.splice(item, 1);
    }

    //Function for add new interview official row
    addTest() {

        if (this.ddlSubject == undefined || this.ddlSubject == "" ) {
            this.toastr.errorToastr('Please select subject', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.totalMarks == undefined || this.totalMarks == "" ) {
            this.toastr.errorToastr('Please enter total marks', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.passingMarks == undefined || this.passingMarks == "" ) {
            this.toastr.errorToastr('Please enter passing marks', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.totalMarks <= 0 || this.totalMarks > 100 ) {
            this.toastr.errorToastr('Invalid total marks', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.passingMarks <= 0 || this.passingMarks > 100 ) {
            this.toastr.errorToastr('Invalid passing marks', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.passingMarks > this.totalMarks ) {
            this.toastr.errorToastr('Invalid passing marks', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{            

            var duplicateChk = false;

            for (var i = 0; i < this.testSubjectList.length; i++) {
                if (this.testSubjectList[i].testSbjctCd == this.ddlSubject) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true){ 
                this.toastr.errorToastr('Subject already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

                var dataList = [];
                dataList = this.subjectList.filter(x => x.value == this.ddlSubject);

                this.testSubjectList.push({
                    apprvngPrcssCd: this.prInterviewCode,
                    testSbjctCd: this.ddlSubject,
                    jobPostVcncyID: this.JobPostVcncyID,
                    vcncyTestSbjctTotMrks: this.totalMarks,
                    vcncyTestSbjctPssngMrks: this.passingMarks,
                    testSbjctName: dataList[0].label
                });

                this.ddlSubject = "";
                this.totalMarks = "";
                this.passingMarks = "";

            }
        }
    }
    
    //Deleting interview official row
    removeTest(item) {
        this.testSubjectList.splice(item, 1);
    }








    




    //Function for save and update publishig channel 
    savePubChannel() {

        if (this.VacancyId == "" || this.VacancyId == undefined ) {
            this.toastr.errorToastr('Invalid Request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.publishingChannelList.length == 0 ) {
            this.toastr.errorToastr('Please enter publishing channel', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            this.app.showSpinner();

            //* ********************************************save data 
            var saveData = {
                "VcncyID":                this.VacancyId,
                "pubChannelList":         JSON.stringify(this.publishingChannelList),
                "ConnectedUser":          "12000",
                "DelFlag":                0
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/savePubChannel', saveData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Saved Successfully!") {
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                    return false;
                } else {
                    this.app.hideSpinner();
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    this.getPubChannel();
                    return false;
                }
            });
        }
    }

    //Function for save and update performance standard 
    saveRequest() {

        if (this.JobDesigID == undefined || this.JobDesigID == '') {
            this.toastr.errorToastr('Invalid request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.jobPostVacancyFlag == true && (this.ddlJobPostVacancyId == undefined || this.ddlJobPostVacancyId == '')) {
            this.toastr.errorToastr('Please select job post vacancy id', 'Error', { toastTimeout: (2500) });
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
        // else if (this.Description == undefined || this.Description == "") {
        //     this.toastr.errorToastr('Please enter description', 'Error', { toastTimeout: (2500) });
        //     return false;
        // }
        else {

            this.app.showSpinner();

            if (this.jobPostVacancyFlag == true) {

                // //* ********************************************update data 
                var updateData = {
                    "JobPostVcncyID": this.ddlJobPostVacancyId,
                    "VcncyID": this.VacancyId,
                    "VcncyDocLnk": null,
                    "VcncyStartDt": this.startDate,
                    "VcncyExprtnDt": this.endDate,
                    "JobDesigID": this.JobDesigID,
                    "JobPostDeptCd": this.JobPostDeptCd,
                    "JobPostLocationCd": this.JobPostLocationCd,
                    "JobPostVcncyQty": this.Quantity,
                    "JobPostVcncyFnnclImpct": this.JobPostVcncyFnnclImpct,
                    "Description": this.Description,
                    "ConnectedUser": "12000",
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveRequest', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Updated Successfully!") {
                        this.app.hideSpinner();
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                        return false;
                    } else {
                        this.app.hideSpinner();
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        this.getRecruitmentApps();
                        return false;
                    }
                });

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
                    "JobPostVcncyFnnclImpct": this.JobPostVcncyFnnclImpct,
                    "Description": this.Description,
                    "ConnectedUser": "12000",
                    "DelFlag": 0
                };
                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveRequest', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.app.hideSpinner();
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                        return false;
                    } else {
                        this.app.hideSpinner();
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        this.VacancyId = data.vcncyId;
                        this.JobPostVcncyID = data.jobPostVcncyID;

                        this.getRecruitmentApps();
                        return false;
                    }
                });
            }
        }
    }

    //Function for save and update approving authority 
    saveApprAuthority() {

        if (this.JobPostVcncyID == undefined || this.JobPostVcncyID == "") {
            this.toastr.errorToastr('Invalid request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.approvalReqList.length == 0 ) {
            this.toastr.errorToastr('Please enter approving authority detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            this.app.showSpinner();

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
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                    return false;
                } else {
                    this.app.hideSpinner();
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    this.approvalReqList = [];
                    return false;
                }
            });
        }
    }

    //Function for save and update approving authority 
    saveInterviewPanel() {

        if (this.JobPostVcncyID == undefined || this.JobPostVcncyID == "") {
            this.toastr.errorToastr('Invalid request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.interviewPanelList.length == 0 ) {
            this.toastr.errorToastr('Please enter interview panel detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            this.app.showSpinner();

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
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                    return false;
                } else {
                    this.app.hideSpinner();
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    this.interviewPanelList = [];
                    return false;
                }
            });
        }
    }

    //Function for save and update test  
    saveTest() {

        if (this.JobPostVcncyID == undefined || this.JobPostVcncyID == "") {
            this.toastr.errorToastr('Invalid request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.testSubjectList.length == 0 ) {
            this.toastr.errorToastr('Please enter test detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            this.app.showSpinner();

            //* ********************************************save data 
            var saveData = {
                "JobPostVcncyID": this.JobPostVcncyID,
                "TestSubjectList": JSON.stringify(this.testSubjectList),
                "ConnectedUser": "12000",
                "DelFlag": 0
            };
            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/saveTest', saveData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Saved Successfully!") {
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                    return false;
                } else {
                    this.app.hideSpinner();
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    this.testSubjectList = [];
                    return false;
                }
            });
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

        if(item.department == null){
            this.Department = "-";
        }else{
            this.Department = item.department;
        }

        this.Section = item.section;
        this.JobProfile = item.jobTitle;

        this.totalVacancies= (item.vacancies1 + item.vacancies2) - (item.request + item.process);
        this.getJobPostVacancyId();

    }

    clear(){

        this.VacancyId = "";
        this.JobPostVcncyID = "";
        this.JobDesigID = "";
        this.JobPostDeptCd = "";
        this.JobPostLocationCd = "";

        this.OfficeName = "";
        this.Department = "";
        this.Section = "";
        this.JobProfile = "";
        this.Quantity = 0;
        this.startDate = "";
        this.endDate = "";
        this.totalVacancies = 0;
        this.ddlJobPostVacancyId = "";
        this.jobPostVacancyFlag = false; 

        this.jobPostVacancyIdList = [];
        this.approvalReqList = []; 
        this.interviewPanelList = [];
        this.testSubjectList = [];
    }

    //function for sort table data 
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }

}
