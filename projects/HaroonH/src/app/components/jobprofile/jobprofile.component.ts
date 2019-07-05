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
    //serverUrl = "http://localhost:47807/";
    serverUrl = "https://localhost:3003";
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





    show = false;

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
                if (data[i].qlfctnTypeName == 'Skills') {
                    this.experienceList.push({
                        label: data[i].qlfctnName + " - " + data[i].qlfctnCriteriaName,
                        value: data[i].qlfctnCriteriaCd,
                    });
                }

            }

        });

    }

    onTypeChange(item) {

        if (item.label == 'Contract') {
            this.show = true;
        } else {
            this.show = false;
        }
    }

    clear() {

    }

    //Function for save and update leave nature 
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
        else if (this.tempCertificateList.length == 0) {
            this.toastr.errorToastr('Please enter certification detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.tempExperienceList.length == 0) {
            this.toastr.errorToastr('Please enter experience detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.tempDescList.length == 0) {
            this.toastr.errorToastr('Please enter job description detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.jobFacilityList.length == 0) {
            this.toastr.errorToastr('Please enter facilities detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            // alert('ok');
            // return false; 

            if (this.jobProfileId != '') {

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
                        this.getJobDesc();
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

            if (!Number.isNaN(myDesc)) {

                var duplicateChk = false;

                for (var i = 0; i < this.tempDescList.length; i++) {
                    if (this.tempDescList[i].RspnsbltyCd == this.ddlDescription) {
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
                        RspnsbltyCd: this.ddlDescription,
                        RspnsbltyDesc: dataList[0].label,
                        MndtryIndctr: false
                    });

                }

            } else {

                var duplicateChk = false;

                for (var i = 0; i < this.tempDescList.length; i++) {
                    if (this.tempDescList[i].RspnsbltyDesc == this.ddlDescription) {
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
                            RspnsbltyCd: dataList[0].value,
                            RspnsbltyDesc: dataList[0].label,
                            MndtryIndctr: false
                        });

                    } else {

                        this.tempDescList.push({
                            RspnsbltyCd: 0,
                            RspnsbltyDesc: this.ddlDescription.trim(),
                            MndtryIndctr: false
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
                if (this.tempLeaveRulesList[i].LeaveRuleID == this.ddlLeaveRule) {
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
                    LeaveRuleID: this.ddlLeaveRule,
                    LeaveRuleTitle: dataList[0].label,
                    LeaveLmtAmount: dataList[0].limit,
                    EffectiveDt: this.efectDate,
                    EndDt: this.efectDate
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
                if (this.jobFacilityList[i].FacilityTypeCd == this.ddlFacilityType && this.jobFacilityList[i].FacilityID == this.ddlFacility) {
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
                    FacilityTypeCd: this.ddlFacilityType,
                    FacilityID: this.ddlFacility,
                    FacilityTypeTitle: dataList[0].label,
                    FacilityTitle: dataList1[0].label,
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
                if (this.tempDegreeList[i].QlfctnCriteriaCD == this.QualificationCriteriaId) {
                    duplicateDegreeChk = true;
                }
            }

            if (duplicateDegreeChk == true) {
                this.toastr.errorToastr('Degree already exist', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

                this.tempDegreeList.push({
                    QlfctnRuleCriteriaCD: 0,
                    ReqdQlfctnRuleNo: 0,
                    QlfctnCriteriaCD: this.QualificationCriteriaId,
                    QlfctnTypeCd: this.QualificationTypeId,
                    QlfctnCD: this.QualificationId,
                    QlfctnCriteriaReqdLvl: this.degreeReqLevel,
                    QlfctnCriteriaMaxLvl: this.degreeMaxLelvel,
                    PrefIndctr: this.chkDegreePI,
                    DegreeLabel: this.Qualification
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


            var duplicateChk = false;

            for (var i = 0; i < this.tempExperienceList.length; i++) {
                if (this.tempExperienceList[i].QlfctnCriteriaCD == this.ExperienceCriteriaId) {
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
                    QlfctnRuleCriteriaCD: 0,
                    ReqdQlfctnRuleNo: 0,
                    QlfctnCriteriaCD: this.ExperienceCriteriaId,
                    QlfctnTypeCd: this.ExperienceTypeId,
                    QlfctnCD: this.ExperienceId,
                    QlfctnCriteriaReqdLvl: this.experienceInMonth,
                    QlfctnCriteriaMaxLvl: 0,
                    PrefIndctr: this.chkExperiencePI,
                    ExperienceLabel: this.Experience
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


            var duplicateChk = false;

            for (var i = 0; i < this.tempCertificateList.length; i++) {
                if (this.tempCertificateList[i].QlfctnCriteriaCD == this.CertificateCriteriaId) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true) {
                this.toastr.errorToastr('Certificate already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

                this.tempCertificateList.push({
                    QlfctnRuleCriteriaCD: 0,
                    ReqdQlfctnRuleNo: 0,
                    QlfctnCriteriaCD: this.CertificateCriteriaId,
                    QlfctnTypeCd: this.CertificateTypeId,
                    QlfctnCD: this.CertificateId,
                    QlfctnCriteriaReqdLvl: this.certificateReqLevel,
                    QlfctnCriteriaMaxLvl: this.certificateMaxLelvel,
                    PrefIndctr: this.chkCertificatePI,
                    DegreeLabel: this.Certificate
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

            dataList = this.facilityList.filter(x => x.facilityTypeCd == this.ddlFacilityType);
            for (var i = 0; i < dataList.length; i++) {
                this.tempFacilityList.push({
                    label: dataList[i].facilityName,
                    value: dataList[i].facilityID
                });
            }
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


    downloadPDF() { }


    downloadCSV() {
        alert('CSV works ' + this.jobProfileListDetails.length);
        // case 1: When tblSearch is empty then assign full data list
        if (this.tblSearch == "") {
            var completeDataList = [];
            for (var i = 0; i < this.jobProfileListDetails.length; i++) {
                //alert(this.tblSearch + " - " + this.skillCriteriaList[i].departmentName)
                completeDataList.push({
                    OfficeName: this.jobProfileListDetails[i].officeName,
                    Department: this.jobProfileListDetails[i].department,
                    Section: this.jobProfileListDetails[i].section,
                    JobTitle: this.jobProfileListDetails[i].jobTitle,
                    JobType: this.jobProfileListDetails[i].jobType,
                    Qty: this.jobProfileListDetails[i].quantity,
                    Education: this.jobProfileListDetails[i].education,
                    Experience: this.jobProfileListDetails[i].experience
                });
            }
            this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("jobProfileCompleteCSV", CsvFileTypes.CSV));
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.tblSearch != "") {
            var filteredDataList = [];
            for (var i = 0; i < this.jobProfileListDetails.length; i++) {
                if (this.jobProfileListDetails[i].officeName.includes(this.tblSearch) ||
                    this.jobProfileListDetails[i].department.includes(this.tblSearch) ||
                    this.jobProfileListDetails[i].section.includes(this.tblSearch) ||
                    this.jobProfileListDetails[i].jobTitle.includes(this.tblSearch) ||
                    this.jobProfileListDetails[i].jobType.includes(this.tblSearch) ||
                    this.jobProfileListDetails[i].education.includes(this.tblSearch)) {
                    filteredDataList.push({
                        OfficeName: this.jobProfileListDetails[i].officeName,
                        Department: this.jobProfileListDetails[i].department,
                        Section: this.jobProfileListDetails[i].section,
                        JobTitle: this.jobProfileListDetails[i].jobTitle,
                        JobType: this.jobProfileListDetails[i].jobType,
                        Qty: this.jobProfileListDetails[i].quantity,
                        Education: this.jobProfileListDetails[i].education,
                        Experience: this.jobProfileListDetails[i].experience
                    });
                }
            }

            if (filteredDataList.length > 0) {
                this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("jobProfileFilterCSV", CsvFileTypes.CSV));
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
            for (var i = 0; i < this.jobProfileListDetails.length; i++) {
                this.excelDataList.push({
                    OfficeName: this.jobProfileListDetails[i].officeName,
                    Department: this.jobProfileListDetails[i].department,
                    Section: this.jobProfileListDetails[i].section,
                    JobTitle: this.jobProfileListDetails[i].jobTitle,
                    JobType: this.jobProfileListDetails[i].jobType,
                    Qty: this.jobProfileListDetails[i].quantity,
                    Education: this.jobProfileListDetails[i].education,
                    Experience: this.jobProfileListDetails[i].experience
                });
            }
            this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("jobProfileCompleteExcel"));
            this.excelDataList = [];
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.tblSearch != "") {
            for (var i = 0; i < this.jobProfileListDetails.length; i++) {
                if (this.jobProfileListDetails[i].officeName.includes(this.tblSearch) ||
                    this.jobProfileListDetails[i].department.includes(this.tblSearch) ||
                    this.jobProfileListDetails[i].section.includes(this.tblSearch) ||
                    this.jobProfileListDetails[i].jobTitle.includes(this.tblSearch) ||
                    this.jobProfileListDetails[i].jobType.includes(this.tblSearch) ||
                    this.jobProfileListDetails[i].education.includes(this.tblSearch)) {
                    this.excelDataList.push({
                        OfficeName: this.jobProfileListDetails[i].officeName,
                        Department: this.jobProfileListDetails[i].department,
                        Section: this.jobProfileListDetails[i].section,
                        JobTitle: this.jobProfileListDetails[i].jobTitle,
                        JobType: this.jobProfileListDetails[i].jobType,
                        Qty: this.jobProfileListDetails[i].quantity,
                        Education: this.jobProfileListDetails[i].education,
                        Experience: this.jobProfileListDetails[i].experience
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


}
