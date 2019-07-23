import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import {
  IgxExcelExporterOptions,
  IgxExcelExporterService,
  IgxGridComponent,
  IgxCsvExporterService,
  IgxCsvExporterOptions,
  CsvFileTypes
} from "igniteui-angular";

import { AppComponent } from 'src/app/app.component';
import { ToastrManager } from 'ng6-toastr-notifications';

declare var $: any;

@Component({
  selector: 'app-trainingemployee',
  templateUrl: './trainingemployee.component.html',
  styleUrls: ['./trainingemployee.component.scss']
})
export class TrainingemployeeComponent implements OnInit {

  //serverUrl = "http://localhost:9019/";
  serverUrl = "http://52.163.189.189:9019/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  tblSearch = '';

  //* Excel Data List
  excelDataList = [];

  chkEmpBox = false;
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

  empJobTrainingList = [];

  constructor(public toastr: ToastrManager,
    private app: AppComponent,
    private excelExportService: IgxExcelExporterService,
    private csvExportService: IgxCsvExporterService,
    private http: HttpClient) { }

  ngOnInit() {
    this.getEmployeeJobTraining();
  }

  @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel

  // get training requirements list
  getEmployeeJobTraining() {
    //return false;
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getEmployeeJobTraining', { headers: reqHeader }).subscribe((data: any) => {
      this.empJobTrainingList = data
    });
  }

  clear() { }

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
      for (var i = 0; i < this.empJobTrainingList.length; i++) {
        //alert(this.tblSearch + " - " + this.skillCriteriaList[i].departmentName)
        completeDataList.push({
          EmployeeName: this.empJobTrainingList[i].indvdlFullName,
          Designation: this.empJobTrainingList[i].jobDesigName,
          Training: this.empJobTrainingList[i].trnngName,
          Institute: this.empJobTrainingList[i].orgName,
          Duration: this.empJobTrainingList[i].trnngDuration
        });
      }
      this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("trainingEmployeeCompleteCSV", CsvFileTypes.CSV));
    }

    // case 2: When tblSearch is not empty then assign new data list
    else if (this.tblSearch != "") {
      var filteredDataList = [];
      for (var i = 0; i < this.empJobTrainingList.length; i++) {
        if (this.empJobTrainingList[i].indvdlFullName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.empJobTrainingList[i].jobDesigName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.empJobTrainingList[i].trnngName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.empJobTrainingList[i].orgName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
          filteredDataList.push({
            EmployeeName: this.empJobTrainingList[i].indvdlFullName,
            Designation: this.empJobTrainingList[i].jobDesigName,
            Training: this.empJobTrainingList[i].trnngName,
            Institute: this.empJobTrainingList[i].orgName,
            Duration: this.empJobTrainingList[i].trnngDuration
          });
        }
      }

      if (filteredDataList.length > 0) {
        this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("trainingEmployeeFilterCSV", CsvFileTypes.CSV));
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
      for (var i = 0; i < this.empJobTrainingList.length; i++) {
        this.excelDataList.push({
          EmployeeName: this.empJobTrainingList[i].indvdlFullName,
          Designation: this.empJobTrainingList[i].jobDesigName,
          Training: this.empJobTrainingList[i].trnngName,
          Institute: this.empJobTrainingList[i].orgName,
          Duration: this.empJobTrainingList[i].trnngDuration
        });
      }
      this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("trainingEmployeeCompleteExcel"));
      this.excelDataList = [];
    }
    // case 2: When tblSearch is not empty then assign new data list
    else if (this.tblSearch != "") {
      for (var i = 0; i < this.empJobTrainingList.length; i++) {
        if (this.empJobTrainingList[i].indvdlFullName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.empJobTrainingList[i].jobDesigName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.empJobTrainingList[i].trnngName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.empJobTrainingList[i].orgName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
          this.excelDataList.push({
            EmployeeName: this.empJobTrainingList[i].indvdlFullName,
            Designation: this.empJobTrainingList[i].jobDesigName,
            Training: this.empJobTrainingList[i].trnngName,
            Institute: this.empJobTrainingList[i].orgName,
            Duration: this.empJobTrainingList[i].trnngDuration
          });
        }
      }

      if (this.excelDataList.length > 0) {
        //alert("Filter List " + this.excelDataList.length);

        this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("trainingEmployeeFilterExcel"));
        this.excelDataList = [];
      }
      else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }

}
