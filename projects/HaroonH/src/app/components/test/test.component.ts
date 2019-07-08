import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

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
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

// <<<<<<< HEAD
  serverUrl = "http://localhost:9017/";
  //serverUrl = "http://192.168.200.19:3008/";
// =======
  // serverUrl = "https://localhost:3002/";
  // serverUrl = "http://192.168.200.19:3008/";
// >>>>>>> 6baa61dccfa396920caf44af3017542ec596dd83
  // serverUrl = "https://localhost:3002/";


  testSearch = '';


  subjectGroup = "";
  subjectName = "";
  jobProfile = "";
  lblSubject = "";
  lblSubjectID = "";
  lblQuestionID = "";
  lblJobDesigID = "";
  optAnswer = "";
  question = "";
  opt1 = "";
  opt2 = "";
  opt3 = "";
  opt4 = "";
  quesMarks = "";
  opt1ID = "";
  opt2ID = "";
  opt3ID = "";
  opt4ID = "";

  subGroupList = [];
  testList = [];
  jobDesigList = [];
  testQuestionListCount = [];
  testQuestionList = [];
  jobProfileList = [];
  jobProfileTestList = [];

  txtdPassword = '';
  txtdPin = '';

  //* Excel Data List
  excelDataList = [];

  //* variables for pagination and orderby pipe
  p = 1;
  //pGroup = 1;
  order = 'info.name';
  reverse = false;
  // orderGroup = 'info.name';
  // reverseGroup = false;
  sortedCollection: any[];
  itemPerPage = '10';
  //itemPerPageGroup = '5';


  constructor(public toastr: ToastrManager,
    private app: AppComponent,
    private excelExportService: IgxExcelExporterService,
    private csvExportService: IgxCsvExporterService,
    private http: HttpClient) { }

  ngOnInit() {

    this.getsubjectGroup();
    this.getTest();
    this.getJobDesig();

  }

  @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel


  getsubjectGroup() {

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getSubjectGroup', { headers: reqHeader }).subscribe((data: any) => {

      this.subGroupList = data;
    });
  }

  getJobProfile(item) {

    this.clear();

    this.lblSubject = item.testSbjctName;
    this.lblSubjectID = item.testSbjctCd;

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getJobProfile?testSubjectCd=' + item.testSbjctCd, { headers: reqHeader }).subscribe((data: any) => {

      this.jobProfileList = data;

    });

    this.http.get(this.serverUrl + 'api/getJobDesig?subjectCd=' + item.testSbjctCd, { headers: reqHeader }).subscribe((data: any) => {

      this.jobDesigList = data;
    });

  }

  getJobProfileTest(item) {

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getJobProfile?testSubjectCd=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.jobProfileList = data;

    });

    this.http.get(this.serverUrl + 'api/getJobDesig?subjectCd=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.jobDesigList = data;
    });

  }

  getJobQuestion(item) {

    this.clear();

    this.lblSubjectID = item.testSbjctCd;

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getTestQuestionCount?subjectCd=' + item.testSbjctCd, { headers: reqHeader }).subscribe((data: any) => {

      this.testQuestionListCount = data;
    });

    this.http.get(this.serverUrl + 'api/getTestQuestion?subjectCd=' + item.testSbjctCd, { headers: reqHeader }).subscribe((data: any) => {

      this.testQuestionList = data;
    });
  }

  getJobPostQuestion(item) {


    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getTestQuestionCount?subjectCd=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.testQuestionListCount = data;
    });

    this.http.get(this.serverUrl + 'api/getTestQuestion?subjectCd=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.testQuestionList = data;
    });
  }

  getJobDesig() {

    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    // this.http.get(this.serverUrl + 'api/getJobDesig', { headers: reqHeader }).subscribe((data: any) => {

    //   this.jobDesigList = data;
    // });
  }

  getTest() {

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getTest', { headers: reqHeader }).subscribe((data: any) => {

      this.testList = data;
    });
  }

  addQuestion() {
    var subjectID = this.lblSubjectID;
    this.clear();

    this.lblSubjectID = subjectID;
  }

  addJobProfile() {

    for (var i = 0; i < this.jobProfileTestList.length; i++) {
      if (this.jobProfile == this.jobProfileTestList[i].jobDesigID) {
        this.toastr.errorToastr('Job Profile Already Exist!', 'Error', { toastTimeout: (2500) });
        return;
      }
    }
    for (var i = 0; i < this.jobDesigList.length; i++) {

      if (this.jobProfile == this.jobDesigList[i].jobDesigID) {

        this.jobProfileTestList.push({
          testSbjctCd: this.lblSubjectID,
          jobDesigID: this.jobProfile,
          locationCd: this.jobDesigList[i].locationCd,
          deptCd: this.jobDesigList[i].deptCd,
          jobDesigName: this.jobDesigList[i].jobDesigName
        });
        i = this.jobDesigList.length + 1;
      }
    }
  }

  remove(item) {
    var index = this.jobProfileTestList.indexOf(item);
    this.jobProfileTestList.splice(index, 1);

  }

  saveSubject() {

    if (this.subjectGroup == '') {
      this.toastr.errorToastr('Please select Subject Group', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.subjectName == '') {
      this.toastr.errorToastr('Please Enter Subject', 'Error', { toastTimeout: (2500) });
      return;
    } else {

      var saveData = {
        testSbjctName: this.subjectName,
        testSbjctGroupCd: this.subjectGroup
      };

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(this.serverUrl + 'api/saveSubject', saveData, { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg == "Record Saved Successfully!") {
          this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
          this.getTest();
          $('#addSubject').modal('hide');
          //this.app.hideSpinner();
          this.clear();
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

  editQuestion(item) {

    this.clear();

    //this.lblSubjectID = item.testSbjctCd;
    this.lblQuestionID = item.testQuesID;
    this.question = item.testQuesText;
    this.optAnswer = item.answer.toString();
    this.quesMarks = item.marks;

    for (var i = 0; i < this.testQuestionList.length; i++) {
      if (item.testQuesID == this.testQuestionList[i].testQuesID) {
        this.lblSubjectID = this.testQuestionList[i].testSbjctCd;
        if (this.opt1 == "") {

          this.opt1 = this.testQuestionList[i].testQuesOptnText;
          this.opt1ID = this.testQuestionList[i].testQuesOptnID;
        } else if (this.opt1 != "" && this.opt2 == "") {

          this.opt2 = this.testQuestionList[i].testQuesOptnText;
          this.opt2ID = this.testQuestionList[i].testQuesOptnID;
        } else if (this.opt1 != "" && this.opt2 != "" && this.opt3 == "") {

          this.opt3 = this.testQuestionList[i].testQuesOptnText;
          this.opt3ID = this.testQuestionList[i].testQuesOptnID;
        } else if (this.opt1 != "" && this.opt2 != "" && this.opt3 != "" && this.opt4 == "") {

          this.opt4 = this.testQuestionList[i].testQuesOptnText;
          this.opt4ID = this.testQuestionList[i].testQuesOptnID;
        }
      }
    }

  }

  saveQuestion() {

    var subjectID;

    if (this.question == '') {
      this.toastr.errorToastr('Please enter Question', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.quesMarks == '') {
      this.toastr.errorToastr('Please enter Marks', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.opt1 == '') {
      this.toastr.errorToastr('Please enter option 1', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.opt2 == '') {
      this.toastr.errorToastr('Please enter option 2', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.opt3 == '') {
      this.toastr.errorToastr('Please enter option 3', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.opt4 == '') {
      this.toastr.errorToastr('Please enter option 4', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.optAnswer == '') {
      this.toastr.errorToastr('Please select Correct Option', 'Error', { toastTimeout: (2500) });
      return;
    } else {

      if (this.lblQuestionID == '') {
        var saveData = {
          question: this.question,
          marks: this.quesMarks,
          opt1: this.opt1,
          opt2: this.opt2,
          opt3: this.opt3,
          opt4: this.opt4,
          optAnswer: this.optAnswer,
          subjectCd: this.lblSubjectID
        };

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveQuestion', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.getTest();
            this.getJobPostQuestion(this.lblSubjectID);
            subjectID = this.lblSubjectID;
            $('#addQuestionsModal').modal('hide');
            //this.app.hideSpinner();
            this.clear();
            this.lblSubjectID = subjectID;
            return false;
          } else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            //$('#companyModal').modal('hide');
            //this.app.hideSpinner();
            return false;
          }
        });

      } else {

        var saveData1 = {
          questionID: this.lblQuestionID,
          question: this.question,
          marks: this.quesMarks,
          opt1: this.opt1,
          opt2: this.opt2,
          opt3: this.opt3,
          opt4: this.opt4,
          opt1ID: this.opt1ID,
          opt2ID: this.opt2ID,
          opt3ID: this.opt3ID,
          opt4ID: this.opt4ID,
          optAnswer: this.optAnswer,
          subjectCd: this.lblSubjectID
        };

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.put(this.serverUrl + 'api/updateQuestion', saveData1, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == "Record Updated Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.getTest();
            this.getJobPostQuestion(this.lblSubjectID);
            subjectID = this.lblSubjectID;
            $('#addQuestionsModal').modal('hide');
            //this.app.hideSpinner();
            this.clear();
            this.lblSubjectID = subjectID;
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

  saveJobProfile() {

    //alert(JSON.stringify(this.jobProfileTestList)); return;
    if (this.jobProfileTestList.length == 0) {
      this.toastr.errorToastr('Please enter Job Profiles in Table', 'Error', { toastTimeout: (2500) });
      return;
    } else {
      var saveData = {
        jobProfileTestList: JSON.stringify(this.jobProfileTestList)
      };

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(this.serverUrl + 'api/saveJobProfile', saveData, { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg == "Record Saved Successfully!") {
          this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
          this.getTest();
          $('#jobProfileModal').modal('hide');
          //this.app.hideSpinner();
          this.clear();
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

  deleteJobProfile(item) {
    this.clear();
    this.lblSubjectID = item.testSbjctCd;
    this.lblJobDesigID = item.jobDesigID;
  }

  deleteQuestion(item) {

    this.clear();

    this.lblQuestionID = item.testQuesID;
    this.question = item.testQuesText;
    this.optAnswer = item.answer.toString();
    this.quesMarks = item.marks;

    for (var i = 0; i < this.testQuestionList.length; i++) {
      if (item.testQuesID == this.testQuestionList[i].testQuesID) {
        this.lblSubjectID = this.testQuestionList[i].testSbjctCd;
        if (this.opt1 == "") {

          this.opt1 = this.testQuestionList[i].testQuesOptnText;
          this.opt1ID = this.testQuestionList[i].testQuesOptnID;
        } else if (this.opt1 != "" && this.opt2 == "") {

          this.opt2 = this.testQuestionList[i].testQuesOptnText;
          this.opt2ID = this.testQuestionList[i].testQuesOptnID;
        } else if (this.opt1 != "" && this.opt2 != "" && this.opt3 == "") {

          this.opt3 = this.testQuestionList[i].testQuesOptnText;
          this.opt3ID = this.testQuestionList[i].testQuesOptnID;
        } else if (this.opt1 != "" && this.opt2 != "" && this.opt3 != "" && this.opt4 == "") {

          this.opt4 = this.testQuestionList[i].testQuesOptnText;
          this.opt4ID = this.testQuestionList[i].testQuesOptnID;
        }
      }
    }

  }

  delete() {
    var subjectID;

    if (this.txtdPassword == '') {
      this.toastr.errorToastr('Please enter password', 'Error', { toastTimeout: (2500) });
      return false
    }
    else if (this.txtdPin == '') {
      this.toastr.errorToastr('Please enter PIN', 'Error', { toastTimeout: (2500) });
      return false
    }
    else {
      //this.app.showSpinner();
      if (this.lblJobDesigID != '' && this.lblSubjectID != '') {

        this.http.delete(this.serverUrl + 'api/deleteJobProfile?subjectCd=' + this.lblSubjectID + '&jobDesigCd=' + this.lblJobDesigID).subscribe((data: any) => {

          if (data.msg == "Record Deleted Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            //this.app.hideSpinner();
            this.getTest();
            this.getJobProfileTest(this.lblSubjectID);
            subjectID = this.lblSubjectID;
            $('#deleteModal').modal('hide');
            //this.getCurrency();
            this.clear();
            this.lblSubjectID = subjectID;
            return false;
          } else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            //this.app.hideSpinner();
            //$('#deleteModal').modal('hide');
            return false;
          }
        });

      } else {

        var saveData1 = {
          questionID: this.lblQuestionID,
          question: this.question,
          marks: this.quesMarks,
          opt1: this.opt1,
          opt2: this.opt2,
          opt3: this.opt3,
          opt4: this.opt4,
          opt1ID: this.opt1ID,
          opt2ID: this.opt2ID,
          opt3ID: this.opt3ID,
          opt4ID: this.opt4ID,
          optAnswer: this.optAnswer,
          subjectCd: this.lblSubjectID
        };

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.put(this.serverUrl + 'api/deleteQuestion', saveData1, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == "Record Deleted Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.getTest();
            this.getJobPostQuestion(this.lblSubjectID);
            subjectID = this.lblSubjectID;
            $('#deleteModal').modal('hide');
            //this.app.hideSpinner();
            this.clear();
            this.lblSubjectID = subjectID;
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

  clear() {

    this.jobProfileTestList = [];
    this.jobProfile = "";
    this.subjectName = '';
    this.subjectGroup = '';
    this.lblSubject = "";
    this.lblSubjectID = "";
    this.txtdPassword = "";
    this.txtdPin = "";
    this.lblJobDesigID = "";
    this.lblQuestionID = "";
    this.question = "";
    this.optAnswer = "";
    this.quesMarks = "";
    this.opt1 = "";
    this.opt1ID = "";
    this.opt2 = "";
    this.opt2ID = "";
    this.opt3 = "";
    this.opt3ID = "";
    this.opt4 = "";
    this.opt4ID = "";

  }

  printDiv() {

    // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    // var cssAddress = ".cssAddress {font-size: 16px; }";
    // var cssContact = ".cssContact {font-size: 16px; }";

    // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

    // var printCss = commonCss + cssHeading + cssAddress + cssContact + tableCss;

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
    // let doc = new jsPDF();
    // let specialElementHandlers = {
    //   '#editor': function (element, renderer) {
    //     return true;
    //   }
    // }
    // let content = this.exportPDF.nativeElement;
    // doc.fromHTML(content.innerHTML, 15, 15, {
    //   'width': 190,
    //   'elementHandlers ': specialElementHandlers
    // });
    // doc.save('testabc.pdf');
  }


  //For CSV File 
  downloadCSV() {
    //alert('CSV works');
    // case 1: When testSearch is empty then assign full data list
    if (this.testSearch == "") {
      var completeDataList = [];
      for (var i = 0; i < this.testList.length; i++) {
        //alert(this.testSearch + " - " + this.skillCriteriaList[i].departmentName)
        completeDataList.push({
          Subject: this.testList[i].testSbjctName,
          No_Questions: this.testList[i].questionCount,
          JobProfile: this.testList[i].jobCount
        });
      }
      this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("testCompleteCSV", CsvFileTypes.CSV));
    }
    // case 2: When testSearch is not empty then assign new data list
    else if (this.testSearch != "") {
      var filteredDataList = [];
      for (var i = 0; i < this.testList.length; i++) {
        if (this.testList[i].testSbjctName.toUpperCase().includes(this.testSearch.toUpperCase()) ||
          this.testList[i].questionCount == this.testSearch || this.testList[i].jobCount == this.testSearch) {
          filteredDataList.push({
            Subject: this.testList[i].testSbjctName,
            No_Questions: this.testList[i].questionCount,
            JobProfile: this.testList[i].jobCount
          });
        }
      }

      if (filteredDataList.length > 0) {
        this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("testFilterCSV", CsvFileTypes.CSV));
      } else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }


  downloadExcel() {
    //alert('Excel works' + this.testList.length);
    //return;
    // case 1: When testSearch is empty then assign full data list
    if (this.testSearch == "") {
      //var completeDataList = [];
      for (var i = 0; i < this.testList.length; i++) {
        this.excelDataList.push({
          Subject: this.testList[i].testSbjctName,
          No_Questions: this.testList[i].questionCount,
          JobProfile: this.testList[i].jobCount
        });
      }
      this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("testCompleteExcel"));
      this.excelDataList = [];
    }
    // case 2: When testSearch is not empty then assign new data list
    else if (this.testSearch != "") {
      for (var i = 0; i < this.testList.length; i++) {
        if (this.testList[i].testSbjctName.toUpperCase().includes(this.testSearch.toUpperCase()) ||
          this.testList[i].questionCount == this.testSearch || this.testList[i].jobCount == this.testSearch) {
          this.excelDataList.push({
            Subject: this.testList[i].testSbjctName,
            No_Questions: this.testList[i].questionCount,
            JobProfile: this.testList[i].jobCount
          });
        }
      }

      if (this.excelDataList.length > 0) {
        //alert("Filter List " + this.excelDataList.length);

        this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("testFilterExcel"));
        this.excelDataList = [];
      }
      else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }
}
