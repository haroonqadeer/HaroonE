import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';

declare var $: any;

@Component({
    selector: 'app-jobprofile',
    templateUrl: './jobprofile.component.html',
    styleUrls: ['./jobprofile.component.scss']
})
export class JobprofileComponent implements OnInit {

    serverUrl = "http://localhost:47807/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    //*Bolean variable 
    updateFlag = false;

    //* list for excel data
    excelDataList = [];

    jobsList = [];
    
    certificateList = [];
    degreeList = [];
    
    
    tempJobsList = [];
    tempQualificationCriteriaList = [];
    tempDegreeList = [];
    tempCertificateList = [];
    tempSkillList = [];
    tempDescList = [];



    //Skills Detail
    skillsDetail = [
        {
            id: 0,
            skill: "",
            indicator: false
        }
    ];

    descDetail = [
        {
            id: 0,
            desc: ""
        }
    ];
    // leaveNatureList = [];
    // leaveLimitTypeList = [];
    // leaveRuleList = [];



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


    //* Variables for NgModels
    tblSearch;

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
    chkSkillPI = false;
    Experience = 0;
    experienceYear = null;
    experienceMonth = null;




    txtdPassword = '';
    txtdPin = '';





    show=false;

    formGroup1: FormGroup;
    formGroup2: FormGroup;
    formGroup3: FormGroup;
    formGroup4: FormGroup;
    formGroup5: FormGroup;
    formGroup6: FormGroup;

    cmbType: string[] = [];
    cmbDegree: string[] = [];
    cmbCertificate: string[] = [];
    
    offices: SelectItem[];
    sects: SelectItem[];
    officers: SelectItem[];

    scales: SelectItem[];
    types: SelectItem[];
    // degrees: SelectItem[];
    degrees = [];

    // certificates: SelectItem[];
    certificates = [];
    roles: SelectItem[];
    rules: SelectItem[];
    years: SelectItem[];

    orgs: SelectItem[];
    times: SelectItem[];
    depts: SelectItem[];

    fourthCtrl = '';
    
    searchDegree = '';
    searchcertification = '';

    constructor(
        private _formBuilder: FormBuilder,
        private toastr: ToastrManager,
        private http: HttpClient,
        private app: AppComponent
    ) { }

    ngOnInit() {    


    this.offices = [
        {label: 'Head Quarter', value: 'Head Quarter'},
        {label: 'Lahore Branch', value: 'Lahore Branch'}
    ];
    
    this.depts = [
        {label: 'Finance', value: 'Finance'},
        {label: 'Admin', value: 'Admin'},
        {label: 'HR', value: 'HR'}
    ];
    
    this.sects = [
      {label: 'Tax', value: 'Tax'},
      {label: 'Audit', value: 'Audit'}
    ];

    this.officers = [
      {label: 'AD', value: 'AD'},
      {label: 'DD', value: 'DD'},
      {label: 'Director', value: 'Director'}
    ];
    
    this.scales = [
      {label: '1', value: '1'},
      {label: '2', value: '2'},
      {label: '3', value: '3'},
      {label: '4', value: '4'},
      {label: '5', value: '5'},
      {label: '6', value: '6'},
      {label: '7', value: '7'},
      {label: '8', value: '8'},
      {label: '9', value: '9'},
      {label: '10', value: '10'},
      {label: '11', value: '11'},
      {label: '12', value: '12'},
      {label: '13', value: '13'},
      {label: '14', value: '14'},
      {label: '15', value: '15'}
    ];
    
    this.types = [
      {label: 'Regular', value: 'Regular'},
      {label: 'Daily Wages', value: 'Daily Wages'},
      {label: 'Contract', value: 'Contract'}
    ];

    this.degrees = [
        {id: '1', dName: 'BSc', dDesc: 'Bachelor in Computer Science', cName: 'Computer', cDesc: 'Degree Computer Science'},
        {id: '2', dName: 'MBA', dDesc: 'Masters in Accounts', cName: 'Accounts', cDesc: 'Degree Accounts'},
        {id: '3', dName: 'ICs', dDesc: 'Inter In Computer Science', cName: 'Computer', cDesc: 'Inter Degree Computer'}
    ];

    this.certificates = [
        {id: '1', dName: 'VB.Net', dDesc: 'Visual Basic', cName: 'Language', cDesc: 'Certification'},
        {id: '2', dName: 'Quality Assurance', dDesc: 'Software Tesing', cName: 'Testing', cDesc: 'Certifications'},
        {id: '3', dName: 'Game Development', dDesc: 'Making Games', cName: 'Development', cDesc: 'Certifications'}
    ];

    this.roles = [
        {label: 'Voucher Entry', value: 'Voucher Entry'},
        {label: 'Hr Admin', value: 'Hr Admin'},
        {label: 'Finance', value: 'Finance'}
    ];
    
    this.rules = [
        {label: 'Medical Leave', value: 'Medical Leaves'},
        {label: 'Casual Leave', value: 'Casual Leave'},
        {label: 'Sick Leave', value: 'Sick Leave'}
    ];
    
    this.years = [
        {label: '14', value: '14'},
        {label: '12', value: '12'},
        {label: '16', value: '16'}
    ];
    
    this.orgs = [
        {label: 'Private', value: 'Private'},
        {label: 'Govt.', value: 'Govt.'}
    ];

    this.times = [
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'}
    ];





        this.steperSetting();
        this.getJobPosts();
        this.getQualificationCriteria();


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

    //function for get all saved degrees, certificate and skills 
    getQualificationCriteria() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getQualificationCriteria', { headers: reqHeader }).subscribe((data: any) => {
            
            this.tempQualificationCriteriaList = data;

            for (var i = 0; i < data.length; i++) {

                //geting degree 
                if (data[i].qlfctnTypeName == 'Degree'){
                    this.degreeList.push({
                        label: data[i].qlfctnName + " - " + data[i].qlfctnCriteriaName,
                        value: data[i].qlfctnCriteriaCd,
                    });
                }

                //getting certificate
                if (data[i].qlfctnTypeName == 'Certificate'){
                    this.certificateList.push({
                        label: data[i].qlfctnName + " - " + data[i].qlfctnCriteriaName,
                        value: data[i].qlfctnCriteriaCd,
                    });
                }

                //getting skills
                if (data[i].qlfctnTypeName == 'Skills'){
                    this.tempSkillList.push({
                        label: data[i].qlfctnName + " - " + data[i].qlfctnCriteriaName,
                        value: data[i].qlfctnCriteriaCd,
                    });
                }

            }

        });

    }

    onTypeChange(item){
        
        if(item.label=='Contract'){
        this.show=true;    
        }else{
        this.show=false;
        }
    }

    clear(){

    }

    //Function for save and update leave nature 
    save() {


        this.toastr.errorToastr('Enter Complete Information', 'Error', { toastTimeout: (2500) });
        return false;

        if (this.jobTitle == '' || this.jobTitle == null) {
            this.toastr.errorToastr('Please select job post', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.tempDegreeList.length == 0 ) {
            this.toastr.errorToastr('Please qualifiation detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

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
                    "jobProfileID":         0,
                    "JobDesigID":           this.DesigId,
                    "JobPostDeptCd":        this.DeptId,
                    "JobPostLocationCd":    this.LocationId,
                    "jobProfileList":       JSON.stringify(this.tempDegreeList),
                    "ConnectedUser":        "12000",
                    "DelFlag":              0
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
                        //$('#leaveNatureModal').modal('hide');
                        //this.getLeaveNature();
                        return false;
                    }
                });
            }
        }
    }
    
    //Function for add new skill row 
    addSkill() {
        this.skillsDetail.push({
            id: 0,
            skill: "",
            indicator: false
        });
    }

    //Deleting skill row
    removeSkill(item) {
        this.skillsDetail.splice(item, 1);
    }


    //Function for add new desc row
    addDesc() {
        this.descDetail.push({
            id: 0,
            desc: ""
        });
    }


    //Deleting skill row
    removeDesc(item) {
        this.descDetail.splice(item, 1);
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
            this.toastr.errorToastr('Invalid maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{


            var duplicateDegreeChk = false;

            for (var i = 0; i < this.tempDegreeList.length; i++) {
                if (this.tempDegreeList[i].QlfctnCriteriaCD == this.QualificationCriteriaId) {
                    duplicateDegreeChk = true;
                }
            }

            if (duplicateDegreeChk == true){
                this.toastr.errorToastr('Degree already exist', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

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
            this.toastr.errorToastr('Invalid maximum level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else{


            var duplicateChk = false;

            for (var i = 0; i < this.tempCertificateList.length; i++) {
                if (this.tempCertificateList[i].QlfctnCriteriaCD == this.CertificateCriteriaId) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true){
                this.toastr.errorToastr('Certificate already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else{

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
        

    }

}
