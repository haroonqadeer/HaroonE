import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart } from 'angular-highcharts';
import { AppComponent } from 'src/app/app.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

declare var $: any;

//use in status combobox
export interface Status {
  sId: string;
  sName: string;
}

//use in Officer combobox
export interface Officer {
  oId: string;
  oName: string;
}

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss']
})
export class RecruitmentComponent implements OnInit {

  // serverUrl = "http://192.168.200.19:3014/";
  // serverUrl = "http://localhost:3005/";
  serverUrl = "http://localhost:9020/";

  Line_chart: Chart;

  //use in status combobox
  status: Status[] = [
    { sId: '1', sName: 'Accept' },
    // { sId: '2', sName: 'Reject' },
    // { sId: '3', sName: 'Short List' },
    // { sId: '4', sName: 'Waiting' }
  ]

  //use in officers combobox
  officers: Officer[] = [
    { oId: '1', oName: 'Ali' },
    { oId: '2', oName: 'Razzaq' },
    { oId: '3', oName: 'Fahad' },
    { oId: '4', oName: 'Moin' }
  ]

  //use in types combobox
  types: Officer[] = [
    { oId: '1', oName: 'Ali' },
    { oId: '2', oName: 'Razzaq' },
    { oId: '3', oName: 'Fahad' },
    { oId: '4', oName: 'Moin' }
  ]

  cmbTestThrough = '';
  cmbCType = '';
  cmbStatus = '';
  txtNumber = '';
  txtRemarks = '';
  lblJobTitle = "";
  lblVacancy = "";
  lblPublishOn = "";
  lblLastDate = "";
  lblJPDeptCd = "";
  lblJDesigID = "";
  lblJPLocCd = "";
  lblStepperID = 0;
  lblApplicantID = 0;
  lblApplicantName = "";

  interviewListCount = 0;
  appointmentListCount = 0;
  shortListInterviewCount = 0;
  shortListTestCount = 0;

  vcncyList = [];

  // For Applications
  applicantList = []
  procList = []
  // For Short Listed Applicants for Test
  shortListTest = []
  // For Tests
  testList = []
  // For Short Listed Appicants for Interview
  shortListInterview = []
  // For Interview
  interviewList = []
  // For Appointment
  appointmentList = []

  interviewDetailList = [];

  skillDetailList = [];

  
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient
  ) { }

  ngOnInit() {

    this.getJobVcncy();
  }

  LineChart_init() {

    var series1=[];
    var qty=[];
    
    for (var i = 0; i < this.skillDetailList.length; i++) {
      qty = [];
      
      qty.push(
        this.skillDetailList[i].qlfctnCriteriaReqdLvl,
        this.skillDetailList[i].qlfctnCriteriaMaxLvl
      );
      series1.push({
        type:'line',
        name: this.skillDetailList[i].qlfctnCriteriaName,
        data: qty
      });
    }    

    let chart = new Chart({
      title: {
        text: 'Graph'
      },
      xAxis: {
        categories: ['English', 'VB.Net']
      },
      yAxis: {
        title: {
          text: 'Required Skills'
        }
      },
      credits: {
        enabled: false
      },
      series:series1
    });
    this.Line_chart = chart;
  
  }

  getJobVcncy() {

    this.app.showSpinner();

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getVcncy', { headers: reqHeader }).subscribe((data: any) => {

      this.vcncyList = data;

      this.app.hideSpinner();

    });
  }

  getStepperID(item, appID) {
    this.lblStepperID = item;
    this.lblApplicantID = appID;

    if (item == 6) {
      for (var i = 0; i < this.appointmentList.length; i++) {
        if (appID == this.appointmentList[i].appID) {
          this.lblJPLocCd = this.appointmentList[i].jobPostLocationCd;
          this.lblJPDeptCd = this.appointmentList[i].jobPostDeptCd;
          this.lblJDesigID = this.appointmentList[i].jobDesigID;
          i = this.appointmentList.length + 1;
        }
      }
    }
  }

  saveStatus() {

    if (this.cmbStatus == '') {
      this.toastr.errorToastr('Please select Status', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.txtNumber == '') {
      this.toastr.errorToastr('Please Enter Marks', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.txtRemarks == '') {
      this.toastr.errorToastr('Please Enter Remarks', 'Error', { toastTimeout: (2500) });
      return;
    } else {

      if (this.lblStepperID == 1) {
        var saveData = {
          applicantID: this.lblApplicantID,
          jpVcncyCd: localStorage.getItem('jobPostVcncyID'),
          // status: this.cmbStatus,
          marks: this.txtNumber,
          remarks: this.txtRemarks
        };

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveInitialScreen', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#statusModal').modal('hide');
            //this.app.hideSpinner();
            this.onVcncySelect(localStorage.getItem('jobPostVcncyID'));
            return false;
          } else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            //$('#companyModal').modal('hide');
            //this.app.hideSpinner();
            return false;
          }
        });

      } else if (this.lblStepperID == 2) {
        var saveData = {
          applicantID: this.lblApplicantID,
          jpVcncyCd: localStorage.getItem('jobPostVcncyID'),
          // status: this.cmbStatus,
          marks: this.txtNumber,
          remarks: this.txtRemarks
        };

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveShrtLstTest', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#statusModal').modal('hide');
            //this.app.hideSpinner();
            this.onVcncySelect(localStorage.getItem('jobPostVcncyID'));
            return false;
          } else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            //$('#companyModal').modal('hide');
            //this.app.hideSpinner();
            return false;
          }
        });

      } else if (this.lblStepperID == 3) {
        var saveData = {
          applicantID: this.lblApplicantID,
          jpVcncyCd: localStorage.getItem('jobPostVcncyID'),
          // status: this.cmbStatus,
          marks: this.txtNumber,
          remarks: this.txtRemarks
        };

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveTest', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#statusModal').modal('hide');
            //this.app.hideSpinner();
            this.onVcncySelect(localStorage.getItem('jobPostVcncyID'));
            return false;
          } else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            //$('#companyModal').modal('hide');
            //this.app.hideSpinner();
            return false;
          }
        });

      } else if (this.lblStepperID == 4) {
        var saveData = {
          applicantID: this.lblApplicantID,
          jpVcncyCd: localStorage.getItem('jobPostVcncyID'),
          // status: this.cmbStatus,
          marks: this.txtNumber,
          remarks: this.txtRemarks
        };

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveShrtLstInterview', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#statusModal').modal('hide');
            //this.app.hideSpinner();
            this.onVcncySelect(localStorage.getItem('jobPostVcncyID'));
            return false;
          } else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            //$('#companyModal').modal('hide');
            //this.app.hideSpinner();
            return false;
          }
        });

      } else if (this.lblStepperID == 5) {
        var saveData = {
          applicantID: this.lblApplicantID,
          jpVcncyCd: localStorage.getItem('jobPostVcncyID'),
          // status: this.cmbStatus,
          marks: this.txtNumber,
          remarks: this.txtRemarks
        };

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveInterview', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#statusModal').modal('hide');
            //this.app.hideSpinner();
            this.onVcncySelect(localStorage.getItem('jobPostVcncyID'));
            return false;
          } else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            //$('#companyModal').modal('hide');
            //this.app.hideSpinner();
            return false;
          }
        });

      } else if (this.lblStepperID == 6) {
        var saveAppoint = {
          applicantID: this.lblApplicantID,
          jpVcncyCd: localStorage.getItem('jobPostVcncyID'),
          jobPostDeptCd: this.lblJPDeptCd,
          jobDesigID: this.lblJDesigID,
          jobPostLocationCd: this.lblJPLocCd,
          marks: this.txtNumber,
          remarks: this.txtRemarks
        };

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveAppointment', saveAppoint, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#statusModal').modal('hide');
            //this.app.hideSpinner();
            this.onVcncySelect(localStorage.getItem('jobPostVcncyID'));
            return false;
          } else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            //$('#companyModal').modal('hide');
            //this.app.hideSpinner();
            return false;
          }
        });

      }
    }
  }
    
  getSkillDetail(item, name){
    
    this.skillDetailList = [];
    this.lblApplicantName = '';
    
    this.lblApplicantName = name;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getSkillDetail?applicantID=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.skillDetailList = data;

      this.LineChart_init();

    });

  }

  onVcncySelect(item) {
    this.clear();

    for (var i = 0; i < this.vcncyList.length; i++) {
      if (item == this.vcncyList[i].jobPostVcncyID) {
        this.lblJobTitle = this.vcncyList[i].jobDesigName;
        this.lblVacancy = this.vcncyList[i].jobPostVcncyQty;
        this.lblPublishOn = this.vcncyList[i].vcncyStartDt;
        this.lblLastDate = this.vcncyList[i].vcncyExprtnDt;
        i = this.vcncyList.length + 1;
      }
    }

    this.getAppointments(item);
  }

  getAppointments(item){

    this.app.showSpinner();

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    //getting appointments data
    this.http.get(this.serverUrl + 'api/getRecPrcssAppointment?jPVcncyID=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.appointmentListCount = data.length;

      for (var i = 0; i < data.length; i++) {
        var status = "";
        if (data[i].shortLstIndctr == false) {
          status = "Waiting";
        } else {
          status = "Completed";
        }

        this.appointmentList.push({
          jobPostLocationCd: data[i].jobPostLocationCd,
          jobPostDeptCd: data[i].jobPostDeptCd,
          jobDesigID: data[i].jobDesigID,
          appID: data[i].applicantID,
          appName: data[i].fullName,
          screenMarks: data[i].screenMarks,
          testMarks: data[i].testMarks,
          interviewMarks: data[i].interviewMarks,
          appStatus: status
        });
      }

      this.app.hideSpinner();

      this.getInterviews(item, this.appointmentListCount);
    });

  }

  getInterviews(item, count){

    this.app.showSpinner();

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    // alert(count);return;
    //getting Interviewers data
    this.http.get(this.serverUrl + 'api/getRecPrcssInterview?jPVcncyID=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.interviewListCount = data.length;

      for (var i = 0; i < data.length; i++) {
        var status = "Waiting";
        if (count == 0) {
          this.interviewList.push({
            appID: data[i].applicantID,
            appName: data[i].fullName,
            marks: data[i].marks,
            appStatus: status
          });
        } else {
          for (var j = 0; j < this.appointmentList.length; j++) {
            if (this.appointmentList[j].appID == data[i].applicantID) {
              status = "Short List";
              j = this.appointmentList.length + 1;
            }
          }
          this.interviewList.push({
            appID: data[i].applicantID,
            appName: data[i].fullName,
            marks: data[i].marks,
            appStatus: status
          });
        }

      }

      this.app.hideSpinner();

      this.getShortListInterview(item, this.interviewListCount);

    });
    
  }

  getShortListInterview(item, count){

    this.app.showSpinner();

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    //getting shortlisted for interview data
    this.http.get(this.serverUrl + 'api/getRecPrcssShrtLstInterview?jPVcncyID=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.shortListInterviewCount = data.length;
      //this.applicantList = data;
      for (var i = 0; i < data.length; i++) {
        var status = "Waiting";
        if (count == 0) {
          this.shortListInterview.push({
            appID: data[i].applicantID,
            appName: data[i].fullName,
            screenMarks: data[i].screenMarks,
            testMarks: data[i].testMarks,
            appStatus: status
          });
        } else {
          for (var j = 0; j < this.interviewList.length; j++) {
            if (this.interviewList[j].appID == data[i].applicantID) {
              status = "Short List";
              j = this.interviewList.length + 1;
            }
          }
          this.shortListInterview.push({
            appID: data[i].applicantID,
            appName: data[i].fullName,
            screenMarks: data[i].screenMarks,
            testMarks: data[i].testMarks,
            appStatus: status
          });
        }

      }

      this.app.hideSpinner();

      this.getTest(item, this.shortListInterviewCount);

    });

  }

  getTest(item, count){

    this.app.showSpinner();

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    //getting applicants test data
    this.http.get(this.serverUrl + 'api/getRecPrcssTest?jPVcncyID=' + item, { headers: reqHeader }).subscribe((data: any) => {

      for (var i = 0; i < data.length; i++) {
        var status = "Waiting";
        var testThrough = "";

        if (data[i].obtainMarks == 0) {
          testThrough = "Manual";
        } else {
          testThrough = "Web";
        }

        if (count == 0) {
          this.testList.push({
            appID: data[i].applicantID,
            appName: data[i].fullName,
            test: testThrough,
            totalMarks: data[i].totalMarks,
            marks: data[i].obtainMarks,
            appStatus: status
          });
        } else {
          for (var j = 0; j < this.shortListInterview.length; j++) {
            if (this.shortListInterview[j].appID == data[i].applicantID) {
              status = "ShortList";
              j = this.shortListInterview.length;
            }
          }
          this.testList.push({
            appID: data[i].applicantID,
            appName: data[i].fullName,
            test: testThrough,
            totalMarks: data[i].totalMarks,
            marks: data[i].obtainMarks,
            appStatus: status
          });
        }
      }

      this.app.hideSpinner();

      this.getShorListTest(item);

    });

  }

  getShorListTest(item){

    this.app.showSpinner();

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    //getting shortlist for test data
    this.http.get(this.serverUrl + 'api/getRecPrcssShrtLstTest?jPVcncyID=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.shortListTestCount = data.length;

      for (var i = 0; i < data.length; i++) {
        var status = "";
        if (data[i].shortLstIndctr == false) {
          status = "Waiting";
        } else if (data[i].shortLstIndctr == true) {
          status = "Short List";
        }
        this.shortListTest.push({
          // lstTestId: data[i].apprvngPrcssCd,
          appID: data[i].applicantID,
          appName: data[i].fullName,
          marks: data[i].marks,
          appStatus: status
        });
      }

      this.app.hideSpinner();

      this.getInitialScreening(item, this.shortListTestCount);
    });

  }

  getInitialScreening(item, count){

    this.app.showSpinner();

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    //getting initial screening data
    this.http.get(this.serverUrl + 'api/getRecPrcssApp?jPVcncyID=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.procList = data;
      for (var i = 0; i < data.length; i++) {
        var status = "Waiting";
        if (data[i].match != "FAIL") {
          if(count != 0){
            for (var j = 0; j < this.shortListTest.length; j++) {
              if (this.procList[i].applcntID == this.shortListTest[j].appID) {
                status = "ShortList";
                j = this.shortListTest.length + 1;
              } else {
                status = "Waiting";
              }
            }
            this.applicantList.push({
              jobPostVcncyID: data[i].jobPostVcncyID,
              appID: data[i].applcntID,
              appName: data[i].indvdlFullName,
              receivedOn: data[i].receivedDate,
              appMatch: data[i].match,
              appStatus: status
            });
          }
        }
      }

      this.app.hideSpinner();

    });

  }

  getInterviewDetail(item){
    
    this.interviewDetailList = [];
    this.lblApplicantID = item;
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getInterviewPanel?jPVcncyID=' + localStorage.getItem('jobPostVcncyID'), { headers: reqHeader }).subscribe((data: any) => {

      //this.interviewDetailList = data;

      for(var i = 0; i < data.length; i++){
        this.interviewDetailList.push({
          actlPrcssEmpID: data[i].actlPrcssEmpID,
          indvdlFullName: data[i].indvdlFullName,
          jobDesigName: data[i].jobDesigName,
          payGradeName: data[i].payGradeName,
          jobDesigID: data[i].jobDesigID,
          jobPostVcncyID: data[i].jobPostVcncyID,
          jobPostDeptCd: data[i].jobPostDeptCd,
          jobPostLocationCd: data[i].jobPostLocationCd,
          apprvngPrcssCd: data[i].apprvngPrcssCd,
          marks: data[i].marks
        });
      }

    });

  }

  saveInterviewMarks(){
    
    if(this.interviewDetailList.length == 0){
      this.toastr.errorToastr('No Record Found!', 'Error!', { toastTimeout: (2500) });
      return;
    }else{

      for(var i=0;i<this.interviewDetailList.length;i++){
        if(this.interviewDetailList[i].marks == '' || this.interviewDetailList[i].marks == 0){
          this.toastr.errorToastr('Please Enter Marks!', 'Error!', { toastTimeout: (2500) });
          return;
        }
      }

      var saveData = {
        interviewDetail: JSON.stringify(this.interviewDetailList),
        applcntID: this.lblApplicantID,
        jobPostVcncyID: localStorage.getItem('jobPostVcncyID')
      };

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(this.serverUrl + 'api/saveInterviewDetail', saveData, { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg == "Record Saved Successfully!") {
          this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
          this.clear();
          $('#interviewModal').modal('hide');
          //this.app.hideSpinner();
          this.onVcncySelect(localStorage.getItem('jobPostVcncyID'));
          return false;
        } else {
          this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
          //$('#companyModal').modal('hide');
          //this.app.hideSpinner();
          return false;
        }
      });

    }

  }
  clear() {
    this.lblApplicantID = 0;
    this.lblStepperID = 0;
    this.cmbStatus = "";
    this.txtNumber = "";
    this.txtRemarks = "";

    this.shortListTest = [];
    this.applicantList = [];
    this.testList = []
    this.shortListInterview = []
    this.interviewList = []
    this.appointmentList = []

  }
}
