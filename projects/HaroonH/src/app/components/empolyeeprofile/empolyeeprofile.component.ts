import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { TTBody } from 'primeng/treetable';

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
    selector: 'app-empolyeeprofile',
    templateUrl: './empolyeeprofile.component.html',
    styleUrls: ['./empolyeeprofile.component.scss']
})
export class EmpolyeeprofileComponent implements OnInit {

    //serverUrl = "http://192.168.200.19:3011/";
    serverUrl = "http://localhost:50124/";
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
    employeeListMain = [];
    jobProfileList = [];
    orgList = [];
    empOrgList = [];
    skillGroupList = [];
    skillList = [];
    empSkillList = [];
    allFacilityList = [];
    empFacilityList = [];
    degreeList = [];
    empDegreeList = [];


    //* Excel Data List
    excelDataList = [];


    tempQualificationCriteriaList = [];
    gradeList = [
        { label: "A+", value: "A+" },
        { label: "A", value: "A" },
        { label: "B+", value: "B+" },
        { label: "B", value: "B" },
        { label: "C", value: "C" },
        { label: "D", value: "D" },
        { label: "E", value: "E" },
        { label: "F", value: "F" }
    ];

    divisionList = [
        { label: "First Division", value: "First Division" },
        { label: "Second Division", value: "Second Division" },
        { label: "Third Division", value: "Third Division" }
    ];

    //contact Detail
    contactDetail = [
        {
            id: 0,
            contactType: "",
            countryCode: "",
            contactCode: "",
            areaCode: true,
            mobileCode: false,
            contactNumber: "",
            mobileNumber: ""
        }
    ];

    //Emails Detail
    emailDetail = [
        {
            id: 0,
            type: "",
            email: ""
        }
    ];

    //address Detail
    addressDetail = [
        {
            id: 0,
            addressType: "",
            address: "",
            countryCode: "",
            provinceCode: "",
            districtCode: "",
            cityCode: "",
            cntryLst: [], // this.countryListForAddress,
            provinceList: [], // this.provinceList,
            districtList: [], // this.districtList,
            cityList: [] //this.cityList
        }
    ];

    contactType = [];
    countryList = [];
    addressType = [];
    emailType = [];
    countryListForAddress = [];
    provinceList = [];
    districtList = [];
    cityList = [];







    //*hidden variables
    empId;
    desigId;
    deptId;
    locationId;

    //* Variables for NgModels
    tblSearch;

    //* tab 1 ngModels
    firstName;
    midName;
    lastName;
    fullName
    fhName;
    CNIC;
    religion;


    //* tab 2 ngModels
    lblJobTitle;
    lblBPS;
    lblOffice;
    lblDepartment;
    lblAppointmentDate;
    lblJoiningDate;
    lblJobType;
    lblRetirementDate;
    lblContract;

    startDate;
    ddlJobProfile;

    //* tab 3 ngModels
    ddlDegree;
    empInstitute;
    empDegreeYear;
    ddlGrade;
    ddlDivision;

    //* tab 4 ngModels
    ddlSkillGroup;
    ddlSkill;
    empSkillLevel;
    empSkillRemarks;

    sklGrpTypeId;
    sklGrpQlfId;


    //* tab 5 ngModels
    empPost;
    ddlOrg;
    orgStartDate;
    orgEndDate;




    txtdPassword = '';
    txtdPin = '';

    constructor(public toastr: ToastrManager,
        private app: AppComponent,
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService,
        private http: HttpClient) { }

    ngOnInit() {

        this.getEmployee();
        this.getJobProfile();
        this.getOrganitzion();
        this.getQualificationCriteria();
        this.getEmpApprovedFacility();

        this.getAddressTypes();
        this.getCountry();
        this.getProvince();
        this.getDistrict();
        this.getCity();
        this.getContactTypes();
        this.getEmailTypes();

        this.midName = "";
    }

    @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel



    //function for get all saved employee 
    getEmployee() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getEmployee', { headers: reqHeader }).subscribe((data: any) => {

            this.employeeListMain = data;
        });

    }

    //function for get all saved job profile 
    getJobProfile() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getJobProfile', { headers: reqHeader }).subscribe((data: any) => {

            //this.jobProfileList = data;

            for (var i = 0; i < data.length; i++) {
                this.jobProfileList.push({
                    label: data[i].jobDesigName,
                    value: data[i].jobDesigID,
                    jobDesigID: data[i].jobDesigID,
                    jobPostDeptCd: data[i].jobPostDeptCd,
                    jobPostLocationCd: data[i].jobPostLocationCd,
                    payGradeName: data[i].payGradeName
                });
            }

        });

    }

    //function for get all saved organizations 
    getOrganitzion() {
        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getOrganization', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.orgList.push({
                    label: data[i].orgName,
                    value: data[i].orgID,
                    orgTypeCd: data[i].orgTypeCd
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

                // //geting degree 
                if (data[i].qlfctnTypeName == 'Degree') {
                    this.degreeList.push({
                        label: data[i].qlfctnCriteriaName,
                        value: data[i].qlfctnCriteriaCd,
                        qlfctnCd: data[i].qlfctnCd,
                        qlfctnTypeCd: data[i].qlfctnTypeCd
                    });
                }

                // //getting certificate
                // if (data[i].qlfctnTypeName == 'Certificate'){
                //     this.certificateList.push({
                //         label: data[i].qlfctnName + " - " + data[i].qlfctnCriteriaName,
                //         value: data[i].qlfctnCriteriaCd,
                //     });
                // }

                //getting skills
                if (data[i].qlfctnTypeName == 'Skills') {

                    var duplicateChk = false;
                    for (var j = 0; j < this.skillGroupList.length; j++) {
                        if (data[i].qlfctnCd == this.skillGroupList[j].value) {
                            duplicateChk = true;
                        }
                    }

                    if (duplicateChk == false) {
                        this.skillGroupList.push({
                            label: data[i].qlfctnName,
                            value: data[i].qlfctnCd,
                            qlfctnTypeCd: data[i].qlfctnTypeCd
                        });
                    }
                }
            }
        });
    }

    //Function for employee aproved facility
    getEmpApprovedFacility() {

        //var Token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getFacility', { headers: reqHeader }).subscribe((data: any) => {
            this.allFacilityList = data;
        });

    }





    //function for get all saved city
    getCity() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getCity', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.cityList.push({
                    label: data[i].thslName,
                    value: data[i].thslCd
                });
            }

        });

    }

    //function for get all saved district
    getDistrict() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getDistrict', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.districtList.push({
                    label: data[i].districtName,
                    value: data[i].districtCd
                });
            }

        });

    }

    //function for get all saved province
    getProvince() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getProvince', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.provinceList.push({
                    label: data[i].prvinceName,
                    value: data[i].prvncCd
                });
            }

        });

    }

    //function for get all saved countrys
    getCountry() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getCountry', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.countryListForAddress.push({
                    label: data[i].cntryName,
                    value: data[i].cntryCd.trim()
                });

                this.countryList.push({
                    label: data[i].cntryName + ' ' + data[i].cntryCallingCd,
                    value: data[i].cntryCallingCd
                });
            }



        });

    }

    //function for get all saved address types
    getAddressTypes() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getAddressType', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.addressType.push({
                    label: data[i].addressTypeName,
                    value: data[i].addressTypeCd
                });
            }

        });

    }

    //function for get all saved telephone types
    getContactTypes() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getTelephoneType', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.contactType.push({
                    label: data[i].teleTypeName,
                    value: data[i].teleTypeCd
                });
            }

        });

    }

    //function for get all saved email types
    getEmailTypes() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getEmailType', { headers: reqHeader }).subscribe((data: any) => {

            for (var i = 0; i < data.length; i++) {
                this.emailType.push({
                    label: data[i].emailTypeName,
                    value: data[i].emailTypeCd
                });
            }

        });

    }















    //Function for add previous service detail
    addPSD() {

        if (this.empPost == undefined || this.empPost.trim() == "") {
            this.toastr.errorToastr('Please enter post', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.ddlOrg == undefined || this.ddlOrg == "") {
            this.toastr.errorToastr('Please select organization', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.orgStartDate == undefined || this.orgStartDate == "" || this.orgStartDate == null) {
            this.toastr.errorToastr('Please enter job start date', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.orgEndDate == undefined || this.orgEndDate == "" || this.orgEndDate == null) {
            this.toastr.errorToastr('please enter job end date', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.orgStartDate >= this.orgEndDate) {
            this.toastr.errorToastr('Invalid job end date', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            var duplicateChk = false;

            for (var i = 0; i < this.empOrgList.length; i++) {
                if (this.empOrgList[i].Post.toUpperCase() == this.empPost.toUpperCase() && this.empOrgList[i].CmpnyID == this.ddlOrg) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true) {
                this.toastr.errorToastr('Post already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

                var dataList = [];
                dataList = this.orgList.filter(x => x.value == this.ddlOrg);

                this.empOrgList.push({
                    IndvdlID: this.empId,
                    CmpnyID: this.ddlOrg,
                    JobDesigID: this.desigId,
                    StartDt: this.orgStartDate,
                    LeavingDt: this.orgEndDate,
                    Post: this.empPost.trim(),
                    OrgName: dataList[0].label
                });
            }
        }
    }

    //Deleting previous service detail row
    removePSD(item) {
        this.empOrgList.splice(item, 1);
    }

    //Function for add employee skill detail
    addSkill() {

        if (this.ddlSkillGroup == undefined || this.ddlSkillGroup == "") {
            this.toastr.errorToastr('Please select skill group', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.ddlSkill == undefined || this.ddlSkill == "") {
            this.toastr.errorToastr('Please enter skill', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.empSkillLevel == undefined || this.empSkillLevel == "") {
            this.toastr.errorToastr('Please enter level', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.empSkillRemarks == undefined || this.empSkillRemarks == "") {
            this.toastr.errorToastr('please enter remarks', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.empSkillLevel < 1 || this.empSkillLevel > 10) {
            this.toastr.errorToastr('Level must be within 1 to 10', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            var duplicateChk = false;

            for (var i = 0; i < this.empSkillList.length; i++) {
                if (this.empSkillList[i].SkillCd == this.ddlSkillGroup && this.empSkillList[i].SkillsCriteriaCd == this.ddlSkill) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true) {
                this.toastr.errorToastr('Skill already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

                var dataList = [];
                dataList = this.skillGroupList.filter(x => x.value == this.ddlSkillGroup);

                var dataList1 = [];
                dataList1 = this.skillList.filter(x => x.value == this.ddlSkill);

                this.empSkillList.push({
                    IndvdlID: this.empId,
                    SkillTypeCd: dataList[0].qlfctnTypeCd,
                    SkillCd: this.ddlSkillGroup,
                    SkillsCriteriaCd: this.ddlSkill,
                    SkillLvl: this.empSkillLevel,
                    SkillRmrks: this.empSkillRemarks,
                    group: dataList[0].label,
                    skill: dataList1[0].label
                });
            }
        }
    }

    //Deleting previous service detail row
    removeSkill(item) {
        this.empSkillList.splice(item, 1);
    }

    //Function for add employee qualification detail
    addQualification() {

        if (this.ddlDegree == undefined || this.ddlDegree == "") {
            this.toastr.errorToastr('Please select degree', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.empInstitute == undefined || this.empInstitute.trim() == "") {
            this.toastr.errorToastr('Please enter institute/campus', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.empDegreeYear == undefined || this.empDegreeYear == "" || this.empDegreeYear == null) {
            this.toastr.errorToastr('Please enter year', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.ddlGrade == undefined || this.ddlGrade == "") {
            this.toastr.errorToastr('Please enter grade', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.ddlDivision == undefined || this.ddlDivision == "") {
            this.toastr.errorToastr('Please enter division', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            var duplicateChk = false;

            for (var i = 0; i < this.empDegreeList.length; i++) {
                if (this.empDegreeList[i].EducationCriteriaCd == this.ddlDegree) {
                    duplicateChk = true;
                }
            }

            if (duplicateChk == true) {
                this.toastr.errorToastr('Degree already added', 'Error', { toastTimeout: (2500) });
                return false;
            }
            else {

                var dataList = [];
                dataList = this.degreeList.filter(x => x.value == this.ddlDegree);

                this.empDegreeList.push({
                    EmpID: this.empId,
                    IndvdlID: this.empId,
                    TBDProgramTitle: null,
                    PssngDt: this.empDegreeYear,
                    TotMrks: 0,
                    MrksObtnd: 0,
                    Grade: this.ddlGrade,
                    DivIsion: this.ddlDivision,
                    StartDt: null,
                    CampusName: this.empInstitute,
                    EducationalInstituteID: 1,//--------------------------------------
                    MajorSbjcts: null,
                    ProfileTypeCd: 0,
                    EducationTypeCd: dataList[0].qlfctnTypeCd,
                    EducationCd: dataList[0].qlfctnCd,
                    EducationCriteriaCd: this.ddlDegree,
                    degree: dataList[0].label
                });
            }
        }
    }

    //Deleting qualification detail row
    removeQualification(item) {
        this.empDegreeList.splice(item, 1);
    }








    //function for edit existing leave type 
    edit(item) {

        this.clear();
        this.updateFlag = true;

        this.empId = item.empID;
        this.desigId = item.jobDesigID;
        this.deptId = item.jobPostDeptCd;
        this.locationId = item.jobPostLocationCd;

        //tab 1 fields
        this.firstName = item.indvdlFirstName;
        this.midName = item.IndvdlMidName;
        this.lastName = item.indvdlLastName;
        this.fullName = item.indvdlFullName;
        this.fhName = item.indvdlFatherName;
        this.CNIC = item.indvdlCNIC;

        //tab 2 fields
        this.lblJobTitle = item.jobDesigName;
        this.lblBPS = item.payGradeName;
        this.lblOffice = item.locationName;
        this.lblDepartment = item.deptName;
        this.lblAppointmentDate = new Date(item.empJobAppntmntDt);
        this.lblJobType = item.jobTypeName;
        this.lblContract = "contract";
        this.ddlJobProfile = item.jobDesigID;
        this.startDate = new Date(item.empJobStartDt);

        if (this.lblJobType.toUpperCase() == 'REGULAR') {
            this.lblRetirementDate = new Date(this.lblAppointmentDate.getFullYear() + 60, this.lblAppointmentDate.getMonth(), this.lblAppointmentDate.getDay());
        }

        this.getFilterItem("facility");

    }

    clear() {

        this.empId = 0;
        this.desigId = 0;
        this.deptId = 0;
        this.locationId = 0;


        //tab 2 fields
        this.lblJobTitle = "";
        this.lblBPS = "";
        this.lblOffice = "";
        this.lblDepartment = "";
        this.lblAppointmentDate = "";
        this.lblJobType = "";
        this.lblRetirementDate = "";
        this.lblContract = "";
        this.startDate = "";
        this.ddlJobProfile = undefined;

    }


    //Function for update employee personal info 
    updateEmpPersonalInfo() {

        // this.toastr.errorToastr('Please enter complete information', 'Error', { toastTimeout: (2500) });
        // return false;

        if (this.firstName == undefined || this.firstName.trim() == "") {
            this.toastr.errorToastr('Please enter first name', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.lastName == undefined || this.lastName.trim() == "") {
            this.toastr.errorToastr('Please enter last name', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.fhName == undefined || this.fhName.trim() == "") {
            this.toastr.errorToastr('Please enter father/husband name', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.CNIC == undefined || this.CNIC == "") {
            this.toastr.errorToastr('Please enter cnic', 'Error', { toastTimeout: (2500) });
            return false;
        }
        // else if (this.religion == undefined || this.religion.trim() == "") {
        //     this.toastr.errorToastr('Please enter religion', 'Error', { toastTimeout: (2500) });
        //     return false;
        // }
        else if (this.addressDetail.length == 0) {
            this.toastr.errorToastr('Please enter employee address', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.contactDetail.length == 0) {
            this.toastr.errorToastr('Please enter employee contact', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.emailDetail.length == 0) {
            this.toastr.errorToastr('Please enter employee email', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            // address type conditions for subsidiary
            if (this.addressDetail.length > 0) {
                for (let i = 0; i < this.addressDetail.length; i++) {
                    if (this.addressDetail[i].addressType == "") {
                        this.toastr.errorToastr('Please Select Address Type', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                    else if (this.addressDetail[i].address.trim() == "") {
                        this.toastr.errorToastr('Please Enter Address', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                    else if (this.addressDetail[i].countryCode == "") {
                        this.toastr.errorToastr('Please Select Country', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                    else if (this.addressDetail[i].provinceCode == "") {
                        this.toastr.errorToastr('Please Select Province', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                    else if (this.addressDetail[i].districtCode == "") {
                        this.toastr.errorToastr('Please Select District', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                    else if (this.addressDetail[i].cityCode == "") {
                        this.toastr.errorToastr('Please Select City', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                }
            }

            // contact type conditions for subsidiary
            if (this.contactDetail.length > 0) {
                for (let i = 0; i < this.contactDetail.length; i++) {
                    if (this.contactDetail[i].contactType == "") {
                        this.toastr.errorToastr('Please Select Contact Type', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                    else if (this.contactDetail[i].countryCode == "countryCode") {
                        this.toastr.errorToastr('Please Select Country Code', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                    else if (this.contactDetail[i].contactNumber.trim() == "") {
                        this.toastr.errorToastr('Please Enter Contact Number', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                }
            }

            // email type conditions for subsidiary
            if (this.emailDetail.length > 0) {
                for (let i = 0; i < this.emailDetail.length; i++) {
                    if (this.emailDetail[i].type == "") {
                        this.toastr.errorToastr('Please Select Email Type', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                    else if (this.emailDetail[i].email.trim() == "") {
                        this.toastr.errorToastr('Please Enter Email', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                    else if (this.isEmail(this.emailDetail[i].email) == false) {
                        this.toastr.errorToastr('Invalid email', 'Error', { toastTimeout: (2500) });
                        return false;
                    }
                }
            }

            if (this.midName == undefined || this.midName.trim() == "") {
                this.midName = null;
            }
            //* ********************************************save data 
            var updateData = {
                "EmpID": this.empId,
                "IndvdlFirstName": this.firstName.trim(),
                "IndvdlMidName": this.midName,
                "IndvdlLastName": this.lastName,
                "IndvdlFullName": this.fullName,
                "IndvdlCNIC": this.CNIC,
                "IndvdlFatherName": this.fhName,
                "addressList": JSON.stringify(this.addressDetail),
                "contactList": JSON.stringify(this.contactDetail),
                "emailList": JSON.stringify(this.emailDetail),
                "ConnectedUser": "12000",
                "DelFlag": 0
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/updateEmpPersonalInfo', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Updated Successfully!") {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                    return false;
                } else {
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    this.getEmployee();
                    //this.ddlJobProfile = "";
                    //this.startDate = "";
                    return false;
                }
            });
        }
    }

    //Function for update employee job profile 
    updateProfile() {

        // this.toastr.errorToastr('Enter Complete Information', 'Error', { toastTimeout: (2500) });
        // return false;

        if (this.ddlJobProfile == '' || this.ddlJobProfile == null || this.ddlJobProfile == undefined) {
            this.toastr.errorToastr('Please select job profile', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.startDate == undefined || this.startDate == "" || this.startDate == null) {
            this.toastr.errorToastr('Please enter joining date', 'Error', { toastTimeout: (2500) });
            return false;
        }

        else {


            //* ********************************************save data 
            var updateData = {
                "EmpID": this.empId,
                "JobDesigID": this.desigId,
                "JobPostDeptCd": this.deptId,
                "JobPostLocationCd": this.locationId,
                "EmpJobStartDt": this.startDate,
                "ConnectedUser": "12000",
                "DelFlag": 0
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/updateEmpJobProfile', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Updated Successfully!") {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
                    return false;
                } else {
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    this.getEmployee();
                    this.ddlJobProfile = "";
                    this.startDate = "";
                    return false;
                }
            });
        }
    }

    //Function for update employee previous service detail
    updatePSD() {

        if (this.empOrgList.length == 0) {
            this.toastr.errorToastr('Please enter employee previous service detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            //* ********************************************save data 
            var updateData = {
                "EmpID": this.empId,
                "EmpPSDList": JSON.stringify(this.empOrgList),
                "ConnectedUser": "12000",
                "DelFlag": 0
            };
            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/updatePSD', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Updated Successfully!") {
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

    //Function for update employee skill detail
    updateSkills() {

        if (this.empSkillList.length == 0) {
            this.toastr.errorToastr('Please enter employee skills detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            //* ********************************************save data 
            var updateData = {
                "EmpID": this.empId,
                "EmpSkillList": JSON.stringify(this.empSkillList),
                "ConnectedUser": "12000",
                "DelFlag": 0
            };
            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/updateSkill', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Updated Successfully!") {
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

    //Function for update employee qualification detail
    updateQualification() {

        if (this.empDegreeList.length == 0) {
            this.toastr.errorToastr('Please enter employee qualification detail', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            //* ********************************************save data 
            var updateData = {
                "EmpID": this.empId,
                "EmpQualificationList": JSON.stringify(this.empDegreeList),
                "ConnectedUser": "12000",
                "DelFlag": 0
            };
            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/updateQualification', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Record Updated Successfully!") {
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






    //function for sort table data 
    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }

    //function for get filtere list from job post
    getFilterItem(filterOption) {

        // if(this.jobTitle != null){
        //     alert(this.jobTitle);
        // }

        var dataList = [];

        //filter for job post
        if (filterOption == "jobs") {

            dataList = this.jobProfileList.filter(x => x.jobDesigID == this.ddlJobProfile);

            this.desigId = dataList[0].jobDesigID;
            this.deptId = dataList[0].jobPostDeptCd;
            this.locationId = dataList[0].jobPostLocationCd;
            this.lblJobTitle = dataList[0].label;
            this.lblBPS = dataList[0].payGradeName;

        }

        //filter for generate skill list
        if (filterOption == "skill") {

            dataList = this.tempQualificationCriteriaList.filter(x => x.qlfctnCd == this.ddlSkillGroup);
            this.skillList = [];
            this.ddlSkill = "";

            for (var i = 0; i < dataList.length; i++) {
                this.skillList.push({
                    label: dataList[i].qlfctnCriteriaName,
                    value: dataList[i].qlfctnCriteriaCd
                });
            }
        }

        //filter for facility
        if (filterOption == "facility") {

            this.empFacilityList = [];
            dataList = this.allFacilityList.filter(x => x.jobDesigID == this.desigId && x.jobPostDeptCd == this.deptId && x.jobPostLocationCd == this.locationId);

            for (var i = 0; i < dataList.length; i++) {
                this.empFacilityList.push({
                    facilityName: dataList[i].facilityName
                });
            }

        }
    }

    //function for generate employee full name 
    generateFullName() {

        if (this.firstName == undefined) {
            this.fullName = "";
        }
        if (this.midName == undefined) {
            this.midName = " ";
        }
        if (this.lastName == undefined) {
            this.lastName = "";
        }
        this.fullName = this.firstName.trim() + " " + this.midName.trim() + " " + this.lastName.trim();
    }









    //Function for add new contact row 
    addContact() {

        this.contactDetail.push({
            id: 0,
            contactType: "",
            countryCode: "",
            contactCode: "",
            areaCode: true,
            mobileCode: false,
            contactNumber: "",
            mobileNumber: ""
        });

    }

    //Function for add new address row 
    addAddress() {

        this.addressDetail.push({
            id: 0,
            addressType: "",
            address: "",
            countryCode: "",
            provinceCode: "",
            districtCode: "",
            cityCode: "",
            cntryLst: this.countryListForAddress,
            provinceList: this.provinceList,
            districtList: this.districtList,
            cityList: this.cityList
        });

    }

    //Function for add new email row 
    addEmail() {

        this.emailDetail.push({
            id: 0,
            type: "",
            email: ""
        });

    }



    //Deleting contact row
    removeContact(item) {
        this.contactDetail.splice(item, 1);
    }

    //Deleting address row
    removeAddress(item) {
        this.addressDetail.splice(item, 1);
    }

    //Deleting address row
    removeEmail(item) {
        this.emailDetail.splice(item, 1);
    }

    //function for email validation 
    isEmail(email) {
        return this.app.validateEmail(email);
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
            for (var i = 0; i < this.employeeListMain.length; i++) {
                //alert(this.tblSearch + " - " + this.skillCriteriaList[i].departmentName)
                completeDataList.push({
                    EmployeeName: this.employeeListMain[i].indvdlFullName,
                    JobProfile: this.employeeListMain[i].jobDesigName,
                    Office: this.employeeListMain[i].locationName,
                    Department: this.employeeListMain[i].deptName
                });
            }
            this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("employeeProfileCompleteCSV", CsvFileTypes.CSV));
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.tblSearch != "") {
            var filteredDataList = [];
            for (var i = 0; i < this.employeeListMain.length; i++) {
                if (this.employeeListMain[i].indvdlFullName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.employeeListMain[i].jobDesigName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.employeeListMain[i].locationName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.employeeListMain[i].deptName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
                    filteredDataList.push({
                        EmployeeName: this.employeeListMain[i].indvdlFullName,
                        JobProfile: this.employeeListMain[i].jobDesigName,
                        Office: this.employeeListMain[i].locationName,
                        Department: this.employeeListMain[i].deptName
                    });
                }
            }

            if (filteredDataList.length > 0) {
                this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("employeeProfileFilterCSV", CsvFileTypes.CSV));
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
            for (var i = 0; i < this.employeeListMain.length; i++) {
                this.excelDataList.push({
                    EmployeeName: this.employeeListMain[i].indvdlFullName,
                    JobProfile: this.employeeListMain[i].jobDesigName,
                    Office: this.employeeListMain[i].locationName,
                    Department: this.employeeListMain[i].deptName
                });
            }
            this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("employeeProfileCompleteExcel"));
            this.excelDataList = [];
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.tblSearch != "") {
            for (var i = 0; i < this.employeeListMain.length; i++) {
                if (this.employeeListMain[i].indvdlFullName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.employeeListMain[i].jobDesigName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.employeeListMain[i].locationName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
                    this.employeeListMain[i].deptName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
                    this.excelDataList.push({
                        EmployeeName: this.employeeListMain[i].indvdlFullName,
                        JobProfile: this.employeeListMain[i].jobDesigName,
                        Office: this.employeeListMain[i].locationName,
                        Department: this.employeeListMain[i].deptName
                    });
                }
            }

            if (this.excelDataList.length > 0) {
                //alert("Filter List " + this.excelDataList.length);

                this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("employeeProfileFilterExcel"));
                this.excelDataList = [];
            }
            else {
                this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
            }
        }
    }


}
