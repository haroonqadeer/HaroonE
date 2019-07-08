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

declare var $: any;

@Component({
  selector: 'app-performance-eva',
  templateUrl: './performance-eva.component.html',
  styleUrls: ['./performance-eva.component.scss']
})
export class PerformanceEvaComponent implements OnInit {

  serverUrl = "https://localhost:8008/";
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

  //* Goals Tab NgModels
  goalsList = [];
  setDate = '';
  completionDate = '';
  goalDescription = '';
  rateEmpAssessment: any;
  supervisorName: '';
  rateSprvsrAssessment: any;

  //* Skills Tab NgModels
  skillsList = [];
  skillDate = '';
  skillName = '';
  rateAchvdLevel: any;
  skillHistoryDescription: '';

  userId = '';
  userName = '';
  userJobDesignationId = '';
  userBPS = '';
  userManagerId = '';


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


  empChange(item) {
    for (let i = 0; i < this.newEmployeeList.length; i++) {
      if (item.value == this.newEmployeeList[i].indvdlID) {
        this.empDesignation = this.newEmployeeList[i].jobDesigName;
        this.empGrade = this.newEmployeeList[i].payGradeName;
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


  //* add goals
  addGoals() {
    if (this.setDate == undefined || this.setDate == "") {
      this.toastr.errorToastr('Please Set Date', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.completionDate == undefined || this.completionDate == "") {
      this.toastr.errorToastr('Please Completion Date', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.goalDescription == undefined || this.goalDescription == "") {
      this.toastr.errorToastr('Please Enter Goal description', 'Error', { toastTimeout: (2500) });
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

      for (var i = 0; i < this.goalsList.length; i++) {
        if (this.goalsList[i].SupervisorName == this.supervisorName) {
          duplicateChk = true;
        }
      }

      if (duplicateChk == true) {
        this.toastr.errorToastr('Goal have already exists.', 'Error', { toastTimeout: (2500) });
        return false;
      }
      else {

        //var dataList = [];
        //dataList = this.subjectList.filter(x => x.value == this.ddlSubject);

        this.goalsList.push({
          SetDate: this.setDate,
          CompletionDate: this.completionDate,
          GoalDescription: this.goalDescription,
          RateEmpAssessment: this.rateEmpAssessment,
          SupervisorName: this.supervisorName,
          RateSprvsrAssessment: this.rateSprvsrAssessment
        });
      }
      this.clearGoals();
    }
  }

  removeGoals(item) {
    this.goalsList.splice(item, 1);
  }


  //* add skills
  addSkills() {
    if (this.skillDate == undefined || this.skillDate == "") {
      this.toastr.errorToastr('Please Select Date', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.skillName == undefined || this.skillName == "") {
      this.toastr.errorToastr('Please Select Skill', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.rateAchvdLevel == undefined || this.rateAchvdLevel == "") {
      this.toastr.errorToastr('Please Rate Achieved', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.skillHistoryDescription == undefined || this.skillHistoryDescription == "") {
      this.toastr.errorToastr('Please Enter Skill history', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {

      var duplicateChk = false;

      for (var i = 0; i < this.skillsList.length; i++) {
        if (this.skillsList[i].SkillName == this.skillName) {
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

        this.skillsList.push({
          SkillDate: this.skillDate,
          SkillName: this.skillName,
          RateAchvdLevel: this.rateAchvdLevel,
          SkillHistoryDescription: this.skillHistoryDescription
        });
      }
      this.clearSkills();
    }
  }

  removeSkills(item) {
    this.skillsList.splice(item, 1);
  }

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

  // save goals
  saveGoals() {

    if (this.employeeName == undefined || this.employeeName == "") {
      this.toastr.errorToastr('Please Select Employee', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.goalsList.length == 0) {
      this.toastr.errorToastr('Please Enter Goals Detail', 'Error', { toastTimeout: (2500) });
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
          "GoalsList": JSON.stringify(this.goalsList),
          "ConnectedUser": "12000",
          "DelFlag": 0
        };
        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveGoals', saveData, { headers: reqHeader }).subscribe((data: any) => {

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
    // this.toastr.successToastr('Goals saved successfully', 'Success', { toastTimeout: (2500) });
    // return false;
  }

  // save skills
  saveSkills() {
    if (this.employeeName == undefined || this.employeeName == "") {
      this.toastr.errorToastr('Please Select Employee', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.skillsList.length == 0) {
      this.toastr.errorToastr('Please Enter Goals Detail', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {

      if (this.skillName != '') {

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
          "SkillsList": JSON.stringify(this.skillsList),
          "ConnectedUser": "12000",
          "DelFlag": 0
        };
        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveSkills', saveData, { headers: reqHeader }).subscribe((data: any) => {

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

    // this.toastr.successToastr('Skills saved successfully', 'Success', { toastTimeout: (2500) });
    // return false;
  }


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
  clearGoals() {
    this.setDate = '';
    this.completionDate = '';
    this.goalDescription = '';
    this.rateEmpAssessment = '';
    this.supervisorName = '';
    this.rateSprvsrAssessment = '';
  }


  // clear skills
  clearSkills() {
    this.skillDate = '';
    this.skillName = '';
    this.rateAchvdLevel = '';
    this.skillHistoryDescription = '';
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
    this.setDate = '';
    this.completionDate = '';
    this.goalDescription = '';
    this.rateEmpAssessment = '';
    this.supervisorName = '';
    this.rateSprvsrAssessment = '';

    //skills
    this.skillDate = '';
    this.skillName = '';
    this.rateAchvdLevel = '';
    this.skillHistoryDescription = '';
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

  downloadPDFReviews() { }

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


  //*--------------------------- Goals

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

  downloadPDFGoals() { }

  downloadCSVGoals() {
    //alert('CSV works');
    // case 1: When tblSearch is empty then assign full data list
    if (this.tblSearchGoals == "") {
      var completeDataList = [];
      for (var i = 0; i < this.goalsList.length; i++) {
        //alert(this.tblSearchType + " - " + this.skillCriteriaList[i].departmentName)
        completeDataList.push({
          SetDate: this.goalsList[i].SetDate,
          CompletionDate: this.goalsList[i].CompletionDate,
          GoalDescription: this.goalsList[i].GoalDescription,
          RateEmpAssessment: this.goalsList[i].RateEmpAssessment,
          SupervisorName: this.goalsList[i].SupervisorName,
          RateSprvsrAssessment: this.goalsList[i].RateSprvsrAssessment
        });
      }
      this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("GoalsCompleteCSV", CsvFileTypes.CSV));
    }
    // case 2: When tblSearchType is not empty then assign new data list
    else if (this.tblSearchGoals != "") {
      var filteredDataList = [];
      for (var i = 0; i < this.goalsList.length; i++) {
        if (this.goalsList[i].SupervisorName.toUpperCase().includes(this.tblSearchGoals.toUpperCase())) {
          filteredDataList.push({
            SetDate: this.goalsList[i].SetDate,
            CompletionDate: this.goalsList[i].CompletionDate,
            GoalDescription: this.goalsList[i].GoalDescription,
            RateEmpAssessment: this.goalsList[i].RateEmpAssessment,
            SupervisorName: this.goalsList[i].SupervisorName,
            RateSprvsrAssessment: this.goalsList[i].RateSprvsrAssessment
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
      for (var i = 0; i < this.goalsList.length; i++) {
        this.excelDataListGoals.push({
          SetDate: this.goalsList[i].SetDate,
          CompletionDate: this.goalsList[i].CompletionDate,
          GoalDescription: this.goalsList[i].GoalDescription,
          RateEmpAssessment: this.goalsList[i].RateEmpAssessment,
          SupervisorName: this.goalsList[i].SupervisorName,
          RateSprvsrAssessment: this.goalsList[i].RateSprvsrAssessment
        });
      }
      this.excelExportService.export(this.excelDataContentGoals, new IgxExcelExporterOptions("GoalsCompleteExcel"));
      this.excelDataListGoals = [];
    }
    // case 2: When tblSearchType is not empty then assign new data list
    else if (this.tblSearchGoals != "") {
      for (var i = 0; i < this.goalsList.length; i++) {
        if (this.goalsList[i].SupervisorName.toUpperCase().includes(this.tblSearchGoals.toUpperCase())) {
          this.excelDataListGoals.push({
            SetDate: this.goalsList[i].SetDate,
            CompletionDate: this.goalsList[i].CompletionDate,
            GoalDescription: this.goalsList[i].GoalDescription,
            RateEmpAssessment: this.goalsList[i].RateEmpAssessment,
            SupervisorName: this.goalsList[i].SupervisorName,
            RateSprvsrAssessment: this.goalsList[i].RateSprvsrAssessment
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

  downloadPDFSkills() { }

  downloadCSVSkills() {
    //alert('CSV works');
    // case 1: When tblSearch is empty then assign full data list
    if (this.tblSearchSkills == "") {
      var completeDataList = [];
      for (var i = 0; i < this.skillsList.length; i++) {
        //alert(this.tblSearchType + " - " + this.skillCriteriaList[i].departmentName)
        completeDataList.push({
          SkillDate: this.skillsList[i].SkillDate,
          SkillName: this.skillsList[i].SkillName,
          RateAchvdLevel: this.skillsList[i].RateAchvdLevel,
          SkillHistoryDescription: this.skillsList[i].SkillHistoryDescription
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
            SkillName: this.skillsList[i].SkillName,
            RateAchvdLevel: this.skillsList[i].RateAchvdLevel,
            SkillHistoryDescription: this.skillsList[i].SkillHistoryDescription
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
          SkillName: this.skillsList[i].SkillName,
          RateAchvdLevel: this.skillsList[i].RateAchvdLevel,
          SkillHistoryDescription: this.skillsList[i].SkillHistoryDescription
        });
      }
      this.excelExportService.export(this.excelDataContentSkills, new IgxExcelExporterOptions("SkillsCompleteExcel"));
      this.excelDataListSkills = [];
    }
    // case 2: When tblSearchType is not empty then assign new data list
    else if (this.tblSearchSkills != "") {
      for (var i = 0; i < this.skillsList.length; i++) {
        if (this.skillsList[i].SkillName.toUpperCase().includes(this.tblSearchSkills.toUpperCase())) {
          this.excelDataListSkills.push({
            SkillDate: this.skillsList[i].SkillDate,
            SkillName: this.skillsList[i].SkillName,
            RateAchvdLevel: this.skillsList[i].RateAchvdLevel,
            SkillHistoryDescription: this.skillsList[i].SkillHistoryDescription
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
