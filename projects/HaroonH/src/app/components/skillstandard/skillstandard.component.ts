import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';

//import { AppComponent } from '../../app.component';
import { AppComponent } from 'src/app/app.component';


// import * as jsPDF from 'jspdf';
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
  selector: 'app-skillstandard',
  templateUrl: './skillstandard.component.html',
  styleUrls: ['./skillstandard.component.scss']
})
export class SkillstandardComponent implements OnInit {

  serverUrl = "https://localhost:8003/";
  tokenKey = "token";



  //new temp list
  newSkillDataList = [];
  lstData = [];
  // Ng-Models for Search
  tblSearch = '';
  tblSearchGroup = '';

  // Ng-Models for Add Skill Standard Modal Window 
  skillGroup = '';

  skillGroupList = []; // get config_skl_qualification
  skillTitle = '';
  skillCriteriaList = []; // get config_skl_qualificationCriteria
  jobProfile = '';
  jobProfileList = []; // get job_profiles
  prefIndCtr = false;
  qlfctnCriteriaReqdLvl = '';
  qlfctnCriteriaMaxLvl = '5';
  skillStandardList = [];
  skillStandardDetailsList = [];

  skillStandardId = '';
  skillReqdStandardId = '';

  qlfctnTypeCd = '';
  jobPostDeptCd = '';
  jobPostLocationCd = '';
  excelDataList = [];

  dSkillStandardId = '';
  dSkillReqdStandardId = '';

  qlfctnName = '';
  qlfctnCriteriaName = '';

  // Ng-Models for delete modal
  userPassword = '';
  userPINCode = '';



  //* variables for pagination and orderby pipe
  p = 1;
  pGroup = 1;
  order = 'info.name';
  reverse = false;
  // orderGroup = 'info.name';
  // reverseGroup = false;
  sortedCollection: any[];
  itemPerPage = '10';
  itemPerPageGroup = '5';



  // toppings = '';
  // toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];



  constructor(public toastr: ToastrManager,
    private app: AppComponent,
    private excelExportService: IgxExcelExporterService,
    private csvExportService: IgxCsvExporterService,
    private http: HttpClient) { }

  ngOnInit() {
    this.getSkillGroup();
    this.getSkillCriteria();
    this.getJobProfile();
    this.getSkillStandard();
    this.getSkillStandardDetails();
  }

  @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel



  // get skill group
  getSkillGroup() {

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getSkillGroup', { headers: reqHeader }).subscribe((data: any) => {
      this.skillGroupList = data

      // this.skillId = this.skillTypeList[4].qlfctnTypeCd;
      // this.skillTypeName = this.skillTypeList[4].qlfctnTypeName;
    });
  }

  skillChanged(item) {
    //alert(item.value);
    var val;
    //this.clear();
    for (let i = 0; i < this.skillGroupList.length; i++) {
      if (item.value == this.skillGroupList[i].qlfctnCd) {
        val = this.skillGroupList[i].qlfctnTypeCd;
      }
    }
    this.qlfctnTypeCd = val;

    //alert(this.qlfctnTypeCd);
  }

  // get the skill criteria
  getSkillCriteria() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getSkillCriteria', { headers: reqHeader }).subscribe((data: any) => {
      this.skillCriteriaList = data
    });
  }

  // get job profile
  getJobProfile() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getJobProfile', { headers: reqHeader }).subscribe((data: any) => {
      this.jobProfileList = data

      // this.skillId = this.skillTypeList[4].qlfctnTypeCd;
      // this.skillTypeName = this.skillTypeList[4].qlfctnTypeName;
    });
  }

  jobChanged(item) {
    var val1, val2;
    //this.clear();
    for (let i = 0; i < this.jobProfileList.length; i++) {
      if (item.value == this.jobProfileList[i].jobDesigId) {
        val1 = this.jobProfileList[i].jobPostDeptCd;
        val2 = this.jobProfileList[i].jobPostLocationCd;
      }
    }
    this.jobPostDeptCd = val1;
    this.jobPostLocationCd = val2;

    //alert(this.jobPostDeptCd + " - " + this.jobPostLocationCd);
  }

  // get skill standard (display data on main page table)
  getSkillStandard() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getSkillStandard', { headers: reqHeader }).subscribe((data: any) => {
      this.skillStandardList = data
    });
  }

  // get skill standard details (display individual data on detail modal window table)
  getSkillStandardDetails() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getSkillStandardDetails', { headers: reqHeader }).subscribe((data: any) => {
      this.skillStandardDetailsList = data
    });
  }

  saveSkillStandards() {
    if (this.skillGroup == "") {
      this.toastr.errorToastr('Please Select Skill Group', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.skillTitle == "") {
      this.toastr.errorToastr('Please Select Skill ', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.jobProfile == "") {
      this.toastr.errorToastr('Please Select Job Profile ', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.qlfctnCriteriaReqdLvl == "") {
      this.toastr.errorToastr('Please Enter Required Marks from 0-5 ', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (parseInt(this.qlfctnCriteriaReqdLvl) > 5 || parseInt(this.qlfctnCriteriaReqdLvl) < 0) {
      this.toastr.errorToastr('Please Enter Number between 0-5 ', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {

      // alert(
      //   " qlfctnTypeCd =" + this.qlfctnTypeCd +
      //   " qlfctnCd =" + this.skillGroup +
      //   " qlfctnCriteriaCd =" + this.skillTitle +
      //   " jobDesigId =" + this.jobProfile +
      //   " jobPostDeptCd =" + this.jobPostDeptCd +
      //   " jobPostLocationCd =" + this.jobPostLocationCd +
      //   " prefIndCtr =" + this.prefIndCtr +
      //   " qlfctnCriteriaMaxLvl =" + this.qlfctnCriteriaMaxLvl +
      //   " qlfctnCriteriaReqdLvl =" + this.qlfctnCriteriaReqdLvl
      // );

      //return false;

      // if (this.skillTitleId != "") {}

      if (this.skillStandardId != "") {
        return false;
        var updateData = {
          "qlfctnRuleCriteriaCd": this.skillStandardId,
          "qlfctnTypeCd": this.qlfctnTypeCd,
          "qlfctnCd": this.skillGroup,
          "qlfctnCriteriaCd": this.skillTitle,
          "jobDesigId": this.jobProfile,
          "jobPostDeptCd": this.jobPostDeptCd,
          "jobPostLocationCd": this.jobPostLocationCd,
          "prefIndCtr": this.prefIndCtr,
          "qlfctnCriteriaMaxLvl": this.qlfctnCriteriaMaxLvl,
          "qlfctnCriteriaReqdLvl": this.qlfctnCriteriaReqdLvl,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.put(this.serverUrl + 'api/updateSkillStandard', updateData, { headers: reqHeader }).subscribe((data: any) => {

          //alert(data.msg);

          if (data.msg == undefined) {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            $('#editSkillModal').modal('hide');
            this.getSkillStandard();
            return false;
          }
          else {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });

            this.clear();
            $('#editSkillModal').modal('hide');
            this.getSkillStandard();
            //this.getSkillCriteria();

            return false;
          }

        });

      }

      else {
        var saveData = {
          "qlfctnTypeCd": this.qlfctnTypeCd,
          "qlfctnCd": this.skillGroup,
          "qlfctnCriteriaCd": this.skillTitle,
          "jobDesigId": this.jobProfile,
          "jobPostDeptCd": this.jobPostDeptCd,
          "jobPostLocationCd": this.jobPostLocationCd,
          "prefIndCtr": this.prefIndCtr,
          "qlfctnCriteriaMaxLvl": this.qlfctnCriteriaMaxLvl,
          "qlfctnCriteriaReqdLvl": this.qlfctnCriteriaReqdLvl,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
        //alert(reqHeader);
        this.http.post(this.serverUrl + 'api/saveSkillStandard', saveData, { responseType: 'json' }).subscribe((data: any) => {

          if (data.msg == "Skill standard Already Exist") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            $('#addSkillModal').modal('hide');
            this.getSkillStandard();
            return false;
          }
          else if (data.msg == "Skill Standard Inserted Successfully") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#addSkillModal').modal('hide');
            $('#editSkillModal').modal('hide');
            this.getSkillStandard();
            this.getSkillStandardDetails();
            return false;
          }
          else {
            this.toastr.errorToastr(data.msg, 'Error !', { toastTimeout: (2500) });
            this.clear();
            $('#addSkillModal').modal('hide');
            $('#editSkillModal').modal('hide');
            this.getSkillStandard();
            return false;
          }
        });
      }
    }
  }

  edit(item) {
    this.clearEdit();
    //this.skillStandardId = item.qlfctnRuleCriteriaCd;
    this.skillGroup = item.qlfctnCd;
    //this.skillReqdStandardId = item.reqdQlfctnRuleNo;
    this.skillTitle = item.qlfctnCriteriaCd;
    this.qlfctnTypeCd = item.qlfctnTypeCd;
    //this.prefIndCtr = item.prefIndCtr;
    //this.qlfctnCriteriaMaxLvl = item.qlfctnCriteriaMaxLvl;
    //this.qlfctnCriteriaReqdLvl = item.qlfctnCriteriaReqdLvl;

    //alert(this.skillGroup + " - " + this.skillTitle);

  }

  clearEdit() {
    this.jobProfile = '';
    this.prefIndCtr = false;
    this.qlfctnCriteriaReqdLvl = '';
  }

  clear() {

    //alert("Clear OK");

    // Ng-Models for Search
    this.tblSearch = '';
    this.tblSearchGroup = '';

    // Ng-Models for Add Skill Standard Modal Window 
    this.skillStandardId = '';
    this.skillReqdStandardId = ''; //*    ng-model ID for Reqd Qualification Rule Criteria
    this.skillGroup = '';
    this.skillTitle = '';
    this.jobProfile = '';
    this.prefIndCtr = false;
    this.qlfctnCriteriaReqdLvl = '';
    this.qlfctnCriteriaMaxLvl = '5';

    // Ng-Models for delete modal
    this.userPassword = '';
    this.userPINCode = '';
    this.dSkillStandardId = '';
    this.dSkillReqdStandardId = '';
    this.qlfctnName = '';
    this.qlfctnCriteriaName = '';

  }

  newDetailList(item) {

    //alert(item.qlfctnName + " - " + item.qlfctnCriteriaName);
    this.newSkillDataList = [];
    for (var i = 0; i < this.skillStandardDetailsList.length; i++) {
      //alert(this.skillStandardDetailsList[i].qlfctnName + " - " + item.qlfctnName);

      // if (this.skillStandardDetailsList[i].qlfctnName.toUpperCase().includes(item.qlfctnName.toUpperCase())
      //   && this.skillStandardDetailsList[i].qlfctnCriteriaName.toUpperCase().includes(item.qlfctnCriteriaName.toUpperCase())) {
      //   this.newSkillDataList.push({
      //     qlfctnName: this.skillStandardDetailsList[i].qlfctnName,
      //     qlfctnCriteriaName: this.skillStandardDetailsList[i].qlfctnCriteriaName,
      //     jobDesigName: this.skillStandardDetailsList[i].jobDesigName,
      //     qlfctnCriteriaReqdLvl: this.skillStandardDetailsList[i].qlfctnCriteriaReqdLvl,
      //     qlfctnCriteriaMaxLvl: this.skillStandardDetailsList[i].qlfctnCriteriaMaxLvl,
      //     reqdQlfctnRuleNo: this.skillStandardDetailsList[i].reqdQlfctnRuleNo,
      //     qlfctnRuleCriteriaCd: this.skillStandardDetailsList[i].qlfctnRuleCriteriaCd
      //   });
      // }

      if (this.skillStandardDetailsList[i].qlfctnName == item.qlfctnName
        && this.skillStandardDetailsList[i].qlfctnCriteriaName == item.qlfctnCriteriaName) {
        this.newSkillDataList.push({
          qlfctnName: this.skillStandardDetailsList[i].qlfctnName,
          qlfctnCriteriaName: this.skillStandardDetailsList[i].qlfctnCriteriaName,
          jobDesigName: this.skillStandardDetailsList[i].jobDesigName,
          qlfctnCriteriaReqdLvl: this.skillStandardDetailsList[i].qlfctnCriteriaReqdLvl,
          qlfctnCriteriaMaxLvl: this.skillStandardDetailsList[i].qlfctnCriteriaMaxLvl,
          reqdQlfctnRuleNo: this.skillStandardDetailsList[i].reqdQlfctnRuleNo,
          qlfctnRuleCriteriaCd: this.skillStandardDetailsList[i].qlfctnRuleCriteriaCd
        });
      }

      // if (item.qlfctnCd == this.skillStandardDetailsList[i].qlfctnCd && item.qlfctnCriteriaCd == this.skillStandardDetailsList[i].qlfctnCriteriaCd) {
      //   this.newSkillDataList.push({
      //     skillGroup: this.skillStandardDetailsList[i].qlfctnName,
      //     skillTitle: this.skillStandardDetailsList[i].qlfctnCriteriaName,
      //     jobDesigName: this.skillStandardDetailsList[i].jobDesigName,
      //     qlfctnCriteriaReqdLvl: this.skillStandardDetailsList[i].qlfctnCriteriaReqdLvl,
      //     qlfctnCriteriaMaxLvl: this.skillStandardDetailsList[i].qlfctnCriteriaMaxLvl,
      //   });
      // }
    }
    if (this.newSkillDataList.length > 0) {
      //alert("Filter List " + this.newSkillDataList.length);
      return;
      //this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("skillFilterExcel"));
      //this.excelDataList = [];
    }
    else {
      this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
    }
  }

  // get the "ids" of the delete entry 
  deleteSkillStandard(item) {
    this.clear();
    this.dSkillStandardId = item.qlfctnRuleCriteriaCd;
    this.dSkillReqdStandardId = item.reqdQlfctnRuleNo;
    // this.skillId = item.qlfctnTypeCd;
    // this.skillGroup = item.qlfctnCd;
    // this.skillTitle = item.qlfctnCriteriaName;
    // this.skillTitleDescription = item.qlfctnCriteriaDesc;
    this.qlfctnName = item.qlfctnName;
    this.qlfctnCriteriaName = item.qlfctnCriteriaName;
  }

  // delete the skill criteria
  delete() {


    //alert(this.dSkillReqdStandardId + " - " + this.dSkillStandardId + " - " + this.qlfctnName + " - " + this.qlfctnCriteriaName);


    if (this.userPassword == "") {
      this.toastr.errorToastr('Please Enter Password', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.userPINCode == "") {
      this.toastr.errorToastr('Please Enter PIN Code', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {
      if (this.dSkillStandardId != "" && this.dSkillReqdStandardId != "") {

        var data = {
          "qlfctnRuleCriteriaCd": this.dSkillStandardId,
          "reqdQlfctnRuleNo": this.dSkillReqdStandardId,
          // "qlfctnTypeCd": this.skillId,
          // "qlfctnCd": this.skillGroup,
          // "qlfctnCriteriaName": this.skillTitle,
          // "qlfctnCriteriaDesc": this.skillTitleDescription,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.put(this.serverUrl + 'api/deleteSkillStandard', data, { headers: reqHeader }).subscribe((data: any) => {

          //alert(data.msg);

          if (data.msg == "Skill Standard Deleted Successfully") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });

            // this.getSkillStandardDetails();
            // this.getSkillStandard();
            // this.lstData = [this.qlfctnName, this.qlfctnCriteriaName];
            // alert("LIST DATA = " + this.lstData.length);
            // this.newDetailList(this.lstData);

            this.clear();
            $('#deleteModal').modal('hide');
            $('#detailSkillModal').modal('hide');
            this.getSkillStandardDetails();
            this.getSkillStandard();

            //alert();

            return false;
          }
          else if (data.msg == "Error Occured") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          }
          // else {
          //   this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
          //   this.clear();
          //   $('#deleteModal').modal('hide');
          //   this.getSkillStandardDetails();
          //   this.getSkillStandard();
          //   return false;
          // }
        });
      }
    }//else ends
  }



  //function for sorting/orderBy table data 
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

  downloadPDF() {
    alert('PDF works');
  }

  downloadCSV() {
    //alert('CSV works');
    // case 1: When tblSearch is empty then assign full data list
    if (this.tblSearch == "") {
      var completeDataList = [];
      for (var i = 0; i < this.skillStandardList.length; i++) {
        //alert(this.tblSearch + " - " + this.skillCriteriaList[i].departmentName)
        completeDataList.push({
          skill_Group: this.skillStandardList[i].qlfctnName,
          skill_Title: this.skillStandardList[i].qlfctnCriteriaName,
          Job_Profile: this.skillStandardList[i].jobProfileCount
        });
      }
      this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("skillStandardCompleteCSV", CsvFileTypes.CSV));
    }
    // case 2: When tblSearch is not empty then assign new data list
    else if (this.tblSearch != "") {
      var filteredDataList = [];
      for (var i = 0; i < this.skillStandardList.length; i++) {
        if (this.skillStandardList[i].qlfctnName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.skillStandardList[i].qlfctnCriteriaName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
          filteredDataList.push({
            skill_Group: this.skillStandardList[i].qlfctnName,
            skill_Title: this.skillStandardList[i].qlfctnCriteriaName,
            Job_Profile: this.skillStandardList[i].jobProfileCount
          });
        }
      }

      if (filteredDataList.length > 0) {
        this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("skillStandardFilterCSV", CsvFileTypes.CSV));
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
      for (var i = 0; i < this.skillStandardList.length; i++) {
        this.excelDataList.push({
          skill_Group: this.skillStandardList[i].qlfctnName,
          skill_Title: this.skillStandardList[i].qlfctnCriteriaName,
          Job_Profile: this.skillStandardList[i].jobProfileCount
        });
      }
      this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("skillStandardCompleteExcel"));
      this.excelDataList = [];
    }
    // case 2: When tblSearch is not empty then assign new data list
    else if (this.tblSearch != "") {
      for (var i = 0; i < this.skillStandardList.length; i++) {
        if (this.skillStandardList[i].qlfctnName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.skillStandardList[i].qlfctnCriteriaName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
          this.excelDataList.push({
            skill_Group: this.skillStandardList[i].qlfctnName,
            skill_Title: this.skillStandardList[i].qlfctnCriteriaName,
            Job_Profile: this.skillStandardList[i].jobProfileCount
          });
        }
      }

      if (this.excelDataList.length > 0) {
        //alert("Filter List " + this.excelDataList.length);

        this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("skillStandardFilterExcel"));
        this.excelDataList = [];
      }
      else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }
}
