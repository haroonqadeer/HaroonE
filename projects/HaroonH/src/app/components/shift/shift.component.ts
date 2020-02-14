import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { AppComponent } from "src/app/app.component";

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
  selector: "app-shift",
  templateUrl: "./shift.component.html",
  styleUrls: ["./shift.component.scss"]
})
export class ShiftComponent implements OnInit {
  // serverUrl = "http://localhost:3006/";
  serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9022/";

  p = 1;
  //pGroup = 1;
  // order = 'info.name';
  // reverse = false;
  // sortedCollection: any[];
  itemPerPage = "10";

  cmbShift = "";
  cmbDepartment = [];
  startTime = "";
  endTime = "";
  formGDepartment: FormGroup;
  formCDepartment = new FormControl();

  lblShiftCd = "";

  childList = [];
  departmentList = [];
  departmentDetailList = [];
  departmentShiftDetailList = [];
  deptShiftList = [];
  deptShiftDetailList = [];
  shiftList = [];

  //* Excel Data List
  excelDataList = [];

  constructor(
    public toastr: ToastrManager,
    private app: AppComponent,
    private excelExportService: IgxExcelExporterService,
    private csvExportService: IgxCsvExporterService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getShift();
    this.getDepartment();
    this.getDepartmentShiftDetail();
    this.getDepartmentDetail();
  }

  @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel

  getShift() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getShift", { headers: reqHeader })
      .subscribe((data: any) => {
        this.shiftList = data;
      });
  }

  getDepartment() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getDepartment?cmpnyID=59", {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        this.departmentList = data;
      });
  }

  getDepartmentShiftDetail() {
    this.app.showSpinner();

    this.deptShiftList = [];

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getDepartmentShiftDetail", {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        this.departmentShiftDetailList = data;

        var tempShiftCode = "";
        var tempList = [];

        for (var i = 0; i < this.departmentShiftDetailList.length; i++) {
          if (tempShiftCode == "") {
            this.childList.push({
              deptCd: this.departmentShiftDetailList[i].deptCd,
              deptName: this.departmentShiftDetailList[i].deptName
            });
            tempShiftCode = this.departmentShiftDetailList[i].shiftCd;
          } else if (
            tempShiftCode == this.departmentShiftDetailList[i].shiftCd
          ) {
            this.childList.push({
              deptCd: this.departmentShiftDetailList[i].deptCd,
              deptName: this.departmentShiftDetailList[i].deptName
            });
            tempShiftCode = this.departmentShiftDetailList[i].shiftCd;
            tempList.push({
              sName: this.departmentShiftDetailList[i].shiftName,
              shiftCd: this.departmentShiftDetailList[i].shiftCd,
              startTime: this.departmentShiftDetailList[i].startTime,
              endTime: this.departmentShiftDetailList[i].endTime
            });
          } else if (
            tempShiftCode != this.departmentShiftDetailList[i].shiftCd
          ) {
            this.deptShiftList.push({
              shiftName: tempList[0].sName,
              shiftCd: tempList[0].shiftCd,
              startTime: tempList[0].startTime,
              endTime: tempList[0].endTime,
              department: this.childList
            });
            this.childList = [];
            tempList = [];

            tempShiftCode = this.departmentShiftDetailList[i].shiftCd;
            this.childList.push({
              deptCd: this.departmentShiftDetailList[i].deptCd,
              deptName: this.departmentShiftDetailList[i].deptName
            });
          }

          if (i == this.departmentShiftDetailList.length - 1) {
            this.deptShiftList.push({
              shiftName: tempList[0].sName,
              shiftCd: tempList[0].shiftCd,
              startTime: tempList[0].startTime,
              endTime: tempList[0].endTime,
              department: this.childList
            });
            this.childList = [];
          }
        }

        this.app.hideSpinner();
      });
  }

  getDepartmentDetail() {
    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getDepartmentDetail", {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        this.departmentDetailList = data;

        this.app.hideSpinner();
      });
  }

  getShiftDeptDetail(shiftCd) {
    this.deptShiftDetailList = [];

    for (var i = 0; i < this.deptShiftList.length; i++) {
      for (var j = 0; j < this.departmentDetailList.length; j++) {
        if (this.departmentDetailList[j].shiftCd == shiftCd) {
          this.deptShiftDetailList.push({
            deptName: this.departmentDetailList[j].deptName
          });
        }
        i = this.deptShiftList.length + 1;
      }
    }
  }

  editShift(item) {
    var count = 0;
    var tempList = [];

    this.clear();

    for (var i = 0; i < item.department.length; i++) {
      tempList.push(item.department[i].deptCd);
    }

    this.cmbShift = item.shiftCd;
    this.startTime = item.startTime;
    this.endTime = item.endTime;
    this.cmbDepartment = tempList;
  }

  saveShift() {
    if (this.cmbShift == "") {
      this.toastr.errorToastr("Please select Shift", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.cmbDepartment.length == 0) {
      this.toastr.errorToastr("Please Select Department", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.startTime == "") {
      this.toastr.errorToastr("Please Select Start Time", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.endTime == "") {
      this.toastr.errorToastr("Please Select End Time", "Error", {
        toastTimeout: 2500
      });
      return;
    } else {
      this.app.showSpinner();

      var saveData = {
        shiftCd: this.cmbShift,
        deptList: this.cmbDepartment,
        startTime: this.startTime,
        endTime: this.endTime,
        connectedUser: this.app.empId
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/saveDepartmentShift", saveData, {
          headers: reqHeader
        })
        .subscribe((data: any) => {
          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500
            });
            this.getDepartmentShiftDetail();
            this.getDepartmentDetail();
            this.clear();
            this.app.hideSpinner();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
            //$('#companyModal').modal('hide');
            this.app.hideSpinner();
            return false;
          }
        });
    }
  }

  //*get the "id" of the delete entry
  deleteShift(item) {
    this.clear();

    this.lblShiftCd = item.shiftCd;

    this.generatePin();
  }

  /*** Pin generation or Delete Role  ***/
  generatePin() {
    //* check if global variable is empty
    if (this.app.pin != "") {
      //* Initialize List and Assign data to list. Sending list to api
      this.app.showSpinner();

      var shiftData = {
        shiftCd: this.lblShiftCd,
        connectedUser: this.app.empId
      };

      this.http
        .post(this.serverUrl + "api/deleteShift", shiftData)
        .subscribe((data: any) => {
          if (data.msg != "Record Deleted Successfully!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          } else {
            this.app.hideSpinner();
            this.app.pin = "";
            this.clear();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500
            });
            this.getDepartmentDetail();
            this.getDepartmentShiftDetail();
            return false;
          }
        });
    } else {
      this.app.genPin();
    }
  }

  clear() {
    this.cmbDepartment = [];
    this.cmbShift = "";
    this.startTime = "";
    this.endTime = "";
    this.lblShiftCd = "";
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

    var frame1 = $("<iframe />");
    frame1[0].name = "frame1";
    frame1.css({ position: "absolute", top: "-1000000px" });
    $("body").append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
      ? frame1[0].contentDocument.document
      : frame1[0].contentDocument;
    frameDoc.document.open();

    //Create a new HTML document.
    frameDoc.document.write(
      "<html><head><title>DIV Contents</title>" +
        "<style>" +
        printCss +
        "</style>"
    );

    //Append the external CSS file.  <link rel="stylesheet" href="../../../styles.scss" />  <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
    frameDoc.document.write(
      '<style type="text/css" media="print">/*@page { size: landscape; }*/</style>'
    );

    frameDoc.document.write("</head><body>");

    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write("</body></html>");

    frameDoc.document.close();

    //alert(frameDoc.document.head.innerHTML);
    // alert(frameDoc.document.body.innerHTML);

    setTimeout(function() {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      frame1.remove();
    }, 500);
  }

  downloadPDF() {}

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
    this.csvExportService.exportData(
      completeDataList,
      new IgxCsvExporterOptions("shiftCompleteCSV", CsvFileTypes.CSV)
    );
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
    this.excelExportService.export(
      this.excelDataContent,
      new IgxExcelExporterOptions("shiftCompleteExcel")
    );
    this.excelDataList = [];
  }
}
