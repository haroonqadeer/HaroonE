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
    selector: 'app-jobprofile',
    templateUrl: './jobprofile.component.html',
    styleUrls: ['./jobprofile.component.scss']
})
export class JobprofileComponent implements OnInit {

    //serverUrl = "http://192.168.200.19:3009/";
    // <<<<<<< HEAD
    //serverUrl = "http://localhost:47807/";
    serverUrl = "https://localhost:3003";
    // =======
    //serverUrl = "http://localhost:47807/";
    // >>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    //*Bolean variable 
    updateFlag = false;

    //* Excel Data List
    excelDataList = [];
    jobProfileListDetails = [
        {
            srNo: 1,
            officeName: 'Head Quarter',
            department: 'Finance',
            section: 'BK&C',
            jobTitle: 'AD',
            jobType: 'Regular',
            quantity: '1',
            education: 'ACCA',
            experience: '5 Years'
        },
        {
            srNo: 2,
            officeName: 'Lahore Branch',
            department: 'Finance',
            section: 'BK&C',
            jobTitle: 'AD',
            jobType: 'Regular',
            quantity: '1',
            education: 'ACCA',
            experience: '5 Years'
        },
        {
            srNo: 3,
            officeName: 'Karachi Branch',
            department: 'Finance',
            section: 'BK&C',
            jobTitle: 'AD',
            jobType: 'Regular',
            quantity: '1',
            education: 'ACCA',
            experience: '5 Years'
        }
    ];


    jobsList = [];
    //<<<<<<< HEAD

    //=======
    jobProfilesList = [];

    //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
    certificateList = [];
    degreeList = [];
    experienceList = [];
    descList = [];
    leaveRulesList = [];
    jobFacilityList = [];
    facilityTypeList = [];
    facilityList = [];


    tempJobsList = [];
    tempQualificationCriteriaList = [];
    tempDegreeList = [];
    tempCertificateList = [];
    tempExperienceList = [];
    tempDescList = [];
    tempLeaveRulesList = [];
    tempFacilityList = [];



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


    //* Variables for NgModels
    tblSearch = "";

    jobProfileId = "";

    //*step 1 ng models
    jobTitle = "";

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
    ddlSkill = "";
    ddlExperience = "";
    chkExperiencePI = false;
    experienceInMonth = 0;
    experienceYear = null;
    experienceMonth = null;


    //* step 5 ng models 
    ddlDescription = "";



    //* step 6 ng models 
    ddlLeaveRule = "";
    efectDate = "";



    //* step 7 ng models 
    ddlFacilityType = "";
    ddlFacility = "";


    txtdPassword = '';
    txtdPin = '';

    //<<<<<<< HEAD




    //    show = false;
    //=======
    show = false;
    //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9

    formGroup1: FormGroup;
    formGroup2: FormGroup;
    formGroup3: FormGroup;
    formGroup4: FormGroup;
    formGroup5: FormGroup;
    formGroup6: FormGroup;
    formGroup7: FormGroup;


    searchDegree = '';
    searchcertification = '';


    constructor(private _formBuilder: FormBuilder,
        public toastr: ToastrManager,
        private app: AppComponent,
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService,
        private http: HttpClient) { }

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

    @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel


    steperSetting() {
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

    }

    //function for get all saved job posts 
    getJobPosts() {
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

        });

    }


    //function for get all saved job descriptions 
    getJobDesc() {
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

        });

    }


    //function for get all saved leave rules 
    getLeaveRules() {
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
        });
    }


    //function for get all saved facility types 
    getFacilityType() {
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
        });
    }

    //function for get all saved facility  
    getFacility() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getFacility', { headers: reqHeader }).subscribe((data: any) => {

            this.facilityList = data;

        });
    }


    //function for get all saved degrees, certificate and skills 
    getQualificationCriteria() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getQualificationCriteria', { headers: reqHeader }).subscribe((data: any) => {

            this.tempQualificationCriteriaList = data;

            for (var i = 0; i < data.length; i++) {

                //geting degree 
                if (data[i].qlfctnTypeName == 'Degree') {
                    this.degreeList.push({
                        label: data[i].qlfctnName + " - " + data[i].qlfctnCriteriaName,
                        value: data[i].qlfctnCriteriaCd,
                    });
                }

                //getting certificate
                if (data[i].qlfctnTypeName == 'Certificate') {
                    this.certificateList.push({
                        label: data[i].qlfctnName + " - " + data[i].qlfctnCriteriaName,
                        value: data[i].qlfctnCriteriaCd,
                    });
                }

                //getting skills
                //<<<<<<< HEAD
                if (data[i].qlfctnTypeName == 'Skills') {
                    //=======
                    if (data[i].qlfctnTypeName == 'Experience') {
                        //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
                        this.experienceList.push({
                            label: data[i].qlfctnName + " - " + data[i].qlfctnCriteriaName,
                            value: data[i].qlfctnCriteriaCd,
                        });
                    }

                }

            }
        });
    }

    //<<<<<<< HEAD
    onTypeChange(item) {

        if (item.label == 'Contract') {
            this.show = true;
        } else {
            this.show = false;
        }
    }

    //clear() {}
    //======

    //function for get all saved job profiles 
    getJobProfileMain() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getJobProfileMain', { headers: reqHeader }).subscribe((data: any) => {

            this.jobProfilesList = data;

        });

    }

    //Function for save and update leave nature 
    getSpecificJobProfile() {

        if (this.DesigId == 0 || this.DeptId == 0 || this.LocationId == 0) {
            this.toastr.errorToastr('Invalid Request', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            //* ********************************************save data 
            var reqData = {
                "JobDesigID": this.DesigId,
                "JobPostDeptCd": this.DeptId,
                "JobPostLocationCd": this.LocationId,
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/getSpecificJobProfile', reqData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Done") {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {

                    this.tempDegreeList = data.degreeList;
                    this.tempCertificateList = data.certificateList;
                    this.tempExperienceList = data.experienceList;
                    this.tempDescList = data.descList;
                    this.tempLeaveRulesList = data.leaveRuleList;
                    this.jobFacilityList = data.facilityList;

                }
            });
        }
    }


    //function for empay all fields
    clear() {

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
        //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9

    }


    //function for edit record
    edit(item) {

        this.clear();

        this.jobProfileId = "1";

        this.DesigId = item.jobDesigID;
        this.DeptId = item.jobPostDeptCd;
        this.LocationId = item.jobPostLocationCd;
        this.lblBPS = item.payGradeName;
        this.lblJobType = item.jobTypeName;
        this.editFlag = true;

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
        else if (this.tempDegreeList.length == 0) {
            this.toastr.errorToastr('Please enter qualifiation detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        //<<<<<<< HEAD
        else if (this.tempCertificateList.length == 0) {
            this.toastr.errorToastr('Please enter certification detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        //else if (this.tempExperienceList.length == 0) {
        //=======
        // else if (this.tempCertificateList.length == 0 ) {
        //     this.toastr.errorToastr('Please enter certification detail', 'Error', { toastTimeout: (2500) });
        //     return false;
        // }
        else if (this.tempExperienceList.length == 0) {
            //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
            this.toastr.errorToastr('Please enter experience detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.tempDescList.length == 0) {
            this.toastr.errorToastr('Please enter job description detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        //<<<<<<< HEAD
        //        else if (this.jobFacilityList.length == 0) {
        //=======
        else if (this.tempLeaveRulesList.length == 0) {
            this.toastr.errorToastr('Please enter leave rules detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.jobFacilityList.length == 0) {
            //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
            this.toastr.errorToastr('Please enter facilities detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            // alert('ok');
            // return false; 

            if (this.jobProfileId != '') {

                // //this.app.showSpinner();
                // // this.app.hideSpinner();
                //* ********************************************update data 
                var updateData = {
                    "jobProfileID": 1,
                    "JobDesigID": this.DesigId,
                    "JobPostDeptCd": this.DeptId,
                    "JobPostLocationCd": this.LocationId,
                    "jobQualificationList": JSON.stringify(this.tempDegreeList),
                    "jobCertificationList": JSON.stringify(this.tempCertificateList),
                    "jobExperienceList": JSON.stringify(this.tempExperienceList),
                    "jobDescriptionList": JSON.stringify(this.tempDescList),
                    "jobLeaveRuleList": JSON.stringify(this.tempLeaveRulesList),
                    "jobFacilityList": JSON.stringify(this.jobFacilityList),
                    "ConnectedUser": "12000",
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token 

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveJobProfileDegree', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Updated Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                        this.getJobProfileMain();
                        return false;
                    }
                });

            }
            else {

                //* ********************************************save data 
                var saveData = {
                    "jobProfileID": 0,
                    "JobDesigID": this.DesigId,
                    "JobPostDeptCd": this.DeptId,
                    "JobPostLocationCd": this.LocationId,
                    "jobQualificationList": JSON.stringify(this.tempDegreeList),
                    "jobCertificationList": JSON.stringify(this.tempCertificateList),
                    "jobExperienceList": JSON.stringify(this.tempExperienceList),
                    "jobDescriptionList": JSON.stringify(this.tempDescList),
                    "jobLeaveRuleList": JSON.stringify(this.tempLeaveRulesList),
                    "jobFacilityList": JSON.stringify(this.jobFacilityList),
                    "ConnectedUser": "12000",
                    "DelFlag": 0
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/saveJobProfileDegree', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Record Saved Successfully!") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
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

        if (this.ddlDescription.toString().trim() == "" || this.ddlDescription == null) {
            this.toastr.errorToastr('Please enter description', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {


            var desc = this.ddlDescription;
            var myDesc = Number(desc);

            //<<<<<<< HEAD
            //            if (!Number.isNaN(myDesc)) {

            //=======
            if (!Number.isNaN(myDesc)) {
                //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
                var duplicateChk = false;

                for (var i = 0; i < this.tempDescList.length; i++) {
                    if (this.tempDescList[i].rspnsbltyCd == this.ddlDescription) {
                        duplicateChk = true;
                    }
                }

                if (duplicateChk == true) {
                    this.toastr.errorToastr('Description already added', 'Error', { toastTimeout: (2500) });
                    return false;
                }
                else {

                    var dataList = [];
                    dataList = this.descList.filter(x => x.value == this.ddlDescription);

                    this.tempDescList.push({
                        rspnsbltyCd: this.ddlDescription,
                        rspnsbltyDesc: dataList[0].label,
                        mndtryIndctr: false
                    });

                }

            } else {

                var duplicateChk = false;

                for (var i = 0; i < this.tempDescList.length; i++) {
                    //<<<<<<< HEAD
                    //if (this.tempDescList[i].RspnsbltyDesc == this.ddlDescription) {
                    //=======
                    if (this.tempDescList[i].rspnsbltyDesc.toUpperCase() == this.ddlDescription.trim().toUpperCase()) {
                        //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
                        duplicateChk = true;
                    }
                }

                if (duplicateChk == true) {
                    this.toastr.errorToastr('Description already added', 'Error', { toastTimeout: (2500) });
                    return false;
                }
                else {

                    var dataList = [];
                    dataList = this.descList.filter(x => x.label == this.ddlDescription);

                    if (dataList.length > 0) {

                        this.tempDescList.push({
                            rspnsbltyCd: dataList[0].value,
                            rspnsbltyDesc: dataList[0].label,
                            mndtryIndctr: false
                        });

                    } else {

                        this.tempDescList.push({
                            //<<<<<<< HEAD
                            // RspnsbltyCd: 0,
                            // RspnsbltyDesc: this.ddlDescription.trim(),
                            // MndtryIndctr: false
                            //=======
                            rspnsbltyCd: 0,
                            rspnsbltyDesc: this.ddlDescription.trim(),
                            mndtryIndctr: false
                            //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
                        });
                    }
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

        if (this.ddlLeaveRule == "" || this.ddlLeaveRule == null) {
            this.toastr.errorToastr('Please select leave rule', 'Error', { toastTimeout: (2500) });
            return false;
        }
        if (this.efectDate == "" || this.efectDate == null) {
            this.toastr.errorToastr('Please enter effect date', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            //alert(this.efectDate);
            //return false;

            var duplicateChk = false;

            for (var i = 0; i < this.tempLeaveRulesList.length; i++) {
                if (this.tempLeaveRulesList[i].leaveRuleID == this.ddlLeaveRule) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true) {
                this.toastr.errorToastr('Leave rule already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

                var dataList = [];
                dataList = this.leaveRulesList.filter(x => x.value == this.ddlLeaveRule);

                this.tempLeaveRulesList.push({
                    leaveRuleID: this.ddlLeaveRule,
                    leaveRuleTitle: dataList[0].label,
                    leaveLmtAmoUNt: dataList[0].limit,
                    effectiveDt: this.efectDate,
                    endDt: this.efectDate
                });
            }
        }
    }


    //Deleting leave rule row
    removeLeaveRule(item) {
        this.tempLeaveRulesList.splice(item, 1);
    }


    //Function for add facility
    addFacility() {

        if (this.ddlFacilityType == "" || this.ddlFacilityType == null) {
            this.toastr.errorToastr('Please select facility type', 'Error', { toastTimeout: (2500) });
            return false;
        }
        if (this.ddlFacility == "" || this.ddlFacility == null) {
            this.toastr.errorToastr('Please select facility', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            var duplicateChk = false;

            for (var i = 0; i < this.jobFacilityList.length; i++) {
                if (this.jobFacilityList[i].facilityTypeCd == this.ddlFacilityType && this.jobFacilityList[i].facilityID == this.ddlFacility) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true) {
                this.toastr.errorToastr('Facility already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

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
            }
        }
    }


    //Deleting facility row
    removeFacility(item) {
        this.jobFacilityList.splice(item, 1);
    }


    //function for save temp degrees
    addDegree() {


        if (this.ddlDegree == "" || this.ddlDegree == null) {
            this.toastr.errorToastr('Please select degree', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.degreeReqLevel == null) {
            this.toastr.errorToastr('Please required level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.degreeReqLevel < 1 || this.degreeReqLevel > 99) {
            this.toastr.errorToastr('Invalid required level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.degreeMaxLelvel == null) {
            this.toastr.errorToastr('Please maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.degreeMaxLelvel < 1 || this.degreeMaxLelvel > 99) {
            this.toastr.errorToastr('Invalid maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.degreeMaxLelvel < this.degreeReqLevel) {
            this.toastr.errorToastr('Invalid maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {


            var duplicateDegreeChk = false;

            for (var i = 0; i < this.tempDegreeList.length; i++) {
                if (this.tempDegreeList[i].qlfctnCriteriaCD == this.QualificationCriteriaId) {
                    duplicateDegreeChk = true;
                }
            }

            if (duplicateDegreeChk == true) {
                this.toastr.errorToastr('Degree already exist', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

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

            }


        }

    }


    //Deleting degree row
    removeDegree(item) {
        this.tempDegreeList.splice(item, 1);
    }


    //function for save temp degrees
    addExperience() {

        if (this.ddlExperience == "" || this.ddlExperience == null) {
            this.toastr.errorToastr('Please select experience title', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.experienceYear == null) {
            this.toastr.errorToastr('Please enter experience in year', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.experienceYear < 0 || this.experienceYear > 99) {
            this.toastr.errorToastr('Invalid experience in year', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.experienceMonth == null) {
            this.toastr.errorToastr('Please enter experience in month', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.experienceMonth < 0 || this.experienceMonth > 12) {
            this.toastr.errorToastr('Invalid experience in month', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

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

            if (duplicateChk == true) {
                this.toastr.errorToastr('Experience title already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

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
            }
        }
    }


    //Deleting experience row
    removeExperience(item) {
        this.tempExperienceList.splice(item, 1);
    }


    //function for save temp degrees
    addCertificate() {


        if (this.ddlCertificate == "" || this.ddlCertificate == null) {
            this.toastr.errorToastr('Please select certificate', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.certificateReqLevel == null) {
            this.toastr.errorToastr('Please enter required level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.certificateReqLevel < 1 || this.certificateReqLevel > 99) {
            this.toastr.errorToastr('Invalid required level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.certificateMaxLelvel == null) {
            this.toastr.errorToastr('Please enter maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.certificateMaxLelvel < 1 || this.certificateMaxLelvel > 99) {
            this.toastr.errorToastr('Invalid maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.certificateMaxLelvel < this.certificateReqLevel) {
            this.toastr.errorToastr('Invalid maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

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

            if (duplicateChk == true) {
                this.toastr.errorToastr('Certificate already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

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
        if (filterOption == "jobs") {

            dataList = this.tempJobsList.filter(x => x.jobDesigID == this.jobTitle);

            this.DesigId = dataList[0].jobDesigID;
            this.DeptId = dataList[0].jobPostDeptCd;
            this.LocationId = dataList[0].jobPostLocationCd;
            this.lblBPS = dataList[0].payGradeName;
            this.lblJobType = dataList[0].jobTypeName;

        }


        if (filterOption == "degree") {

            dataList = this.tempQualificationCriteriaList.filter(x => x.qlfctnCriteriaCd == this.ddlDegree);

            this.Qualification = dataList[0].qlfctnCriteriaName;
            this.QualificationId = dataList[0].qlfctnCd;
            this.QualificationTypeId = dataList[0].qlfctnTypeCd;
            this.QualificationCriteriaId = dataList[0].qlfctnCriteriaCd;

        }

        if (filterOption == "certificate") {

            dataList = this.tempQualificationCriteriaList.filter(x => x.qlfctnCriteriaCd == this.ddlCertificate);

            this.Certificate = dataList[0].qlfctnCriteriaName;
            this.CertificateId = dataList[0].qlfctnCd;
            this.CertificateTypeId = dataList[0].qlfctnTypeCd;
            this.CertificateCriteriaId = dataList[0].qlfctnCriteriaCd;

        }

        if (filterOption == "experience") {

            dataList = this.tempQualificationCriteriaList.filter(x => x.qlfctnCriteriaCd == this.ddlExperience);

            this.Experience = dataList[0].qlfctnCriteriaName;
            this.ExperienceId = dataList[0].qlfctnCd;
            this.ExperienceTypeId = dataList[0].qlfctnTypeCd;
            this.ExperienceCriteriaId = dataList[0].qlfctnCriteriaCd;

        }


        if (filterOption == "facility") {

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
                "jobProfileID": 1,
                "JobDesigID": this.DesigId,
                "JobPostDeptCd": this.DeptId,
                "JobPostLocationCd": this.LocationId,
                "jobQualificationList": JSON.stringify(this.tempDegreeList),
                "jobCertificationList": JSON.stringify(this.tempCertificateList),
                "jobExperienceList": JSON.stringify(this.tempExperienceList),
                "jobDescriptionList": JSON.stringify(this.tempDescList),
                "jobLeaveRuleList": JSON.stringify(this.tempLeaveRulesList),
                "jobFacilityList": JSON.stringify(this.jobFacilityList),
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
            //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
        }
    }


    //<<<<<<< HEAD

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
        alert('CSV works ' + this.jobProfilesList.length);
        // case 1: When tblSearch is empty then assign full data list
        if (this.tblSearch == "") {
            var completeDataList = [];
            for (var i = 0; i < this.jobProfilesList.length; i++) {
                //alert(this.tblSearch + " - " + this.skillCriteriaList[i].departmentName)
                completeDataList.push({
                    OfficeName: this.jobProfilesList[i].locationName,
                    Department: this.jobProfilesList[i].deptName,
                    JobTitle: this.jobProfilesList[i].jobDesigName,
                    JobType: this.jobProfilesList[i].jobTypeName,
                    Qty: this.jobProfilesList[i].quantity,
                    Education: this.jobProfilesList[i].degree,
                    Experience: this.jobProfilesList[i].experience
                });
            }
            this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("jobProfileCompleteCSV", CsvFileTypes.CSV));
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.tblSearch != "") {
            var filteredDataList = [];
            for (var i = 0; i < this.jobProfilesList.length; i++) {
                if (this.jobProfilesList[i].officeName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.jobProfilesList[i].department.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.jobProfilesList[i].jobTitle.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.jobProfilesList[i].jobType.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.jobProfilesList[i].education.toUpperCase().includes(this.tblSearch.toUpperCase())) {
                    filteredDataList.push({
                        OfficeName: this.jobProfilesList[i].locationName,
                        Department: this.jobProfilesList[i].deptName,
                        JobTitle: this.jobProfilesList[i].jobDesigName,
                        JobType: this.jobProfilesList[i].jobTypeName,
                        Qty: this.jobProfilesList[i].quantity,
                        Education: this.jobProfilesList[i].degree,
                        Experience: this.jobProfilesList[i].experience
                    });
                }
            }

            if (filteredDataList.length > 0) {
                this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("jobProfileFilterCSV", CsvFileTypes.CSV));
            } else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
            //=======
            //functions for delete entry
            // deleteTemp(item) {
            //     this.clear();
            //     this.DesigId = item.jobDesigID;
            //     this.DeptId = item.jobPostDeptCd;
            //     this.LocationId = item.jobPostLocationCd;
            // }



            //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
        }
    }

    //<<<<<<< HEAD
    downloadExcel() {
        //alert('Excel works');
        // case 1: When tblSearch is empty then assign full data list
        if (this.tblSearch == "") {
            //var completeDataList = [];
            for (var i = 0; i < this.jobProfilesList.length; i++) {
                this.excelDataList.push({
                    OfficeName: this.jobProfilesList[i].locationName,
                    Department: this.jobProfilesList[i].deptName,
                    JobTitle: this.jobProfilesList[i].jobDesigName,
                    JobType: this.jobProfilesList[i].jobTypeName,
                    Qty: this.jobProfilesList[i].quantity,
                    Education: this.jobProfilesList[i].degree,
                    Experience: this.jobProfilesList[i].experience
                });
            }
            this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("jobProfileCompleteExcel"));
            this.excelDataList = [];
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.tblSearch != "") {
            for (var i = 0; i < this.jobProfilesList.length; i++) {
                if (this.jobProfilesList[i].officeName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.jobProfilesList[i].department.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.jobProfilesList[i].jobTitle.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.jobProfilesList[i].jobType.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.jobProfilesList[i].education.toUpperCase().includes(this.tblSearch.toUpperCase())) {
                    this.excelDataList.push({
                        OfficeName: this.jobProfilesList[i].locationName,
                        Department: this.jobProfilesList[i].deptName,
                        JobTitle: this.jobProfilesList[i].jobDesigName,
                        JobType: this.jobProfilesList[i].jobTypeName,
                        Qty: this.jobProfilesList[i].quantity,
                        Education: this.jobProfilesList[i].degree,
                        Experience: this.jobProfilesList[i].experience
                    });
                }
            }

            if (this.excelDataList.length > 0) {
                //alert("Filter List " + this.excelDataList.length);

                this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("jobProfileFilterExcel"));
                this.excelDataList = [];
            }
            else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
        }
    }



    //=======

    //function for sort table data 
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }
}
