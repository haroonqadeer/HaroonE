import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';
import {
  IgxExcelExporterService,
  IgxCsvExporterService,
  IgxCsvExporterOptions,
  IgxExcelExporterOptions,
  CsvFileTypes,
  IgxGridComponent
} from 'igniteui-angular';

import { AppComponent } from 'src/app/app.component';

declare var $: any;

@Component({
  selector: 'app-trainingrequirements',
  templateUrl: './trainingrequirements.component.html',
  styleUrls: ['./trainingrequirements.component.scss']
})
export class TrainingrequirementsComponent implements OnInit {

  //serverUrl = "http://localhost:9019/";
  serverUrl = "http://52.163.189.189:9019/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  tblSearch = '';
  tblSearchAssign = '';

  //* Ng-Models for Main page */

  trainingRequirementList = [];
  // trainingRequirementList = [
  //   {
  //     empId: 1,
  //     empName: 'Aamir',
  //     jobDesgId: 1,
  //     jobDesgName: 'Software Developer',
  //     qlfctnCriteriaReqdLvl: 3,
  //     levelAchieved: 2,
  //     select: null
  //   },
  //   {
  //     empId: 2,
  //     empName: 'Zohaib',
  //     jobDesgId: 2,
  //     jobDesgName: 'Graphic Designer',
  //     qlfctnCriteriaReqdLvl: 2,
  //     levelAchieved: 3,
  //     select: null
  //   },
  //   {
  //     empId: 3,
  //     empName: 'Zain',
  //     jobDesgId: 1,
  //     jobDesgName: 'Software Developer',
  //     qlfctnCriteriaReqdLvl: 3,
  //     levelAchieved: 2,
  //     select: null
  //   },
  // ];


  //* Ng-Models for Assign Models /
  tTrainingId = '';
  tTrainingType = '';
  trainingTypeList = [];
  tTraining = '';
  trainingList = [];
  tTrainingInstitute = '';
  trainingInstituteList = [];
  tTrainingDuration = '';
  startDate = '';
  endDate = '';
  startPicker = '';
  endPicker = '';

  //* Excel Data List
  excelDataList = [];

  //chkEmpBox;
  status = 'Pending';

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
    this.getTrainingRequirements();
    this.getTraining();
    this.getTrainingType();
    this.getTrainingInstitute();

    // for (var i = 0; i < this.trainingRequirementList.length; i++) {

    //   var value = this.

    // }

  }

  @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel


  // get training requirements list
  getTrainingRequirements() {
    //return false;
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getTrainingRequirements', { headers: reqHeader }).subscribe((data: any) => {
      this.trainingRequirementList = data
    });
  }

  // get training list
  getTraining() {
    //return false;
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getTraining', { headers: reqHeader }).subscribe((data: any) => {
      this.trainingList = data
    });
  }


  // get training type list
  getTrainingType() {

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getTrainingType', { headers: reqHeader }).subscribe((data: any) => {
      this.trainingTypeList = data
    });

  }

  // get training institute list
  getTrainingInstitute() {
    //return false;
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getTrainingInstitute', { headers: reqHeader }).subscribe((data: any) => {
      this.trainingInstituteList = data
    });
  }

  tDuration(item) {

    for (var i = 0; i < this.trainingRequirementList.length; i++) {
      if (item.value == this.trainingRequirementList[i].trnngCd) {
        this.tTrainingDuration = this.trainingRequirementList[i].trnngDuration;
      }
    }
    //alert("value :  " + value);
    //this.tTrainingDuration = value;
  }

  //* for Start Date & End Date interval.

  // dateChange(dateValue) {
  //   alert(dateValue.value);
  //   //alert(moment(dateValue).format("MMM D YY"));
  //   //this.endDate = moment.duration(this.tTrainingDuration, 'months');
  //   var duration = parseInt(this.tTrainingDuration);

  //   alert("Duration: " + duration);

  //   if (isNaN(duration)) {
  //     alert('Invalid duration');
  //     return false;
  //   }

  //   var endDt = dateValue.split("/");
  //   var date = endDt[0];
  //   var month = endDt[1];
  //   var year = endDt[2];

  //   if (parseInt(month) == 2) {//feb month
  //     var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));

  //     if (parseInt(date) > 29 || (parseInt(date) == 29 && !isleap)) {
  //       alert("February " + year + " doesn't have " + date + " days!");
  //       return false;
  //     }
  //   }


  //   var myDate = new Date(year, month - 1, date - 1);
  //   myDate.setMonth(myDate.getMonth() + duration);

  //   alert("New myDate: " + myDate);

  //   var dd = new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate());
  //   this.endDate = this.append(dd.getDate()) + "/" + this.append((dd.getMonth() + 1)) + "/" + dd.getFullYear();
  //   //var newDate = this.endDate;

  //   alert(this.endDate);

  //   return this.endDate;
  // }

  // append(x) {
  //   return (x < 0 || x > 9 ? "" : "0") + x
  // }

  // chkBoxClick() {
  //   alert(this.chkEmpBox);

  //   var valueChk = this.chkEmpBox;

  //   if (valueChk == true) {
  //     //alert("if");s
  //     this.status = 'Selected';
  //   }
  //   else if (valueChk == false) {
  //     //alert(" else if");
  //     this.status = 'Pending';
  //   }
  // }

  //* function for calculating 
  calculate(v1, v2) {
    var result = v1 - v2;
    if (result < 0) {
      return result = 0;
    }
    else {
      return result;
    }
  }

  //* temporary list for selected checkbox */
  selectedList = [];

  exist(item) {
    return this.selectedList.indexOf(item) > -1;
  }

  toggleSelection(item) {
    var idx = this.selectedList.indexOf(item);
    if (idx > -1) {
      this.selectedList.splice(idx, 1);
    }
    else {
      this.selectedList.push(item);
    }
  }

  assignTraining() {

    // alert("List: " + this.selectedList.length);
    // alert("Trnnc Code: " + this.tTraining);

    if (this.tTrainingType == "") {
      this.toastr.errorToastr('Please Select Training Type', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.tTraining == "") {
      this.toastr.errorToastr('Please Select Training Name', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.tTrainingInstitute == "") {
      this.toastr.errorToastr('Please Select Institute', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.startDate == "") {
      this.toastr.errorToastr('Please Select Start Training Date', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.endDate == "") {
      this.toastr.errorToastr('Please Select End Training Date', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.selectedList.length < 0 || this.selectedList.length == 0) {
      this.toastr.errorToastr('Oops! No Employee for Training', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {
      if (this.tTrainingId != "") {
        return false;
        // var updateData = {
        //   "trnngCd": this.trainingId,
        //   "trnngTypeCd": this.trainingType,
        //   "trnngName": this.trainingName,
        //   "trnngDesc": this.trainingDesc,
        //   "vndrId": this.trainingInstitute,
        //   "trnngDuration": this.trainingDuration,
        //   "connectedUser": 12000
        // };

        // var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        // this.http.put(this.serverUrl + 'api/updateTraining', updateData, { headers: reqHeader }).subscribe((data: any) => {

        //   //alert(data.msg);

        //   if (data.msg == 'Record Updated Successfully!') {

        //     this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });

        //     this.clear();
        //     $('#addTrainingTypeModal').modal('hide');
        //     this.getTraining();
        //     //this.getCertificateCriteria();

        //     return false;

        //   }
        //   else if (data.msg == "Update - Training Already Exist!") {
        //     this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
        //     this.clear();
        //     //$('#addTrainingTypeModal').modal('hide');
        //     this.getTraining();
        //     //this.getCertificateCriteria();
        //     return false;
        //   }
        //   else if (data.msg == "Update - Vendor Training Already Exist!") {
        //     this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
        //     this.clear();
        //     //$('#addTrainingTypeModal').modal('hide');
        //     this.getTraining();
        //     //this.getCertificateCriteria();
        //     return false;
        //   }
        //   else {
        //     this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
        //     this.clear();
        //     //$('#addTrainingTypeModal').modal('hide');
        //     this.getTraining();
        //     //this.getCertificateCriteria();
        //     return false;
        //   }

        // });
      }

      else {
        var saveData = {
          "trnngTypeCd": this.tTrainingType,
          "trnngCd": this.tTraining,
          "vndrId": this.tTrainingInstitute,
          "empTrnngStartDt": this.startDate,
          "empTrnngEndDt": this.endDate,
          "empJobtrainingRequirementList": JSON.stringify(this.selectedList),
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
        //alert(reqHeader);
        this.http.post(this.serverUrl + 'api/saveEmpJobTraining', saveData, { responseType: 'json' }).subscribe((data: any) => {
          // this.http.post(this.serverUrl + 'api/saveDepartment', saveData).subscribe((data: any) => {

          //alert(data.msg);
          //return false;

          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#assignTrainingModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();

            return false;
          }
          else if (data.msg == "Insert - Training Already Exists") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();
            return false;
          }
          else if (data.msg == "Insert - Vendor Training Already Exist!") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();
            return false;
          }
          else {
            this.toastr.errorToastr(data.msg, 'Error !', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();

            return false;
          }
        });
      }
    }
  }

  clear() {
    this.tTrainingType = '';
    //trainingTypeList = [];
    this.tTraining = '';
    //trainingRequirementList = [];
    this.tTrainingInstitute = '';
    this.tTrainingDuration = '';
    //trainingInstituteList = [];
    this.startDate = '';
    this.endDate = '';
    this.startPicker = '';
    this.endPicker = '';
    //this.selectedList = [];
  }

  //function for sorting/orderBy table data 
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  printDiv() {

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
      //var result = 0;
      for (var i = 0; i < this.trainingRequirementList.length; i++) {
        //alert(this.tblSearch + " - " + this.skillCriteriaList[i].departmentName)
        // result = this.trainingRequirementList[i].qlfctnCriteriaReqdLvl - this.trainingRequirementList[i].levelAchieved;

        //alert('result ' + result);

        completeDataList.push({
          EmployeeName: this.trainingRequirementList[i].indvdlFullName,
          Designation: this.trainingRequirementList[i].jobDesigName,
          SkillDifference: (this.trainingRequirementList[i].qlfctnCriteriaReqdLvl - this.trainingRequirementList[i].levelAchieved)
        });
      }
      this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("trainingRequirementCompleteCSV", CsvFileTypes.CSV));
    }
    // case 2: When tblSearch is not empty then assign new data list
    else if (this.tblSearch != "") {
      var filteredDataList = [];
      for (var i = 0; i < this.trainingRequirementList.length; i++) {
        if (this.trainingRequirementList[i].indvdlFullName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.trainingRequirementList[i].jobDesigName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
          filteredDataList.push({
            EmployeeName: this.trainingRequirementList[i].indvdlFullName,
            Designation: this.trainingRequirementList[i].jobDesigName,
            SkillDifference: (this.trainingRequirementList[i].qlfctnCriteriaReqdLvl - this.trainingRequirementList[i].levelAchieved)
          });
        }
      }

      if (filteredDataList.length > 0) {
        this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("trainingRequirementFilterCSV", CsvFileTypes.CSV));
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
      for (var i = 0; i < this.trainingRequirementList.length; i++) {
        this.excelDataList.push({
          EmployeeName: this.trainingRequirementList[i].indvdlFullName,
          Designation: this.trainingRequirementList[i].jobDesigName,
          SkillDifference: (this.trainingRequirementList[i].qlfctnCriteriaReqdLvl - this.trainingRequirementList[i].levelAchieved)
        });
      }
      this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("trainingRequirementCompleteExcel"));
      this.excelDataList = [];
    }
    // case 2: When tblSearch is not empty then assign new data list
    else if (this.tblSearch != "") {
      for (var i = 0; i < this.trainingRequirementList.length; i++) {
        if (this.trainingRequirementList[i].indvdlFullName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.trainingRequirementList[i].jobDesigName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
          this.excelDataList.push({
            EmployeeName: this.trainingRequirementList[i].indvdlFullName,
            Designation: this.trainingRequirementList[i].jobDesigName,
            SkillDifference: (this.trainingRequirementList[i].qlfctnCriteriaReqdLvl - this.trainingRequirementList[i].levelAchieved)
          });
        }
      }

      if (this.excelDataList.length > 0) {
        //alert("Filter List " + this.excelDataList.length);

        this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("trainingRequirementFilterExcel"));
        this.excelDataList = [];
      }
      else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }

}
