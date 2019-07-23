import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';

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
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {

  //serverUrl = "http://localhost:9022/";
  serverUrl = "http://52.163.189.189:9022/";

  p = 1;
  //pGroup = 1;
  // order = 'info.name';
  // reverse = false;
  // sortedCollection: any[];
  itemPerPage = '10';

  cmbShift = "";
  cmbDepartment = "";
  startTime = "";
  endTime = "";

  lblShiftName = "";
  lblStartTime = "";
  lblEndTime = "";

  departmentList = [];
  departmentDetailList = [];
  deptShiftList = [];
  deptShiftDetailList = [];
  shiftList = [];

  //* Excel Data List
  excelDataList = [];

  constructor(public toastr: ToastrManager,
    private app: AppComponent,
    private excelExportService: IgxExcelExporterService,
    private csvExportService: IgxCsvExporterService,
    private http: HttpClient) { }

  ngOnInit() {
    this.getShift();
    this.getDepartment();
    this.getDepartmentShift();
    this.getDepartmentDetail();
  }

  @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel


  getShift() {

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getShift', { headers: reqHeader }).subscribe((data: any) => {

      this.shiftList = data;
    });
  }

  getDepartment() {

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getDepartment?cmpnyID=59', { headers: reqHeader }).subscribe((data: any) => {

      this.departmentList = data;
    });
  }

  getDepartmentShift() {

    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getDepartmentShift?cmpnyID=59', { headers: reqHeader }).subscribe((data: any) => {

      this.deptShiftList = data;

      this.app.hideSpinner();

    });
  }

  getDepartmentDetail() {

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getDepartmentShiftDetail?cmpnyID=59', { headers: reqHeader }).subscribe((data: any) => {

      this.departmentDetailList = data;

      this.app.hideSpinner();

    });

  }

  getDepartmentShiftDetail(shiftCd, shiftName, startTime, endTime) {

    this.deptShiftDetailList = [];
    this.lblShiftName = "";
    this.lblStartTime = "";
    this.lblEndTime = "";

    for (var i = 0; i < this.deptShiftList.length; i++) {
      if (this.deptShiftList[i].shiftName == shiftName &&
        this.deptShiftList[i].startTime == startTime &&
        this.deptShiftList[i].endTime == endTime) {
        this.lblShiftName = shiftName;
        this.lblStartTime = startTime;
        this.lblEndTime = endTime;
        for (var j = 0; j < this.departmentDetailList.length; j++) {
          if (this.departmentDetailList[j].shiftCd == shiftCd &&
            this.departmentDetailList[j].startTime == startTime &&
            this.departmentDetailList[j].endTime == endTime) {
            this.deptShiftDetailList.push({
              deptName: this.departmentDetailList[j].deptName
            });
          }
        }
        i = this.deptShiftList.length + 1;
      }
    }
  }
  saveShift() {

    if (this.cmbShift == '') {
      this.toastr.errorToastr('Please select Shift', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.cmbDepartment == '') {
      this.toastr.errorToastr('Please Select Department', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.startTime == '') {
      this.toastr.errorToastr('Please Select Start Time', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.endTime == '') {
      this.toastr.errorToastr('Please Select End Time', 'Error', { toastTimeout: (2500) });
      return;
    } else {

      this.app.showSpinner();

      var saveData = {
        shiftCd: this.cmbShift,
        deptList: this.cmbDepartment,
        startTime: this.startTime,
        endTime: this.endTime
      };

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(this.serverUrl + 'api/saveDepartmentShift', saveData, { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg == "Record Saved Successfully!") {
          this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
          this.getDepartmentShift();
          this.clear();
          this.app.hideSpinner();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
          //$('#companyModal').modal('hide');
          this.app.hideSpinner();
          return false;
        }
      });

    }
  }
  clear() {
    this.cmbDepartment = "";
    this.cmbShift = "";
    this.startTime = "";
    this.endTime = "";
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
    var completeDataList = [];
    for (var i = 0; i < this.deptShiftList.length; i++) {
      completeDataList.push({
        ShiftName: this.deptShiftList[i].shiftName,
        Department: this.deptShiftList[i].deptCd,
        StartTime: this.deptShiftList[i].startTime,
        EndTime: this.deptShiftList[i].endTime
      });
    }
    this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("shiftCompleteCSV", CsvFileTypes.CSV));
  }


  downloadExcel() {
    //alert('Excel works');
    for (var i = 0; i < this.deptShiftList.length; i++) {
      this.excelDataList.push({
        ShiftName: this.deptShiftList[i].shiftName,
        Department: this.deptShiftList[i].deptCd,
        StartTime: this.deptShiftList[i].startTime,
        EndTime: this.deptShiftList[i].endTime
      });
    }
    this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("shiftCompleteExcel"));
    this.excelDataList = [];
  }


}
