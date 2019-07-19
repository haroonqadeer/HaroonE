// import { DatePipe } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppComponent } from 'src/app/app.component';
//import { AppComponent } from '../../app.component';
//import * as jsPDF from 'jspdf';
import {
  IgxExcelExporterOptions,
  IgxExcelExporterService,
  IgxGridComponent,
  IgxCsvExporterService,
  IgxCsvExporterOptions,
  CsvFileTypes
} from "igniteui-angular";
import { HttpHeaders, HttpClient } from '@angular/common/http';

import * as jsPDF from "jspdf";
import 'jspdf-autotable';
// import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-performance-eva',
  templateUrl: './performance-eva.component.html',
  styleUrls: ['./performance-eva.component.scss']
})
export class PerformanceEvaComponent implements OnInit {

  serverUrl = "https://localhost:9035/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  tblSearchReviews = '';
  tblSearchGoals = '';
  tblSearchSkills = '';

  employeeList = [];
  newEmployeeList = []; // temp list
  skillsNameList = [];
  supervisorList = [];

  empDesignation = '';
  empGrade = '';

  //* Review Tab NgModels
  reviewsList = [];
  reviewDate = '';
  employeeName = '';
  rateJobKnowledge: any;
  rateWorkQlty: any;
  rateAttendance: any;
  rateCommunication: any;
  rateDependability: any;

  //* Projects Tab NgModels
  projectsPerformanceData = [];
  tempProjectsPerformanceData = [];
  jobDesigId = '';
  companyId = '';
  projectsList = [];
  startDate = '';
  finishDate = '';
  projectDesc = '';
  rateEmpAssessment = '';
  supervisorName = '';
  supervisor = '';
  rateSprvsrAssessment = '';

  //* Skills Tab NgModels
  tempIndvdlId = '';
  tempSkillsPerformanceData = [];
  skillsPerformanceData = [];
  skillsList = [];
  skillDate = '';
  qlfctnSkillName = ''; //* to show skill name in front
  skillCd = '';
  skillTypeCd = '';
  skillCriteriaCd = '';
  rateSkillLevel = '';
  skillRemarks = '';


  userId = '';
  userName = '';
  userJobDesignationId = '';
  userBPS = '';
  userManagerId = '';

  //* for delete Ng-Models
  userPassword = '';
  userPINCode = '';
  dReviewsId = '';
  dProjectsId = '';
  dSkillsId = '';

  //* list for excel data
  excelDataListReviews = [];
  excelDataListGoals = [];
  excelDataListSkills = [];



  //* variables for pagination and orderby pipe
  p = 1;
  pType = 1;
  order = 'info.name';
  reverse = false;
  // orderGroup = 'info.name';
  // reverseGroup = false;
  sortedCollection: any[];
  itemPerPage = '10';
  itemPerPageType = '5';



  constructor(public toastr: ToastrManager,
    private app: AppComponent,
    private excelExportService: IgxExcelExporterService,
    private csvExportService: IgxCsvExporterService,
    private http: HttpClient) { }

  ngOnInit() {
    this.getEmployee();
    this.getSkillsName();
    this.getSupervisor();

    // get projects performance data
    this.getProjectsPerformanceData();

    // get skills performance data
    this.getSkillsPerformanceData();

    this.userName = localStorage.getItem('userName');

    //this.newEmployee();
  }


  @ViewChild("excelDataContentReviews") public excelDataContentReviews: IgxGridComponent; //For excel
  @ViewChild("excelDataContentGoals") public excelDataContentGoals: IgxGridComponent; //For excel
  @ViewChild("excelDataContentSkills") public excelDataContentSkills: IgxGridComponent; //For excel




  // get employeee
  getEmployee() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getEmployee', { headers: reqHeader }).subscribe((data: any) => {
      this.employeeList = data;

      //alert(this.userName + " List : " + this.employeeList.length);

      for (let i = 0; i < this.employeeList.length; i++) {
        //alert("user_Name : " + this.employeeList[i].indvdlERPUsrID);
        if (this.userName == this.employeeList[i].indvdlERPUsrID) {
          //alert("Name : " + this.employeeList[i].indvdlERPUsrID);
          //this.userId = this.employeeList[i].indvdlID;
          this.userJobDesignationId = this.employeeList[i].jobDesigID;


        }
      }
      this.getNewEmployee();
    });
  }

  // for (let i = 0; i < this.employeeList.length; i++) {
  //   if (this.userDesignationId != this.employeeList[i].managerJobDesigID) {
  //     this.newEmployeeList.push({
  //       employeeId: this.employeeList[i].indvdlID,
  //       employeeName: this.employeeList[i].indvdlFirstName,
  //       employeeDesignationId: this.employeeList[i].jobDesigID,
  //       employeeDesignationName: this.employeeList[i].jobDesigName,
  //       employeeBPS: this.employeeList[i].payGradeName
  //     });
  //   }
  // }

  getNewEmployee() {
    //alert("OK Designation Id :  " + this.userDesignationId);
    var saveData = {
      "jobDesigID": this.userJobDesignationId
    };

    // var token = localStorage.getItem(this.tokenKey);
    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post(this.serverUrl + 'api/getNewEmployee', saveData, { responseType: 'json' }).subscribe((data: any) => {
      //alert('data length: ' + data.length);
      this.newEmployeeList = data;
    });
  }

  // get employeee
  getSupervisor() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getSupervisor', { headers: reqHeader }).subscribe((data: any) => {
      this.supervisorList = data;
    });
  }

  // get skills name
  getSkillsName() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getSkillsName', { headers: reqHeader }).subscribe((data: any) => {
      this.skillsNameList = data;
    });
  }


  // get projects performance data bg
  getProjectsPerformanceData() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getProjectsPerformanceData', { headers: reqHeader }).subscribe((data: any) => {
      this.projectsPerformanceData = data;
    });
    for (let i = 0; i < this.projectsPerformanceData.length; i++) {
      if (this.employeeName == this.projectsPerformanceData[i].indvdlID) {
        this.tempIndvdlId = this.newEmployeeList[i].indvdlID;
      }
    }
    //this.tempListSkillsPerformanceData(this.tempIndvdlId);
  }



  // get skills performance data
  getSkillsPerformanceData() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getSkillsPerformanceData', { headers: reqHeader }).subscribe((data: any) => {
      this.skillsPerformanceData = data;
    });
    for (let i = 0; i < this.skillsPerformanceData.length; i++) {
      if (this.employeeName == this.skillsPerformanceData[i].indvdlID) {
        this.tempIndvdlId = this.newEmployeeList[i].indvdlID;
      }
    }
    //this.tempListSkillsPerformanceData(this.tempIndvdlId);
  }




  empChange(item) {
    //this.getSkillsPerformanceData();
    for (let i = 0; i < this.newEmployeeList.length; i++) {
      if (item.value == this.newEmployeeList[i].indvdlID) {
        this.empDesignation = this.newEmployeeList[i].jobDesigName;
        this.empGrade = this.newEmployeeList[i].payGradeName;
        this.tempIndvdlId = this.newEmployeeList[i].indvdlID;
      }
    }

    this.tempListProjectsPerformanceData(this.tempIndvdlId);

    this.tempListSkillsPerformanceData(this.tempIndvdlId);

  }

  // temp list Skills Performance Data
  tempListProjectsPerformanceData(tempIndvdlId) {
    //alert(item.value);



    for (let i = 0; i < this.projectsPerformanceData.length; i++) {
      if (tempIndvdlId == this.projectsPerformanceData[i].indvdlID) {
        this.tempProjectsPerformanceData.push({
          IndvdlID: this.projectsPerformanceData[i].indvdlID,
          CmpnyID: this.projectsPerformanceData[i].cmpnyID,
          JobDesigID: this.projectsPerformanceData[i].jobDesigID,
          StartDate: this.projectsPerformanceData[i].startDt,
          FinishDate: this.projectsPerformanceData[i].finishDt,
          //IndvdlRole: this.skillsPerformanceData[i].skillsCriteriaCd,
          ProjectDesc: this.projectsPerformanceData[i].projectDesc,
          ProjectTypeCd: this.projectsPerformanceData[i].projectTypeCd,
          RateEmpAssessment: this.projectsPerformanceData[i].indvdlAssessLvl,
          SupervisorId: this.projectsPerformanceData[i].managerJobDesigID, // ID
          //Supervisor: this.projectsPerformanceData[i].indvdlFirstName, // Name
          RateSprvsrAssessment: this.projectsPerformanceData[i].managerAssessLvl
        });
      }
    }
  }

  // temp list Skills Performance Data
  tempListSkillsPerformanceData(tempIndvdlId) {
    //alert(item.value);

    for (let i = 0; i < this.skillsPerformanceData.length; i++) {
      if (tempIndvdlId == this.skillsPerformanceData[i].indvdlID) {
        this.tempSkillsPerformanceData.push({
          IndvdlID: this.skillsPerformanceData[i].indvdlID,
          SkillTypeCd: this.skillsPerformanceData[i].skillTypeCd,
          SkillCd: this.skillsPerformanceData[i].skillCd,
          SkillDate: this.skillsPerformanceData[i].skillDt,
          SkillName: this.skillsPerformanceData[i].qlfctnCriteriaName,
          SkillCriteriaCd: this.skillsPerformanceData[i].skillsCriteriaCd,
          RateSkillLevel: this.skillsPerformanceData[i].skillLvl,
          SkillRemarks: this.skillsPerformanceData[i].skillRmrks
        });
      }
    }
  }


  //* add reviews
  addReviews() {

    if (this.reviewDate == undefined || this.reviewDate == "") {
      this.toastr.errorToastr('Please Select Date', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.employeeName == undefined || this.employeeName == "") {
      this.toastr.errorToastr('Please Select Employee', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.rateJobKnowledge == undefined || this.rateJobKnowledge == "") {
      this.toastr.errorToastr('Please Rate Job Knowledge', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.rateWorkQlty == undefined || this.rateWorkQlty == "") {
      this.toastr.errorToastr('Please Rate Work Quality', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.rateAttendance == undefined || this.rateAttendance == "") {
      this.toastr.errorToastr('Please Rate Attendance', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.rateCommunication == undefined || this.rateCommunication == "") {
      this.toastr.errorToastr('Please Rate Communication', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.rateDependability == undefined || this.rateDependability == "") {
      this.toastr.errorToastr('Please Rate Dependability', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {

      var duplicateChk = false;

      for (var i = 0; i < this.reviewsList.length; i++) {
        if (this.reviewsList[i].EmployeeName == this.employeeName) {
          duplicateChk = true;
        }
      }

      if (duplicateChk == true) {
        this.toastr.errorToastr('Review have already exists.', 'Error', { toastTimeout: (2500) });
        return false;
      }
      else {

        //var dataList = [];
        //dataList = this.subjectList.filter(x => x.value == this.ddlSubject);

        this.reviewsList.push({
          ReviewDate: this.reviewDate,
          EmployeeName: this.employeeName,
          RateJobKnowledge: this.rateJobKnowledge,
          RateWorkQlty: this.rateWorkQlty,
          RateAttendance: this.rateAttendance,
          RateCommunication: this.rateCommunication,
          RateDependability: this.rateDependability,
        });
      }
      this.clearReviews();
    }
  }

  removeReviews(item) {
    this.reviewsList.splice(item, 1);
  }


  //* add goals / projects
  addGoals() {
    if (this.startDate == undefined || this.startDate == "") {
      this.toastr.errorToastr('Please Enter Start Date', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.finishDate == undefined || this.finishDate == "") {
      this.toastr.errorToastr('Please Enter Completion Date', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.projectDesc == undefined || this.projectDesc == "") {
      this.toastr.errorToastr('Please Enter Project description', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.rateEmpAssessment == undefined || this.rateEmpAssessment == "") {
      this.toastr.errorToastr('Please Rate Employee Assessment', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.supervisorName == undefined || this.supervisorName == "") {
      this.toastr.errorToastr('Please Select Supervisor Name', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.rateSprvsrAssessment == undefined || this.rateSprvsrAssessment == "") {
      this.toastr.errorToastr('Please Rate Supervisor Assessment', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {

      var duplicateChk = false;

      for (var i = 0; i < this.projectsList.length; i++) {
        if (this.projectsList[i].SupervisorName == this.supervisorName) {
          duplicateChk = true;
        }
      }

      if (duplicateChk == true) {
        this.toastr.errorToastr('Project have already exists.', 'Error', { toastTimeout: (2500) });
        return false;
      }
      else {

        for (var i = 0; i < this.supervisorList.length; i++) {
          if (this.supervisorName == this.supervisorList[i].indvdlID) {
            this.supervisor = this.supervisorList[i].indvdlFirstName;
          }
          //this.supervisor = this.supervisorList[i].indvdlFirstName;

          //alert('Supervisor Name: ' + this.supervisor);

        }

        //var dataList = [];
        //dataList = this.subjectList.filter(x => x.value == this.ddlSubject);

        this.projectsList.push({
          StartDate: this.startDate,
          FinishDate: this.finishDate,
          ProjectDesc: this.projectDesc,
          RateEmpAssessment: this.rateEmpAssessment,
          Supervisor: this.supervisor, // To Display supervisor name
          SupervisorName: this.supervisorName,
          RateSprvsrAssessment: this.rateSprvsrAssessment
        });
      }
      this.clearProjects();
    }
  }

  removeGoals(item) {
    this.projectsList.splice(item, 1);
  }


  //* add skills
  addSkills() {
    alert(this.skillDate);
    if (this.skillDate == undefined || this.skillDate == "") {
      this.toastr.errorToastr('Please Select Date', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.skillCriteriaCd == undefined || this.skillCriteriaCd == "") {
      this.toastr.errorToastr('Please Select Skill', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.rateSkillLevel == undefined || this.rateSkillLevel == "") {
      this.toastr.errorToastr('Please Rate Achieved', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.skillRemarks == undefined || this.skillRemarks == "") {
      this.toastr.errorToastr('Please Enter Skill Remarks', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {

      var duplicateChk = false;

      for (var i = 0; i < this.skillsList.length; i++) {
        if (this.skillsList[i].skillCriteriaCd == this.skillCriteriaCd) {
          duplicateChk = true;
        }
      }

      if (duplicateChk == true) {
        this.toastr.errorToastr('Skill have already exists.', 'Error', { toastTimeout: (2500) });
        return false;
      }
      else {

        //var dataList = [];
        //dataList = this.subjectList.filter(x => x.value == this.ddlSubject);

        for (var i = 0; i < this.skillsNameList.length; i++) {
          if (this.skillCriteriaCd == this.skillsNameList[i].qlfctnCriteriaCd) {
            this.qlfctnSkillName = this.skillsNameList[i].qlfctnCriteriaName;
            this.skillCd = this.skillsNameList[i].qlfctnCd;
            this.skillTypeCd = this.skillsNameList[i].qlfctnTypeCd;
          }
        }

        //alert("skill Name:" + this.qlfctnSkillName);

        this.skillsList.push({
          //IndvdlID: this.employeeName,
          SkillDate: this.skillDate,
          QlfctnSkillName: this.qlfctnSkillName,
          SkillCd: this.skillCd,
          SkillTypeCd: this.skillTypeCd,
          SkillCriteriaCd: this.skillCriteriaCd,
          RateSkillLevel: this.rateSkillLevel,
          SkillRemarks: this.skillRemarks
        });

      }

      this.clearSkills();
    }
  }

  removeSkills(item) {
    this.skillsList.splice(item, 1);
  }

  //**************************************---- Edit Functions -----*********************************/

  editProjects(item) {
    this.employeeName = item.IndvdlID;
    this.startDate = item.StartDate;
    this.finishDate = item.FinishDate;
    this.projectDesc = item.ProjectDesc;
    this.rateEmpAssessment = item.RateEmpAssessment;
    this.supervisorName = item.SupervisorName;
    this.rateSprvsrAssessment = item.RateSprvsrAssessment;
    this.companyId = item.CmpnyID;
    this.jobDesigId = item.JobDesigID;
  }


  editSkills(item) {

    // var dt = new Date();
    // alert(this.datepipe.transform(item.SkillDate, 'MM-dd-yyyy'))
    // alert("Before ");
    // alert("employeeName " + item.IndvdlID);
    // alert("skillTypeCd " + item.SkillTypeCd);
    // alert("skillCd " + item.SkillCd);
    // alert("skillCriteriaCd " + item.SkillCriteriaCd);
    alert("skillDate " + item.SkillDate.toString('MM-dd-yyyy'));

    // alert("rateSkillLevel " + item.RateSkillLevel);
    // alert("skillRemarks " + item.SkillRemarks);

    // alert("After ");

    this.employeeName = item.IndvdlID;
    this.skillTypeCd = item.SkillTypeCd;
    this.skillCd = item.SkillCd;
    this.skillCriteriaCd = item.SkillCriteriaCd;
    //this.skillDate = item.SkillDate.toString('MM-dd-yyyy');
    this.skillDate = item.SkillDate;
    this.rateSkillLevel = item.RateSkillLevel;
    this.skillRemarks = item.SkillRemarks;
  }

  //**************************************---- Save Functions -----*********************************/

  // save reviews
  saveReviews() {
    if (this.employeeName == undefined || this.employeeName == "") {
      this.toastr.errorToastr('Please Select Employee', 'Error', { toastTimeout: (2500) });
      return false;
    }

    else if (this.reviewsList.length == 0) {
      this.toastr.errorToastr('Please Enter Review Detail', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {

      if (this.employeeName != '') {

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

        alert(' Before Save Data Reviews');

        //* ********************************************save data 
        var saveData = {
          "ReviewsList": JSON.stringify(this.reviewsList),
          "ConnectedUser": "12000",
          "DelFlag": 0
        };
        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        alert('Before Request Header Reviews');

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveReviews', saveData, { headers: reqHeader }).subscribe((data: any) => {

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

        alert('result reviews');

      }
    }
    // this.toastr.successToastr('Reviews saved successfully', 'Success', { toastTimeout: (2500) });
    // return false;
  }

  // save project
  saveProjects() {

    // get the value of jobDesigId and companyId
    for (let i = 0; i < this.newEmployeeList.length; i++) {
      if (this.employeeName == this.newEmployeeList[i].indvdlID) {
        this.jobDesigId = this.newEmployeeList[i].jobDesigID;
        this.companyId = this.newEmployeeList[i].cmpnyID;
      }
    }

    if (this.employeeName == undefined || this.employeeName == "") {
      this.toastr.errorToastr('Please Select Employee', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.projectsList.length == 0) {
      this.toastr.errorToastr('Please Enter Projects Detail', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {

      if (this.supervisorName != '') {

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
          "indvdlId": this.employeeName,
          "jobDesigId": this.jobDesigId,
          "cmpnyId": this.companyId,
          "projectsList": JSON.stringify(this.projectsList),
          "ConnectedUser": "12000",
          "DelFlag": 0
        };
        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveProjects', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg != "Record Saved Successfully!") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (5000) });
            return false;
          } else {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            //$('#standardModal').modal('hide');
            //this.getPStandard();
            //this.getSkillsPerformanceData();
            this.projectsList = [];
            return false;
          }
        });
      }
    }
    // this.toastr.successToastr('Goals saved successfully', 'Success', { toastTimeout: (2500) });
    // return false;
  }

  // save skills
  saveSkills() {
    if (this.employeeName == undefined || this.employeeName == "") {
      this.toastr.errorToastr('Please Select Employee', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.skillsList.length < 0 || this.skillsList.length == 0) {
      this.toastr.errorToastr('Please Enter Skills Detail', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {

      //if (this.skillCriteriaCd != '' && this.employeeName != '') {
      if (this.employeeName != '' && this.skillCriteriaCd != '') {

        //alert("update called");

        // //this.app.showSpinner();
        // // this.app.hideSpinner();
        // //* ********************************************update data 
        var updateData = {
          "indvdlID": this.employeeName,
          "skillsList": JSON.stringify(this.skillsList),
          "ConnectedUser": "12000",
          "DelFlag": 0
        };

        // //var token = localStorage.getItem(this.tokenKey);

        // //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
        //alert("update called 2");

        this.http.put(this.serverUrl + 'api/updateSkills', updateData, { headers: reqHeader }).subscribe((data: any) => {
          alert(data.msg);

          if (data.msg == 'Record Updated Successfully!') {

            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.skillsList = [];
            alert('Success');
            this.getSkillsPerformanceData();
            this.tempListSkillsPerformanceData(this.tempIndvdlId);

            return false;

          }
          else if (data.msg == "Update - Record Already Exists!") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.skillsList = [];
            this.getSkillsPerformanceData();
            this.tempListSkillsPerformanceData(this.tempIndvdlId);

            return false;
          }
          else {

            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.skillsList = [];
            alert('Error');
            this.getSkillsPerformanceData();
            this.tempListSkillsPerformanceData(this.tempIndvdlId);
            //this.skillsList = [];
            return false;
          }
        });

      }
      else {

        //* ********************************************save data 
        var saveData = {
          "indvdlID": this.employeeName,
          "skillsList": JSON.stringify(this.skillsList),
          "ConnectedUser": "12000",
          "DelFlag": 0
        };
        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveSkills', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == 'Record Saved Successfully!') {

            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });

            this.skillsList = [];
            alert('Save Success');
            this.getSkillsPerformanceData();

            return false;

          }
          else if (data.msg == "Insert - Record Already Exists!") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.skillsList = [];
            alert('Save Error 1');
            this.getSkillsPerformanceData();
            return false;
          }
          else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.skillsList = [];
            alert('Save Error 2');
            this.getSkillsPerformanceData();
            return false;
          }
        });
      }
    }

    // this.toastr.successToastr('Skills saved successfully', 'Success', { toastTimeout: (2500) });
    // return false;
  }


  //**************************************---- Delete Functions -----*********************************/
  // get the "ids" of the delete entry 
  deleteReviews(item) { }

  // get the "ids" of the delete entry   
  deleteProjects(item) {
    this.clearProjects();
    this.dProjectsId = item.employeeName;
    this.skillCriteriaCd = item.skillCriteriaCd;
  }

  // get the "ids" of the delete entry 
  deleteSkills(item) {
    this.clearSkills();
    this.dSkillsId = item.employeeName;
    this.skillCriteriaCd = item.skillCriteriaCd;

  }

  // delete for all Reviews, Projects, Skills
  delete() {
    if (this.userPassword == "") {
      this.toastr.errorToastr('Please Enter Password', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.userPINCode == "") {
      this.toastr.errorToastr('Please Enter PIN Code', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {
      //*--- For Reviews
      //------------------------

      //*--- For Projects
      //------------------------

      //*--- For Skills
      if (this.dSkillsId != "") {

        var data = {
          "indvdlID": this.employeeName,
          "skillsList": JSON.stringify(this.skillsList),
          "ConnectedUser": "12000",
          "DelFlag": 0
        };

        //var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.put(this.serverUrl + 'api/deleteSkills', data, { headers: reqHeader }).subscribe((data: any) => {

          //alert(data.msg);

          if (data.msg == "Record Deleted Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clearSkills();
            $('#deleteModal').modal('hide');
            this.getSkillsPerformanceData();
            return false;
          }
          else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          }

        });
      }
    }//else ends
  }



  //**************************************---- Clear Functions -----*********************************/

  // clear reviews
  clearReviews() {
    this.reviewDate = '';
    this.employeeName = '';
    this.rateJobKnowledge = '';
    this.rateWorkQlty = '';
    this.rateAttendance = '';
    this.rateCommunication = '';
    this.rateDependability = '';

    this.empGrade = '';
    this.empDesignation = '';
  }


  // clear goals
  clearProjects() {
    this.startDate = '';
    this.finishDate = '';
    this.projectDesc = '';
    this.rateEmpAssessment = '';
    this.supervisorName = '';
    this.rateSprvsrAssessment = '';
  }


  // clear skills
  clearSkills() {
    this.skillDate = '';
    this.skillCd = '';
    this.skillTypeCd = '';
    this.skillCriteriaCd = '';
    this.rateSkillLevel = '';
    this.skillRemarks = '';
  }


  // clear all fields
  clearAll() {
    //reviews
    this.reviewDate = '';
    this.employeeName = '';
    this.rateJobKnowledge = '';
    this.rateWorkQlty = '';
    this.rateAttendance = '';
    this.rateCommunication = '';
    this.rateDependability = '';

    //goals
    this.startDate = '';
    this.finishDate = '';
    this.projectDesc = '';
    this.rateEmpAssessment = '';
    this.supervisorName = '';
    this.rateSprvsrAssessment = '';

    //skills
    this.skillDate = '';
    this.skillCriteriaCd = '';
    this.rateSkillLevel = '';
    this.skillRemarks = '';
  }

  //function for sorting/orderBy table data 
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }



  //*--------------------------- Reviews

  printDivReviews() {

    var printCss = this.app.printCSS();

    //printCss = printCss + "";

    var contents = $("#printAreaReviews").html();

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

  // PDF Function
  downloadPDFReviews() {

    //var path = '/src/assets/images/logo.png';
    //var type = path
    // var encoded = $("#myImg").html();

    //alert(encoded.value);

    //*------------------------------ Start
    // this.toDataURL('/src/assets/images/logo.jpg', function (dataURL) {
    //   // do something with dataURL
    //   document.getElementById('result').innerHTML = dataURL;
    // });
    //*------------------------------ End


    // var resultData = $('result').html();
    // alert('base 64: ' + resultData);


    var printCss = this.app.printCSS();

    var doc = new jsPDF();
    var totalPagesExp = "{total_pages_count_string}";

    //var name = 'Pakistan';


    var img = "data:image/png;base64,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";


    doc.autoTable({
      //head: headRows(),
      //body: bodyRows(40),
      didDrawPage: function (data) {

        if (img) {
          doc.addImage(img, 'JPEG', 23, 18, 35, 10);
        }

        // Header
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('bold');
        doc.text("Infovative Solutions ", 105, 20);

        doc.setFontSize(10);
        doc.setFontStyle('normal');
        doc.text("Office # 8,9, 3rd Floor Anayat Plaza, G11 Markaz Islamabad.", 80, 25);

        doc.setFontSize(10);
        doc.setFontStyle('normal');
        doc.text("Mobile: 0313-1234567, Ph. 051-5544661", 95, 30);


        //doc.text({ html: '#number' }, data.settings.margin.center + 15, 22);
        //doc.text("Report", data.settings.margin.center + "<style>" + printCss + "</style>");


        //Content
        //doc.autoTable({ html: '#content' });

        // Footer
        var str = "Page " + doc.internal.getNumberOfPages()
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + " of " + totalPagesExp;
        }
        doc.setFontSize(10);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
      startY: 40,
      //margin: { top: 180 },
      html: '#contentReview',
      theme: 'plain',
      styles: {
        lineColor: 40,
        lineWidth: 0.2,
        cellWidth: 'auto',
      },

      // headStyles: [{
      //   styles: {
      //     lineWidth: 2,
      //   },
      // }]

    });

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save('table.pdf');


    //*-----------------working--------------------
    // const doc = new jsPDF();
    // doc.autoTable({ html: '#content' });
    // doc.save('table.pdf');

    //*-------------------------------------

  }

  downloadCSVReviews() {
    //alert('CSV works');
    // case 1: When tblSearch is empty then assign full data list
    if (this.tblSearchReviews == "") {
      var completeDataList = [];
      for (var i = 0; i < this.reviewsList.length; i++) {
        //alert(this.tblSearchType + " - " + this.skillCriteriaList[i].departmentName)
        completeDataList.push({
          ReviewDate: this.reviewsList[i].ReviewDate,
          EmployeeName: this.reviewsList[i].EmployeeName,
          RateJobKnowledge: this.reviewsList[i].RateJobKnowledge,
          RateWorkQlty: this.reviewsList[i].RateWorkQlty,
          RateAttendance: this.reviewsList[i].RateAttendance,
          RateCommunication: this.reviewsList[i].RateCommunication,
          RateDependability: this.reviewsList[i].RateDependability
        });
      }
      this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("ReviewsCompleteCSV", CsvFileTypes.CSV));
    }
    // case 2: When tblSearchType is not empty then assign new data list
    else if (this.tblSearchReviews != "") {
      var filteredDataList = [];
      for (var i = 0; i < this.reviewsList.length; i++) {
        if (this.reviewsList[i].EmployeeName.toUpperCase().includes(this.tblSearchReviews.toUpperCase())) {
          filteredDataList.push({
            ReviewDate: this.reviewsList[i].ReviewDate,
            EmployeeName: this.reviewsList[i].EmployeeName,
            RateJobKnowledge: this.reviewsList[i].RateJobKnowledge,
            RateWorkQlty: this.reviewsList[i].RateWorkQlty,
            RateAttendance: this.reviewsList[i].RateAttendance,
            RateCommunication: this.reviewsList[i].RateCommunication,
            RateDependability: this.reviewsList[i].RateDependability
          });
        }
      }

      if (filteredDataList.length > 0) {
        this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("ReviewsFilterCSV", CsvFileTypes.CSV));
      } else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }

  downloadExcelReviews() {
    //alert('Excel works');
    // case 1: When tblSearchType is empty then assign full data list
    if (this.tblSearchReviews == "") {
      //var completeDataList = [];
      for (var i = 0; i < this.reviewsList.length; i++) {
        this.excelDataListReviews.push({
          ReviewDate: this.reviewsList[i].ReviewDate,
          EmployeeName: this.reviewsList[i].EmployeeName,
          RateJobKnowledge: this.reviewsList[i].RateJobKnowledge,
          RateWorkQlty: this.reviewsList[i].RateWorkQlty,
          RateAttendance: this.reviewsList[i].RateAttendance,
          RateCommunication: this.reviewsList[i].RateCommunication,
          RateDependability: this.reviewsList[i].RateDependability
        });
      }
      this.excelExportService.export(this.excelDataContentReviews, new IgxExcelExporterOptions("ReviewsCompleteExcel"));
      this.excelDataListReviews = [];
    }
    // case 2: When tblSearchType is not empty then assign new data list
    else if (this.tblSearchReviews != "") {
      for (var i = 0; i < this.reviewsList.length; i++) {
        if (this.reviewsList[i].EmployeeName.toUpperCase().includes(this.tblSearchReviews.toUpperCase())) {
          this.excelDataListReviews.push({
            ReviewDate: this.reviewsList[i].ReviewDate,
            EmployeeName: this.reviewsList[i].EmployeeName,
            RateJobKnowledge: this.reviewsList[i].RateJobKnowledge,
            RateWorkQlty: this.reviewsList[i].RateWorkQlty,
            RateAttendance: this.reviewsList[i].RateAttendance,
            RateCommunication: this.reviewsList[i].RateCommunication,
            RateDependability: this.reviewsList[i].RateDependability
          });
        }
      }

      if (this.excelDataListReviews.length > 0) {
        //alert("Filter List " + this.excelDataList.length);

        this.excelExportService.export(this.excelDataContentReviews, new IgxExcelExporterOptions("ReviewsFilterExcel"));
        this.excelDataListReviews = [];
      }
      else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }


  //*--------------------------- Projects

  printDivGoals() {
    // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    // var cssAddress = ".cssAddress {font-size: 16px; }";
    // var cssContact = ".cssContact {font-size: 16px; }";

    // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

    var printCss = this.app.printCSS();


    //printCss = printCss + "";

    var contents = $("#printAreaGoals").html();

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

  // PDF Function
  downloadPDFGoals() {

    //var path = '/src/assets/images/logo.png';
    //var type = path
    // var encoded = $("#myImg").html();

    //alert(encoded.value);

    //*------------------------------ Start
    // this.toDataURL('/src/assets/images/logo.jpg', function (dataURL) {
    //   // do something with dataURL
    //   document.getElementById('result').innerHTML = dataURL;
    // });
    //*------------------------------ End


    // var resultData = $('result').html();
    // alert('base 64: ' + resultData);


    var printCss = this.app.printCSS();

    var doc = new jsPDF();
    var totalPagesExp = "{total_pages_count_string}";

    //var name = 'Pakistan';


    var img = "data:image/png;base64,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";


    doc.autoTable({
      //head: headRows(),
      //body: bodyRows(40),
      didDrawPage: function (data) {

        if (img) {
          doc.addImage(img, 'JPEG', 23, 18, 35, 10);
        }

        // Header
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('bold');
        doc.text("Infovative Solutions ", 105, 20);

        doc.setFontSize(10);
        doc.setFontStyle('normal');
        doc.text("Office # 8,9, 3rd Floor Anayat Plaza, G11 Markaz Islamabad.", 80, 25);

        doc.setFontSize(10);
        doc.setFontStyle('normal');
        doc.text("Mobile: 0313-1234567, Ph. 051-5544661", 95, 30);


        //doc.text({ html: '#number' }, data.settings.margin.center + 15, 22);
        //doc.text("Report", data.settings.margin.center + "<style>" + printCss + "</style>");


        //Content
        //doc.autoTable({ html: '#content' });

        // Footer
        var str = "Page " + doc.internal.getNumberOfPages()
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + " of " + totalPagesExp;
        }
        doc.setFontSize(10);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
      startY: 40,
      //margin: { top: 180 },
      html: '#contentGoal',
      theme: 'plain',
      styles: {
        lineColor: 40,
        lineWidth: 0.2,
        cellWidth: 'auto',
      },

      // headStyles: [{
      //   styles: {
      //     lineWidth: 2,
      //   },
      // }]

    });

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save('table.pdf');


    //*-----------------working--------------------
    // const doc = new jsPDF();
    // doc.autoTable({ html: '#content' });
    // doc.save('table.pdf');

    //*-------------------------------------

  }

  downloadCSVGoals() {
    //alert('CSV works');
    // case 1: When tblSearch is empty then assign full data list
    if (this.tblSearchGoals == "") {
      var completeDataList = [];
      for (var i = 0; i < this.projectsList.length; i++) {
        //alert(this.tblSearchType + " - " + this.skillCriteriaList[i].departmentName)
        completeDataList.push({
          startDate: this.projectsList[i].startDate,
          finishDate: this.projectsList[i].finishDate,
          projectDesc: this.projectsList[i].projectDesc,
          RateEmpAssessment: this.projectsList[i].RateEmpAssessment,
          SupervisorName: this.projectsList[i].SupervisorName,
          RateSprvsrAssessment: this.projectsList[i].RateSprvsrAssessment
        });
      }
      this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("GoalsCompleteCSV", CsvFileTypes.CSV));
    }
    // case 2: When tblSearchType is not empty then assign new data list
    else if (this.tblSearchGoals != "") {
      var filteredDataList = [];
      for (var i = 0; i < this.projectsList.length; i++) {
        if (this.projectsList[i].SupervisorName.toUpperCase().includes(this.tblSearchGoals.toUpperCase())) {
          filteredDataList.push({
            startDate: this.projectsList[i].startDate,
            finishDate: this.projectsList[i].finishDate,
            projectDesc: this.projectsList[i].projectDesc,
            RateEmpAssessment: this.projectsList[i].RateEmpAssessment,
            SupervisorName: this.projectsList[i].SupervisorName,
            RateSprvsrAssessment: this.projectsList[i].RateSprvsrAssessment
          });
        }
      }

      if (filteredDataList.length > 0) {
        this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("GoalsFilterCSV", CsvFileTypes.CSV));
      } else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }

  downloadExcelGoals() {
    //alert('Excel works');
    // case 1: When tblSearchType is empty then assign full data list
    if (this.tblSearchGoals == "") {
      //var completeDataList = [];
      for (var i = 0; i < this.projectsList.length; i++) {
        this.excelDataListGoals.push({
          startDate: this.projectsList[i].startDate,
          finishDate: this.projectsList[i].finishDate,
          projectDesc: this.projectsList[i].projectDesc,
          RateEmpAssessment: this.projectsList[i].RateEmpAssessment,
          SupervisorName: this.projectsList[i].SupervisorName,
          RateSprvsrAssessment: this.projectsList[i].RateSprvsrAssessment
        });
      }
      this.excelExportService.export(this.excelDataContentGoals, new IgxExcelExporterOptions("GoalsCompleteExcel"));
      this.excelDataListGoals = [];
    }
    // case 2: When tblSearchType is not empty then assign new data list
    else if (this.tblSearchGoals != "") {
      for (var i = 0; i < this.projectsList.length; i++) {
        if (this.projectsList[i].SupervisorName.toUpperCase().includes(this.tblSearchGoals.toUpperCase())) {
          this.excelDataListGoals.push({
            startDate: this.projectsList[i].startDate,
            finishDate: this.projectsList[i].finishDate,
            projectDesc: this.projectsList[i].projectDesc,
            RateEmpAssessment: this.projectsList[i].RateEmpAssessment,
            SupervisorName: this.projectsList[i].SupervisorName,
            RateSprvsrAssessment: this.projectsList[i].RateSprvsrAssessment
          });
        }
      }

      if (this.excelDataListGoals.length > 0) {
        //alert("Filter List " + this.excelDataList.length);

        this.excelExportService.export(this.excelDataContentGoals, new IgxExcelExporterOptions("GoalsFilterExcel"));
        this.excelDataListGoals = [];
      }
      else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }


  //*--------------------------- Skills

  printDivSkills() {
    // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    // var cssAddress = ".cssAddress {font-size: 16px; }";
    // var cssContact = ".cssContact {font-size: 16px; }";

    // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

    var printCss = this.app.printCSS();


    //printCss = printCss + "";

    var contents = $("#printAreaSkills").html();

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

  // PDF Function
  downloadPDFSkills() {

    //var path = '/src/assets/images/logo.png';
    //var type = path
    // var encoded = $("#myImg").html();

    //alert(encoded.value);

    //*------------------------------ Start
    // this.toDataURL('/src/assets/images/logo.jpg', function (dataURL) {
    //   // do something with dataURL
    //   document.getElementById('result').innerHTML = dataURL;
    // });
    //*------------------------------ End


    // var resultData = $('result').html();
    // alert('base 64: ' + resultData);


    var printCss = this.app.printCSS();

    var doc = new jsPDF();
    var totalPagesExp = "{total_pages_count_string}";

    //var name = 'Pakistan';


    var img = "data:image/png;base64,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";


    doc.autoTable({
      //head: headRows(),
      //body: bodyRows(40),
      didDrawPage: function (data) {

        if (img) {
          doc.addImage(img, 'JPEG', 23, 18, 35, 10);
        }

        // Header
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('bold');
        doc.text("Infovative Solutions ", 105, 20);

        doc.setFontSize(10);
        doc.setFontStyle('normal');
        doc.text("Office # 8,9, 3rd Floor Anayat Plaza, G11 Markaz Islamabad.", 80, 25);

        doc.setFontSize(10);
        doc.setFontStyle('normal');
        doc.text("Mobile: 0313-1234567, Ph. 051-5544661", 95, 30);


        //doc.text({ html: '#number' }, data.settings.margin.center + 15, 22);
        //doc.text("Report", data.settings.margin.center + "<style>" + printCss + "</style>");


        //Content
        //doc.autoTable({ html: '#content' });

        // Footer
        var str = "Page " + doc.internal.getNumberOfPages()
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + " of " + totalPagesExp;
        }
        doc.setFontSize(10);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
      startY: 40,
      //margin: { top: 180 },
      html: '#contentSkill',
      theme: 'plain',
      styles: {
        lineColor: 40,
        lineWidth: 0.2,
        cellWidth: 'auto',
      },

      // headStyles: [{
      //   styles: {
      //     lineWidth: 2,
      //   },
      // }]

    });

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save('table.pdf');


    //*-----------------working--------------------
    // const doc = new jsPDF();
    // doc.autoTable({ html: '#content' });
    // doc.save('table.pdf');

    //*-------------------------------------

  }

  downloadCSVSkills() {
    //alert('CSV works');
    // case 1: When tblSearch is empty then assign full data list
    if (this.tblSearchSkills == "") {
      var completeDataList = [];
      for (var i = 0; i < this.skillsList.length; i++) {
        //alert(this.tblSearchType + " - " + this.skillCriteriaList[i].departmentName)
        completeDataList.push({
          SkillDate: this.skillsList[i].SkillDate,
          skillCriteriaCd: this.skillsList[i].skillCriteriaCd,
          rateSkillLevel: this.skillsList[i].rateSkillLevel,
          SkillRemarks: this.skillsList[i].skillRemarks
        });
      }
      this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("SkillsCompleteCSV", CsvFileTypes.CSV));
    }
    // case 2: When tblSearchType is not empty then assign new data list
    else if (this.tblSearchSkills != "") {
      var filteredDataList = [];
      for (var i = 0; i < this.skillsList.length; i++) {
        if (this.skillsList[i].SkillName.toUpperCase().includes(this.tblSearchSkills.toUpperCase())) {
          filteredDataList.push({
            SkillDate: this.skillsList[i].SkillDate,
            skillCriteriaCd: this.skillsList[i].skillCriteriaCd,
            rateSkillLevel: this.skillsList[i].rateSkillLevel,
            SkillRemarks: this.skillsList[i].skillRemarks
          });
        }
      }

      if (filteredDataList.length > 0) {
        this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("SkillsFilterCSV", CsvFileTypes.CSV));
      } else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }

  downloadExcelSkills() {
    //alert('Excel works');
    // case 1: When tblSearchType is empty then assign full data list
    if (this.tblSearchSkills == "") {
      //var completeDataList = [];
      for (var i = 0; i < this.skillsList.length; i++) {
        this.excelDataListSkills.push({
          SkillDate: this.skillsList[i].SkillDate,
          skillCriteriaCd: this.skillsList[i].skillCriteriaCd,
          rateSkillLevel: this.skillsList[i].rateSkillLevel,
          SkillRemarks: this.skillsList[i].skillRemarks
        });
      }
      this.excelExportService.export(this.excelDataContentSkills, new IgxExcelExporterOptions("SkillsCompleteExcel"));
      this.excelDataListSkills = [];
    }
    // case 2: When tblSearchType is not empty then assign new data list
    else if (this.tblSearchSkills != "") {
      for (var i = 0; i < this.skillsList.length; i++) {
        if (this.skillsList[i].skillCriteriaCd.toUpperCase().includes(this.tblSearchSkills.toUpperCase())) {
          this.excelDataListSkills.push({
            SkillDate: this.skillsList[i].SkillDate,
            skillCriteriaCd: this.skillsList[i].skillCriteriaCd,
            rateSkillLevel: this.skillsList[i].rateSkillLevel,
            SkillRemarks: this.skillsList[i].skillRemarks
          });
        }
      }

      if (this.excelDataListSkills.length > 0) {
        //alert("Filter List " + this.excelDataList.length);

        this.excelExportService.export(this.excelDataContentSkills, new IgxExcelExporterOptions("SkillsFilterExcel"));
        this.excelDataListSkills = [];
      }
      else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }


}
