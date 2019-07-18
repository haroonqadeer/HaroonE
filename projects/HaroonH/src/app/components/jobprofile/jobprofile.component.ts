import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

declare var $: any;

@Component({
    selector: 'app-jobprofile',
    templateUrl: './jobprofile.component.html',
    styleUrls: ['./jobprofile.component.scss']
})
export class JobprofileComponent implements OnInit {

    serverUrl = "http://192.168.200.19:9024/";
// <<<<<<< HEAD
    // serverUrl = "http://localhost:9024/";
// =======
    //serverUrl = "http://localhost:9024/";
// >>>>>>> 9522997859b027767e91c6b1f89039f147fa33af
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    //*Bolean variable 
    updateFlag = false;

    //* list variables
    excelDataList = [];

    jobsList = [];
    jobProfilesList = [];
    
    certificateList = [];
    degreeList = [];
    experienceList = [];
    descList = [];
    leaveRulesList = [];
    jobFacilityList = [];
    facilityTypeList = [];
    facilityList = [];
    skillList = [];


    tempJobsList = [];
    tempQualificationCriteriaList = [];
    tempDegreeList = [];
    tempCertificateList = [];
    tempExperienceList = [];
    tempDescList = [];
    tempLeaveRulesList = [];
    tempFacilityList = [];
    tempSkillList = [];



    //* variables for pagination and orderby pipe
    p = 1;
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';


    //*hidden variables 
    DesigId = 0;
    DeptId = 0;
    LocationId = 0;
    editFlag = false;

    Qualification = "";

    QualificationId = 0;
    QualificationTypeId = 0;
    QualificationCriteriaId = 0;

    Certificate = "";
    CertificateId = 0;
    CertificateTypeId = 0;
    CertificateCriteriaId = 0;


    Experience = "";
    ExperienceId = 0;
    ExperienceTypeId = 0;
    ExperienceCriteriaId = 0;

    Skill = "";
    SkillId = 0;
    SkillTypeId = 0;
    SkillCriteriaId = 0;


    //* Variables for NgModels
    tblSearch = '';

    jobProfileId = "";

    //*step 1 ng models
    jobTitle = "";

    lblJobProfile;

    leaveType;
    leaveNature;
    leaveLimit;
    limitType;
    lblBPS;
    lblJobType;

    //* setp 2 ng models
    ddlDegree = "";
    chkDegreePI = false;
    degreeReqLevel = null;
    degreeMaxLelvel = null;


    //* setp 3 ng models
    ddlCertificate = "";
    chkCertificatePI = false;
    certificateReqLevel = null;
    certificateMaxLelvel = null;



    //* setp 4 ng models
    ddlExperience = "";
    chkExperiencePI = false;
    experienceInMonth = 0;
    experienceYear = null;
    experienceMonth = null;

    //* setp 4 ng models
    ddlSkill = "";
    skillLevel = 0;
    chkSkillPI = false;


    //* step 6 ng models 
    ddlDescription = "";



    //* step 7 ng models 
    ddlLeaveRule = "";
    efectDate = "";



    //* step 8 ng models 
    ddlFacilityType = "";
    ddlFacility = "";

    
    txtdPassword = '';
    txtdPin = '';

    show=false;

    formGroup1: FormGroup;
    formGroup2: FormGroup;
    formGroup3: FormGroup;
    formGroup4: FormGroup;
    formGroup5: FormGroup;
    formGroup6: FormGroup;
    formGroup7: FormGroup;
    formGroup8: FormGroup;

    
    searchDegree = '';
    searchcertification = '';

    constructor(
        private _formBuilder: FormBuilder,
        private toastr: ToastrManager,
        private http: HttpClient,
        private app: AppComponent
    ) { }

    ngOnInit() {    

        this.steperSetting();
        this.getJobProfileMain();
        this.getJobPosts();
        this.getQualificationCriteria();
        this.getJobDesc();
        this.getLeaveRules();
        this.getFacilityType();
        this.getFacility();

    }

    steperSetting(){
        this.formGroup1 = this._formBuilder.group({
            cmbType: ['', Validators.required]
            });
            this.formGroup2 = this._formBuilder.group({
            cmbDegree: ['', Validators.required]
            });
            this.formGroup3 = this._formBuilder.group({
            cmbCertificate: ['', Validators.required]
            });
            this.formGroup4 = this._formBuilder.group({
            fourthCtrl: ['', Validators.required]
            });
            this.formGroup5 = this._formBuilder.group({
            fifthCtrl: ['', Validators.required]
            });
            this.formGroup6 = this._formBuilder.group({
            sixthCtrl: ['', Validators.required]
            });
            this.formGroup7 = this._formBuilder.group({
            sixthCtrl: ['', Validators.required]
            });
            this.formGroup8 = this._formBuilder.group({
            sixthCtrl: ['', Validators.required]
            });
    }

    //function for get all saved job posts 
    getJobPosts() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getJobPosts', { headers: reqHeader }).subscribe((data: any) => {
            
            this.tempJobsList = data;

            for (var i = 0; i < data.length; i++) {
                this.jobsList.push({
                    label: data[i].jobDesigName,
                    value: data[i].jobDesigID,
                });
            }

            this.app.hideSpinner();

        });

    }


    //function for get all saved job descriptions 
    getJobDesc() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getDesc', { headers: reqHeader }).subscribe((data: any) => {
            
            //this.tempJobsList = data;

            for (var i = 0; i < data.length; i++) {
                this.descList.push({
                    label: data[i].rspnsbltyDesc,
                    value: data[i].rspnsbltyCd,
                });
            }

            this.app.hideSpinner();

        });

    }


    //function for get all saved leave rules 
    getLeaveRules() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getLeaveRule', { headers: reqHeader }).subscribe((data: any) => {
            
            //this.leaveRulesList = data;
            
            for (var i = 0; i < data.length; i++) {
                this.leaveRulesList.push({
                    label: data[i].leaveTypeName + " - " + data[i].leaveNatureName,
                    value: data[i].leaveRuleID,
                    limit: data[i].leaveLmtAmoUNt
                });
            }

            this.app.hideSpinner();
        });
    }


    //function for get all saved facility types 
    getFacilityType() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getFacilityType', { headers: reqHeader }).subscribe((data: any) => {
            
            //this.leaveRulesList = data;
            
            for (var i = 0; i < data.length; i++) {
                this.facilityTypeList.push({
                    label: data[i].facilityTypeName,
                    value: data[i].facilityTypeCd
                });
            }

            this.app.hideSpinner();
        });
    }


    //function for get all saved facility  
    getFacility() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getFacility', { headers: reqHeader }).subscribe((data: any) => {
            
            this.facilityList = data;
            
            this.app.hideSpinner();
        });
    }


    //function for get all saved degrees, certificate and skills 
    getQualificationCriteria() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getQualificationCriteria', { headers: reqHeader }).subscribe((data: any) => {
            
            this.tempQualificationCriteriaList = data;

            for (var i = 0; i < data.length; i++) {

                //geting degree 
                if (data[i].qlfctnTypeName == 'Degree'){
                    this.degreeList.push({
                        label: data[i].qlfctnCriteriaName,
                        value: data[i].qlfctnCriteriaCd,
                    });
                }

                //getting certificate
                if (data[i].qlfctnTypeName == 'Certificate'){
                    this.certificateList.push({
                        label: data[i].qlfctnCriteriaName,
                        value: data[i].qlfctnCriteriaCd,
                    });
                }

                //getting experience
                if (data[i].qlfctnTypeName == 'Experience'){
                    this.experienceList.push({
                        label: data[i].qlfctnCriteriaName,
                        value: data[i].qlfctnCriteriaCd,
                    });
                }

                //getting skills
                if (data[i].qlfctnTypeName == 'Skills'){
                    this.skillList.push({
                        label: data[i].qlfctnCriteriaName,
                        value: data[i].qlfctnCriteriaCd,
                    });
                }
                
                this.app.hideSpinner();
            }

        });

    }


    //function for get all saved job profiles 
    getJobProfileMain() {

        this.app.showSpinner();
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getJobProfileMain', { headers: reqHeader }).subscribe((data: any) => {
            
            this.jobProfilesList = data;

            this.app.hideSpinner();

        });

    }

    //Function for save and update leave nature 
    getSpecificJobProfile() {

        if (this.DesigId == 0 || this.DeptId == 0 || this.LocationId == 0) {
            this.toastr.errorToastr('Invalid Request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            this.app.showSpinner();

            //* ********************************************save data 
            var reqData = {
                "JobDesigID":               this.DesigId,
                "JobPostDeptCd":            this.DeptId,
                "JobPostLocationCd":        this.LocationId,
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/getSpecificJobProfile', reqData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Done") {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {

                    this.tempDegreeList =           data.degreeList;
                    this.tempCertificateList =      data.certificateList;
                    this.tempExperienceList =       data.experienceList;
                    this.tempDescList =             data.descList;
                    this.tempLeaveRulesList =       data.leaveRuleList;
                    this.jobFacilityList =          data.facilityList;
                    this.tempSkillList =            data.skillList

                }

                this.app.hideSpinner();
            });
        }
    }


    //function for empay all fields
    clear(){
        
        this.DesigId = 0;
        this.DeptId = 0;
        this.LocationId = 0;
        this.lblBPS = "";
        this.lblJobType = "";
        this.editFlag = false;
        this.jobProfileId = "";
        this.jobTitle = "";

        this.tempDegreeList = [];
        this.tempCertificateList = [];
        this.tempExperienceList = [];
        this.tempDescList = [];
        this.tempLeaveRulesList = [];
        this.jobFacilityList = [];


        this.txtdPassword = '';
        this.txtdPin = '';

    }


    //function for edit record
    edit(item){

        this.clear();

        this.jobProfileId = "1";

        this.DesigId = item.jobDesigID;
        this.DeptId = item.jobPostDeptCd;
        this.LocationId = item.jobPostLocationCd;
        this.lblBPS = item.payGradeName;
        this.lblJobType = item.jobTypeName;
        
        this.editFlag = true;
        this.lblJobProfile = item.jobDesigName;


        this.jobTitle = item.jobDesigID;

        this.getSpecificJobProfile();

    }


    //Function for save and update record 
    save() {


        // this.toastr.errorToastr('Enter Complete Information', 'Error', { toastTimeout: (2500) });
        // return false;

        if (this.jobTitle == '' || this.jobTitle == null) {
            this.toastr.errorToastr('Please select job post', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.tempDegreeList.length == 0 ) {
            this.toastr.errorToastr('Please enter qualifiation detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        // else if (this.tempCertificateList.length == 0 ) {
        //     this.toastr.errorToastr('Please enter certification detail', 'Error', { toastTimeout: (2500) });
        //     return false;
        // }
        else if (this.tempExperienceList.length == 0 ) {
            this.toastr.errorToastr('Please enter experience detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.tempDescList.length == 0 ) {
            this.toastr.errorToastr('Please enter job description detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.tempSkillList.length == 0 ) {
            this.toastr.errorToastr('Please enter skills detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.tempLeaveRulesList.length == 0 ) {
            this.toastr.errorToastr('Please enter leave rules detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.jobFacilityList.length == 0 ) {
            this.toastr.errorToastr('Please enter facilities detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            
            this.app.showSpinner();

            if (this.jobProfileId != '') {

                // //this.app.showSpinner();
                // // this.app.hideSpinner();
                //* ********************************************update data 
                var updateData = {
                    "jobProfileID":             1,
                    "JobDesigID":               this.DesigId,
                    "JobPostDeptCd":            this.DeptId,
                    "JobPostLocationCd":        this.LocationId,
                    "jobQualificationList":     JSON.stringify(this.tempDegreeList),
                    "jobCertificationList":     JSON.stringify(this.tempCertificateList),
                    "jobExperienceList":        JSON.stringify(this.tempExperienceList),
                    "jobSkillList":             JSON.stringify(this.tempSkillList),
                    "jobDescriptionList":       JSON.stringify(this.tempDescList),
                    "jobLeaveRuleList":         JSON.stringify(this.tempLeaveRulesList),
                    "jobFacilityList":          JSON.stringify(this.jobFacilityList),
                    "ConnectedUser":            "12000",
                    "DelFlag":                  0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token 

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveJobProfileDegree', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Updated Successfully!") {
                        this.app.hideSpinner();
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                        return false;
                    } else {
                        this.app.hideSpinner();
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        this.getJobProfileMain();
                        return false;
                    }
                });

            }
            else {

                //* ********************************************save data 
                var saveData = {
                    "jobProfileID":             0,
                    "JobDesigID":               this.DesigId,
                    "JobPostDeptCd":            this.DeptId,
                    "JobPostLocationCd":        this.LocationId,
                    "jobQualificationList":     JSON.stringify(this.tempDegreeList),
                    "jobCertificationList":     JSON.stringify(this.tempCertificateList),
                    "jobExperienceList":        JSON.stringify(this.tempExperienceList),
                    "jobSkillList":             JSON.stringify(this.tempSkillList),
                    "jobDescriptionList":       JSON.stringify(this.tempDescList),
                    "jobLeaveRuleList":         JSON.stringify(this.tempLeaveRulesList),
                    "jobFacilityList":          JSON.stringify(this.jobFacilityList),
                    "ConnectedUser":            "12000",
                    "DelFlag":                  0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveJobProfileDegree', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.app.hideSpinner();
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.app.hideSpinner();
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        this.getJobProfileMain();
                        return false;
                    }
                });
            }
        }
    }


    //Function for add new desc row
    addDesc() {

        if (this.ddlDescription.toString().trim() == "" || this.ddlDescription == null ) {
            this.toastr.errorToastr('Please enter description', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{
            

            var desc = this.ddlDescription;
            var myDesc = Number(desc);

            if (!Number.isNaN(myDesc)){
                var duplicateChk = false;

                for (var i = 0; i < this.tempDescList.length; i++) {
                    if (this.tempDescList[i].rspnsbltyCd == this.ddlDescription) {
                        duplicateChk = true;
                    }
                }

                if (duplicateChk == true){
                    this.toastr.errorToastr('Description already added', 'Error', { toastTimeout: (2500) });
                    return false;
                }
                else{

                    var dataList = [];
                    dataList = this.descList.filter(x => x.value == this.ddlDescription);

                    this.tempDescList.push({
                        rspnsbltyCd: this.ddlDescription,
                        rspnsbltyDesc: dataList[0].label,
                        mndtryIndctr: false
                    });

                    this.ddlDescription = "";

                }

            }else{

                var duplicateChk = false;

                for (var i = 0; i < this.tempDescList.length; i++) {
                    if (this.tempDescList[i].rspnsbltyDesc.toUpperCase() == this.ddlDescription.trim().toUpperCase()) {
                        duplicateChk = true;
                    }
                }

                if (duplicateChk == true){
                    this.toastr.errorToastr('Description already added', 'Error', { toastTimeout: (2500) });
                    return false;
                }
                else{

                    var dataList = [];
                    dataList = this.descList.filter(x => x.label.toUpperCase() == this.ddlDescription.toUpperCase());
                    
                    if(dataList.length > 0){

                        this.tempDescList.push({
                            rspnsbltyCd: dataList[0].value,
                            rspnsbltyDesc: dataList[0].label,
                            mndtryIndctr: false
                        });

                    }else{

                        this.tempDescList.push({
                            rspnsbltyCd: 0,
                            rspnsbltyDesc: this.ddlDescription.trim(),
                            mndtryIndctr: false
                        });
                    }

                    this.ddlDescription = "";

                }
            }
        }
    }


    //Deleting description row
    removeDesc(item) {
        this.tempDescList.splice(item, 1);
    }


    //Function for add leave rule
    addLeaveRule() {

        if (this.ddlLeaveRule == "" || this.ddlLeaveRule == null ) {
            this.toastr.errorToastr('Please select leave rule', 'Error', { toastTimeout: (2500) });
            return false;
        }
        if (this.efectDate == "" || this.efectDate == null ) {
            this.toastr.errorToastr('Please enter effect date', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{
            
            //alert(this.efectDate);
            //return false;

            var duplicateChk = false;

            for (var i = 0; i < this.tempLeaveRulesList.length; i++) {
                if (this.tempLeaveRulesList[i].leaveRuleID == this.ddlLeaveRule) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true){
                this.toastr.errorToastr('Leave rule already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

                var dataList = [];
                dataList = this.leaveRulesList.filter(x => x.value == this.ddlLeaveRule);

                this.tempLeaveRulesList.push({
                    leaveRuleID: this.ddlLeaveRule,
                    leaveRuleTitle: dataList[0].label,
                    leaveLmtAmoUNt: dataList[0].limit,
                    effectiveDt: this.efectDate,
                    endDt: this.efectDate
                });

                this.ddlLeaveRule = "";
                this.efectDate = "";

            }
        }
    }


    //Deleting leave rule row
    removeLeaveRule(item) {
        this.tempLeaveRulesList.splice(item, 1);
    }


    //Function for add facility
    addFacility() {

        if (this.ddlFacilityType == "" || this.ddlFacilityType == null ) {
            this.toastr.errorToastr('Please select facility type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        if (this.ddlFacility == "" || this.ddlFacility == null ) {
            this.toastr.errorToastr('Please select facility', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{

            var duplicateChk = false;

            for (var i = 0; i < this.jobFacilityList.length; i++) {
                if (this.jobFacilityList[i].facilityTypeCd == this.ddlFacilityType && this.jobFacilityList[i].facilityID == this.ddlFacility) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true){
                this.toastr.errorToastr('Facility already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

                var dataList = [];
                dataList = this.facilityTypeList.filter(x => x.value == this.ddlFacilityType);
                
                var dataList1 = [];
                dataList1 = this.tempFacilityList.filter(x => x.value == this.ddlFacility);

                this.jobFacilityList.push({
                    facilityTypeCd: this.ddlFacilityType,
                    facilityID: this.ddlFacility,
                    facilityTypeName: dataList[0].label,
                    facilityName: dataList1[0].label,
                });

                this.ddlFacilityType = "";
                this.ddlFacility = "";
            }
        }
    }


    //Deleting facility row
    removeFacility(item) {
        this.jobFacilityList.splice(item, 1);
    }


    //function for save temp degrees
    addDegree(){


        if (this.ddlDegree == "" || this.ddlDegree == null ) {
            this.toastr.errorToastr('Please select degree', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.degreeReqLevel == null) {
            this.toastr.errorToastr('Please required level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.degreeReqLevel < 1 || this.degreeReqLevel > 99 ) {
            this.toastr.errorToastr('Invalid required level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.degreeMaxLelvel == null) {
            this.toastr.errorToastr('Please maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.degreeMaxLelvel < 1 || this.degreeMaxLelvel > 99 ) {
            this.toastr.errorToastr('Invalid maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.degreeMaxLelvel < this.degreeReqLevel ) {
            this.toastr.errorToastr('Invalid required level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{


            var duplicateDegreeChk = false;

            for (var i = 0; i < this.tempDegreeList.length; i++) {
                if (this.tempDegreeList[i].qlfctnCriteriaCD == this.QualificationCriteriaId) {
                    duplicateDegreeChk = true;
                }
            }

            if (duplicateDegreeChk == true){
                this.toastr.errorToastr('Degree already exist', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

                var perfIndctr;
                if(this.chkDegreePI == false)
                {
                    perfIndctr = 0;
                }
                else
                {
                    perfIndctr = 1;
                }


                this.tempDegreeList.push({
                    qlfctnRuleCriteriaCD: 0,
                    reqdQlfctnRuleNo: 0,
                    qlfctnCriteriaCD: this.QualificationCriteriaId,
                    qlfctnTypeCd: this.QualificationTypeId,
                    qlfctnCD: this.QualificationId,
                    qlfctnCriteriaReqdLvl: this.degreeReqLevel,
                    qlfctnCriteriaMaxLvl: this.degreeMaxLelvel,
                    prefIndctr: perfIndctr,
                    degreeLabel: this.Qualification
                });

                this.ddlDegree = "";
                this.degreeReqLevel = null;
                this.degreeMaxLelvel = null;
                this.chkDegreePI = false;

            }
            

        }

    }


    //Deleting degree row
    removeDegree(item) {
        this.tempDegreeList.splice(item, 1);
    }


    //function for save temp degrees
    addExperience(){

        if (this.ddlExperience == "" || this.ddlExperience == null ) {
            this.toastr.errorToastr('Please select experience title', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.experienceYear == null) {
            this.toastr.errorToastr('Please enter experience in year', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.experienceYear < 0 || this.experienceYear > 99 ) {
            this.toastr.errorToastr('Invalid experience in year', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.experienceMonth == null) {
            this.toastr.errorToastr('Please enter experience in month', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.experienceMonth < 0 || this.experienceMonth > 12 ) {
            this.toastr.errorToastr('Invalid experience in month', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{

            var perfIndctr;
            if(this.chkExperiencePI == false)
            {
                perfIndctr = 0;
            }
            else
            {
                perfIndctr = 1;
            }

            var duplicateChk = false;

            for (var i = 0; i < this.tempExperienceList.length; i++) {
                if (this.tempExperienceList[i].qlfctnCriteriaCD == this.ExperienceCriteriaId) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true){
                this.toastr.errorToastr('Experience title already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

                this.experienceInMonth = (this.experienceYear * 12) + this.experienceMonth;


                this.tempExperienceList.push({
                    qfctnRuleCriteriaCD:   0,
                    reqdQlfctnRuleNo:       0,
                    qlfctnCriteriaCD:       this.ExperienceCriteriaId,
                    qlfctnTypeCd:           this.ExperienceTypeId,
                    qlfctnCD:               this.ExperienceId,
                    qlfctnCriteriaReqdLvl:  this.experienceInMonth,
                    qlfctnCriteriaMaxLvl:   0,
                    prefIndctr:             perfIndctr,
                    degreeLabel:            this.Experience
                });

                this.ddlExperience = "";
                this.experienceYear = null;
                this.experienceMonth = null;
                this.chkExperiencePI = false;

            }   
        }
    }


    //Deleting experience row
    removeExperience(item) {
        this.tempExperienceList.splice(item, 1);
    }


    //function for save  temp skills
    addSkill(){

        if (this.ddlSkill == "" || this.ddlSkill == null ) {
            this.toastr.errorToastr('Please select skill title', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.skillLevel == 0) {
            this.toastr.errorToastr('Please add experties', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{

            var perfIndctr;
            if(this.chkSkillPI == false)
            {
                perfIndctr = 0;
            }
            else
            {
                perfIndctr = 1;
            }

            var duplicateChk = false;
            if(this.tempSkillList != undefined)
            {
                for (var i = 0; i < this.tempSkillList.length; i++) {
                    if (this.tempSkillList[i].qlfctnCriteriaCD == this.SkillCriteriaId) {
                        duplicateChk = true;
                    }
                }    
            }
    
            
            if (duplicateChk == true){
                this.toastr.errorToastr('Skill already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

                this.tempSkillList.push({
                    qfctnRuleCriteriaCD:   0,
                    reqdQlfctnRuleNo:       0,
                    qlfctnCriteriaCD:       this.SkillCriteriaId,
                    qlfctnTypeCd:           this.SkillTypeId,
                    qlfctnCD:               this.SkillId,
                    qlfctnCriteriaReqdLvl:  this.skillLevel,
                    qlfctnCriteriaMaxLvl:   0,
                    prefIndctr:             perfIndctr,
                    degreeLabel:            this.Skill
                });

                this.ddlSkill = "";
                this.skillLevel = 0;
                this.chkSkillPI = false;

            }   
        }
    }


    //Deleting experience row
    removeSkill(item) {
        this.tempSkillList.splice(item, 1);
    }


    //function for save temp degrees
    addCertificate(){


        if (this.ddlCertificate == "" || this.ddlCertificate == null ) {
            this.toastr.errorToastr('Please select certificate', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.certificateReqLevel == null) {
            this.toastr.errorToastr('Please enter required level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.certificateReqLevel < 1 || this.certificateReqLevel > 99 ) {
            this.toastr.errorToastr('Invalid required level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.certificateMaxLelvel == null) {
            this.toastr.errorToastr('Please enter maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.certificateMaxLelvel < 1 || this.certificateMaxLelvel > 99 ) {
            this.toastr.errorToastr('Invalid maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.certificateMaxLelvel < this.certificateReqLevel ) {
            this.toastr.errorToastr('Invalid required level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{

            var perfIndctr;
            if(this.chkCertificatePI == false)
            {
                perfIndctr = 0;
            }
            else
            {
                perfIndctr = 1;
            }

            var duplicateChk = false;

            for (var i = 0; i < this.tempCertificateList.length; i++) {
                if (this.tempCertificateList[i].qlfctnCriteriaCD == this.CertificateCriteriaId) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true){
                this.toastr.errorToastr('Certificate already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

                this.tempCertificateList.push({
                    qlfctnRuleCriteriaCD:   0,
                    reqdQlfctnRuleNo:       0,
                    qlfctnCriteriaCD:       this.CertificateCriteriaId,
                    qlfctnTypeCd:           this.CertificateTypeId,
                    qlfctnCD:               this.CertificateId,
                    qlfctnCriteriaReqdLvl:  this.certificateReqLevel,
                    qlfctnCriteriaMaxLvl:   this.certificateMaxLelvel,
                    prefIndctr:             perfIndctr,
                    degreeLabel:            this.Certificate
                });

                this.ddlCertificate = "";
                this.certificateMaxLelvel = null;
                this.certificateReqLevel = null;
                this.chkCertificatePI = false;

            }   
        }
    }


    //Deleting certificate row
    removeCertificate(item) {
        this.tempCertificateList.splice(item, 1);
    }


    
    //function for get filtere list from job post
    getFilterItem(filterOption) {
        
        // if(this.jobTitle != null){
        //     alert(this.jobTitle);
        // }
        
        var dataList = [];
        
        //filter for job post
        if(filterOption == "jobs"){

            dataList = this.tempJobsList.filter(x => x.jobDesigID == this.jobTitle);
        
            this.DesigId = dataList[0].jobDesigID;
            this.DeptId = dataList[0].jobPostDeptCd;
            this.LocationId = dataList[0].jobPostLocationCd;
            this.lblBPS = dataList[0].payGradeName;
            this.lblJobType = dataList[0].jobTypeName;

        }


        if(filterOption == "degree"){

            dataList = this.tempQualificationCriteriaList.filter(x => x.qlfctnCriteriaCd == this.ddlDegree);
            
            this.Qualification = dataList[0].qlfctnCriteriaName;
            this.QualificationId = dataList[0].qlfctnCd;
            this.QualificationTypeId = dataList[0].qlfctnTypeCd;
            this.QualificationCriteriaId = dataList[0].qlfctnCriteriaCd;

        }

        if(filterOption == "certificate"){

            dataList = this.tempQualificationCriteriaList.filter(x => x.qlfctnCriteriaCd == this.ddlCertificate);
            
            this.Certificate = dataList[0].qlfctnCriteriaName;
            this.CertificateId = dataList[0].qlfctnCd;
            this.CertificateTypeId = dataList[0].qlfctnTypeCd;
            this.CertificateCriteriaId = dataList[0].qlfctnCriteriaCd;

        }

        if(filterOption == "experience"){

            dataList = this.tempQualificationCriteriaList.filter(x => x.qlfctnCriteriaCd == this.ddlExperience);
            
            this.Experience = dataList[0].qlfctnCriteriaName;
            this.ExperienceId = dataList[0].qlfctnCd;
            this.ExperienceTypeId = dataList[0].qlfctnTypeCd;
            this.ExperienceCriteriaId = dataList[0].qlfctnCriteriaCd;

        }

        if(filterOption == "skill"){

            dataList = this.tempQualificationCriteriaList.filter(x => x.qlfctnCriteriaCd == this.ddlSkill);
            
            this.Skill = dataList[0].qlfctnCriteriaName;
            this.SkillId = dataList[0].qlfctnCd;
            this.SkillTypeId = dataList[0].qlfctnTypeCd;
            this.SkillCriteriaId = dataList[0].qlfctnCriteriaCd;

        }

        if(filterOption == "facility"){

            this.tempFacilityList = [];
            this.ddlFacility = "";

            dataList = this.facilityList.filter(x => x.facilityTypeCd == this.ddlFacilityType);
            for (var i = 0; i < dataList.length; i++) {
                this.tempFacilityList.push({
                    label: dataList[i].facilityName,
                    value: dataList[i].facilityID
                });
            }
        }
    }



    //functions for delete entry
    deleteTemp(item) {
        this.clear();
        this.DesigId = item.jobDesigID;
        this.DeptId = item.jobPostDeptCd;
        this.LocationId = item.jobPostLocationCd;
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
        else if (this.DesigId == 0 || this.DeptId == 0 || this.LocationId == 0) {
            this.toastr.errorToastr('Invalid delete request', 'Error', { toastTimeout: (2500) });
            return false
        }
        else {

            //this.app.showSpinner();
            // this.app.hideSpinner();

            //* ********************************************update data 
            var updateData = {
                "jobProfileID":             1,
                "JobDesigID":               this.DesigId,
                "JobPostDeptCd":            this.DeptId,
                "JobPostLocationCd":        this.LocationId,
                "jobQualificationList":     JSON.stringify(this.tempDegreeList),
                "jobCertificationList":     JSON.stringify(this.tempCertificateList),
                "jobExperienceList":        JSON.stringify(this.tempExperienceList),
                "jobDescriptionList":       JSON.stringify(this.tempDescList),
                "jobLeaveRuleList":          JSON.stringify(this.tempLeaveRulesList),
                "jobFacilityList":          JSON.stringify(this.jobFacilityList),
                "ConnectedUser": "12000",
                "DelFlag": 1
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/saveJobProfileDegree', updateData, { headers: reqHeader }).subscribe((data: any) => {

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



    //function for sort table data 
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }

}
