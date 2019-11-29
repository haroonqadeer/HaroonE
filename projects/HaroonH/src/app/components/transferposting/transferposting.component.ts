import { Component, OnInit, ViewChild } from "@angular/core";
import { SelectItem } from "primeng/api";
import { ToastrManager } from "ng6-toastr-notifications";
import { HttpHeaders, HttpClient } from "@angular/common/http";

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
  selector: "app-transferposting",
  templateUrl: "./transferposting.component.html",
  styleUrls: ["./transferposting.component.scss"]
})
export class TransferpostingComponent implements OnInit {
  //serverUrl = "http://localhost:9029/";
  serverUrl = "http://52.163.189.189:9029/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  //*Bolean variable
  updateFlag = false;

  //* list for excel data
  excelDataList = [];

  availablePostsList = [];
  employeeList = [];
  emp1List = [];
  emp2List = [];

  //* variables for pagination and orderby pipe
  p = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  //* Variables for NgModels
  tblSearch;

  ddlEmployee1;
  ddlEmployee2;

  efectDate;

  JobDesigID1;
  JobPostDeptCd1;
  JobPostLocationCd1;
  lblBranch1;
  lblDepartment1;
  lblPayGrade1;

  JobDesigID2;
  JobPostDeptCd2;
  JobPostLocationCd2;
  lblBranch2;
  lblDepartment2;
  lblPayGrade2;

  txtdPassword = "";
  txtdPin = "";

  constructor(
    public toastr: ToastrManager,
    private app: AppComponent,
    private excelExportService: IgxExcelExporterService,
    private csvExportService: IgxCsvExporterService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // this.getAppointedEmployee();
    // this.getEmployee();
  }

  @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel

  //function for get all available posts
  getAppointedEmployee() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getAppointedEmployee", { headers: reqHeader })
      .subscribe((data: any) => {
        this.employeeList = data;

        this.app.hideSpinner();
      });
  }

  //function for get employees
  getEmployee() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getEmployee", { headers: reqHeader })
      .subscribe((data: any) => {
        //this.employeeList = data;
        for (var i = 0; i < data.length; i++) {
          this.emp1List.push({
            label: data[i].indvdlFullName + " - " + data[i].payGradeName,
            value: data[i].indvdlID,
            jobDesigID: data[i].jobDesigID,
            jobDesigName: data[i].jobDesigName,
            jobPostDeptCd: data[i].jobPostDeptCd,
            jobPostLocationCd: data[i].jobPostLocationCd,
            payGradeName: data[i].payGradeName,
            deptName: data[i].deptName,
            locationName: data[i].locationName
          });
        }

        this.app.hideSpinner();
      });
  }

  //Function for save and update leave Type
  save() {
    if (this.ddlEmployee1 == undefined || this.ddlEmployee1 == "") {
      this.toastr.errorToastr("Please select employee 1", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.ddlEmployee2 == undefined || this.ddlEmployee2 == "") {
      this.toastr.errorToastr("Please select employee 2", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.efectDate == undefined || this.efectDate == "") {
      this.toastr.errorToastr("Please enter effect date", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.JobDesigID1 == "" || this.JobDesigID2 == "") {
      this.toastr.errorToastr("Invalid request", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      this.app.showSpinner();
      //* ********************************************save data
      var saveData = {
        IndvdlID: this.ddlEmployee1,
        IndvdlID2: this.ddlEmployee2,
        JobDesigID: this.JobDesigID1,
        JobPostDeptCd: this.JobPostDeptCd1,
        JobPostLocationCd: this.JobPostLocationCd1,
        EmpJobAppntmntDt: this.efectDate,
        JobDesigID2: this.JobDesigID2,
        JobPostDeptCd2: this.JobPostDeptCd2,
        JobPostLocationCd2: this.JobPostLocationCd2,
        ConnectedUser: 12000, //this.app.empId,
        DelFlag: 0
      };

      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/transferEmployee", saveData, {
          headers: reqHeader
        })
        .subscribe((data: any) => {
          if (data.msg != "Record Updated Successfully!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500
            });
            this.getAppointedEmployee();
            this.clear();
            return false;
          }
        });
    }
  }

  //function for edit existing leave type
  edit(item) {
    this.clear();
    this.updateFlag = true;
  }

  //function for empty all fields
  clear() {
    this.updateFlag = false;

    this.ddlEmployee1;
    this.ddlEmployee2;

    this.efectDate;

    this.JobDesigID1;
    this.JobPostDeptCd1;
    this.JobPostLocationCd1;
    this.lblBranch1;
    this.lblDepartment1;
    this.lblPayGrade1;

    this.JobDesigID2;
    this.JobPostDeptCd2;
    this.JobPostLocationCd2;
    this.lblBranch2;
    this.lblDepartment2;
    this.lblPayGrade2;

    this.txtdPassword = "";
    this.txtdPin = "";
  }

  //function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  //function for get filtere data from list
  getFilterItem(filterOption) {
    var dataList = [];

    if (filterOption == "filteremp1") {
      dataList = this.emp1List.filter(x => x.value == this.ddlEmployee1);

      this.lblBranch1 = dataList[0].locationName;
      this.lblDepartment1 = dataList[0].deptName;
      this.lblPayGrade1 = dataList[0].payGradeName;

      this.JobDesigID1 = dataList[0].jobDesigID;
      this.JobPostDeptCd1 = dataList[0].jobPostDeptCd;
      this.JobPostLocationCd1 = dataList[0].jobPostLocationCd;

      var new_dataList = [];
      this.emp2List = [];
      this.ddlEmployee2 = "";

      new_dataList = this.emp1List.filter(
        x =>
          x.payGradeName == dataList[0].payGradeName &&
          x.value != this.ddlEmployee1
      );

      this.emp2List = new_dataList;
    }

    if (filterOption == "filteremp2") {
      dataList = this.emp2List.filter(x => x.value == this.ddlEmployee2);

      this.lblBranch2 = dataList[0].locationName;
      this.lblDepartment2 = dataList[0].deptName;
      this.lblPayGrade2 = dataList[0].payGradeName;

      this.JobDesigID2 = dataList[0].jobDesigID;
      this.JobPostDeptCd2 = dataList[0].jobPostDeptCd;
      this.JobPostLocationCd2 = dataList[0].jobPostLocationCd;
    }
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
    // //alert('CSV works');
    // // case 1: When tblSearch is empty then assign full data list
    // if (this.tblSearch == "") {
    //     var completeDataList = [];
    //     for (var i = 0; i < this.leaveRuleList.length; i++) {
    //         //alert(this.tblSearch + " - " + this.skillCriteriaList[i].departmentName)
    //         completeDataList.push({
    //             LeaveType: this.leaveRuleList[i].leaveTypeName,
    //             Nature: this.leaveRuleList[i].leaveNatureName,
    //             Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
    //             Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
    //         });
    //     }
    //     this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("LeaveRulesCompleteCSV", CsvFileTypes.CSV));
    // }
    // // case 2: When tblSearch is not empty then assign new data list
    // else if (this.tblSearch != "") {
    //     var filteredDataList = [];
    //     for (var i = 0; i < this.leaveRuleList.length; i++) {
    //         if (this.leaveRuleList[i].leaveTypeName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
    //             this.leaveRuleList[i].leaveNatureName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
    //             this.leaveRuleList[i].leaveLmtName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
    //             this.leaveRuleList[i].leaveLmtAmoUNt == this.tblSearch) {
    //             filteredDataList.push({
    //                 LeaveType: this.leaveRuleList[i].leaveTypeName,
    //                 Nature: this.leaveRuleList[i].leaveNatureName,
    //                 Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
    //                 Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
    //             });
    //         }
    //     }
    //     if (filteredDataList.length > 0) {
    //         this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("LeaveRulesFilterCSV", CsvFileTypes.CSV));
    //     } else {
    //         this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
    //     }
    // }
  }

  downloadExcel() {
    // //alert('Excel works');
    // // case 1: When tblSearch is empty then assign full data list
    // if (this.tblSearch == "") {
    //     //var completeDataList = [];
    //     for (var i = 0; i < this.leaveRuleList.length; i++) {
    //         this.excelDataList.push({
    //             LeaveType: this.leaveRuleList[i].leaveTypeName,
    //             Nature: this.leaveRuleList[i].leaveNatureName,
    //             Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
    //             Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
    //         });
    //     }
    //     this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("LeaveRulesCompleteExcel"));
    //     this.excelDataList = [];
    // }
    // // case 2: When tblSearch is not empty then assign new data list
    // else if (this.tblSearch != "") {
    //     for (var i = 0; i < this.leaveRuleList.length; i++) {
    //         if (this.leaveRuleList[i].leaveTypeName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
    //             this.leaveRuleList[i].leaveNatureName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
    //             this.leaveRuleList[i].leaveLmtName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
    //             this.leaveRuleList[i].leaveLmtAmoUNt == this.tblSearch) {
    //             this.excelDataList.push({
    //                 LeaveType: this.leaveRuleList[i].leaveTypeName,
    //                 Nature: this.leaveRuleList[i].leaveNatureName,
    //                 Limit: this.leaveRuleList[i].leaveLmtAmoUNt,
    //                 Per_Month_Annual: this.leaveRuleList[i].leaveLmtName
    //             });
    //         }
    //     }
    //     if (this.excelDataList.length > 0) {
    //         //alert("Filter List " + this.excelDataList.length);
    //         this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("LeaveRulesFilterExcel"));
    //         this.excelDataList = [];
    //     }
    //     else {
    //         this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
    //     }
    // }
  }
}
