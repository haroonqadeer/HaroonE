import { Component, OnInit, ViewChild } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { OrderPipe } from "ngx-order-pipe";
import { AppComponent } from "src/app/app.component";

// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";

declare var $: any;

@Component({
  selector: "app-leavetype",
  templateUrl: "./leavetype.component.html",
  styleUrls: ["./leavetype.component.scss"]
})
export class LeavetypeComponent implements OnInit {
  // serverUrl = "http://localhost:5000/";
  serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9014/";

  tokenKey = "token";
  leaveHeading = "Add";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  updateFlag = false;

  //* list for excel data
  excelDataListType = [];
  excelDataListNature = [];

  leaveTypeList = [];
  leaveRuleList = [];
  typeList = [];
  leaveNatureList = [];

  //* variables for pagination and orderby pipe
  p = 1;
  p1 = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";
  itemPerPage1 = "10";

  //* Variables for NgModels
  tblSearchType;
  tblSearchNature;

  leaveRuleId = "";
  leaveTypeId = "";
  leaveType = "";
  leaveDescription = "";
  noOfLeave = "";
  leaveLimit = "";
  appliedFrom;

  leaveNatureId = "";
  leaveNature = "";
  natureDescription = "";

  txtdPassword = "";
  txtdPin = "";

  constructor(
    public toastr: ToastrManager,
    private app: AppComponent,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getLeaveTypes();
    this.getLeaveNature();
    this.getLeaveRule();
  }

  // @ViewChild("excelDataContentType")
  // public excelDataContentType: IgxGridComponent; //For excel
  // @ViewChild("excelDataContentNature")
  // public excelDataContentNature: IgxGridComponent; //For excel

  //function for get all saved leave types
  getLeaveTypes() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getLeaveType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.leaveTypeList = data;
        this.app.hideSpinner();
      });
  }

  //function for get all saved leave types
  getLeaveRule() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getLeaveRule", { headers: reqHeader })
      .subscribe((data: any) => {
        this.leaveRuleList = data;
        this.app.hideSpinner();
      });
  }

  //function for get all saved leave nature
  getLeaveNature() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getLeaveNature", { headers: reqHeader })
      .subscribe((data: any) => {
        this.leaveNatureList = data;
        this.app.hideSpinner();
      });
  }

  //Function for save and update leave Type
  save() {
    if (this.leaveType == "") {
      this.toastr.errorToastr("Please enter leave type", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.leaveNature == "") {
      this.toastr.errorToastr("Please enter leave nature", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.noOfLeave == "") {
      this.toastr.errorToastr("Please enter No of Leave", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.leaveLimit == "") {
      this.toastr.errorToastr("Please enter leave Limit", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (
      this.appliedFrom == undefined ||
      this.appliedFrom == "" ||
      this.appliedFrom == null
    ) {
      this.toastr.errorToastr("Please select Date", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      if (this.leaveRuleId != "") {
        this.app.showSpinner();
        //* ********************************************update data
        var updateData = {
          LeaveRuleID: this.leaveRuleId,
          LeaveTypeCd: this.leaveType,
          LeaveNatureCd: this.leaveNature,
          LeaveLmtAmount: this.leaveLimit,
          noOfLeave: this.noOfLeave,
          appliedDate: this.appliedFrom,
          ConnectedUser: this.app.empId,
          DelFlag: 0
        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http
          .post(this.serverUrl + "api/saveLeaveRule", updateData, {
            headers: reqHeader
          })
          .subscribe((data: any) => {
            if (data.msg != "Record Updated Successfully!") {
              this.app.hideSpinner();
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500
              });
              return false;
            } else {
              this.app.hideSpinner();
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500
              });
              $("#typeModal").modal("hide");
              this.getLeaveRule();
              return false;
            }
          });
      } else {
        this.app.showSpinner();
        //* ********************************************save data
        var saveData = {
          LeaveRuleID: 0,
          LeaveTypeCd: this.leaveType,
          LeaveNatureCd: this.leaveNature,
          LeaveLmtAmount: this.leaveLimit,
          noOfLeave: this.noOfLeave,
          appliedDate: this.appliedFrom,
          ConnectedUser: this.app.empId,
          DelFlag: 0
        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http
          .post(this.serverUrl + "api/saveLeaveRule", saveData, {
            headers: reqHeader
          })
          .subscribe((data: any) => {
            if (data.msg != "Record Saved Successfully!") {
              this.app.hideSpinner();
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500
              });
              return false;
            } else {
              this.app.hideSpinner();
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500
              });
              this.getLeaveRule();
              $("#typeModal").modal("hide");
              return false;
            }
          });
      }
    }
  }

  //function for edit existing leave type
  editLeaveRule(item) {
    this.clear();
    this.leaveHeading = "Edit";

    this.leaveRuleId = item.leaveRuleID;
    this.leaveType = item.leaveTypeCd;
    this.leaveNature = item.leaveNatureCd;
    this.noOfLeave = item.noOfLeave;
    this.leaveLimit = item.leaveLmtCd.toString();
    this.appliedFrom = this.app.convertStringToDate(item.appliedDate);
  }

  //*get the "id" of the delete entry
  deleteLeaveRule(item) {
    this.clear();

    this.leaveRuleId = item.leaveRuleID;

    this.generatePin();
  }

  /*** Pin generation or Delete Role  ***/
  generatePin() {
    //* check if global variable is empty
    if (this.app.pin != "") {
      //* Initialize List and Assign data to list. Sending list to api
      this.app.showSpinner();

      var currentDate = new Date();

      // alert(currentDate);
      // return;
      var saveData = {
        LeaveRuleID: this.leaveRuleId,
        LeaveNatureCd: 0,
        LeaveTypeCd: 0,
        LeaveLmtAmount: 0,
        noOfLeave: 0,
        appliedDate: currentDate,
        ConnectedUser: this.app.empId,
        DelFlag: 1
      };

      this.http
        .post(this.serverUrl + "api/saveLeaveRule", saveData)
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
            this.getLeaveRule();
            return false;
          }
        });
    } else {
      this.app.genPin();
    }
  }

  //function for empty all fields
  clear() {
    this.updateFlag = false;

    this.leaveRuleId = "";
    this.leaveHeading = "Add";
    this.leaveTypeId = "";
    this.leaveType = "";
    this.leaveDescription = "";
    this.noOfLeave = "";
    this.leaveLimit = "";
    this.appliedFrom = "";

    this.leaveNatureId = "";
    this.leaveNature = "";
    this.natureDescription = "";

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

  printDivType() {
    // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    // var cssAddress = ".cssAddress {font-size: 16px; }";
    // var cssContact = ".cssContact {font-size: 16px; }";

    // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

    var printCss = this.app.printCSS();

    //printCss = printCss + "";

    var contents = $("#printAreaType").html();

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

  downloadPDFType() {}

  // downloadCSVType() {
  //   //alert('CSV works');
  //   // case 1: When tblSearch is empty then assign full data list
  //   if (this.tblSearchType == "") {
  //     var completeDataList = [];
  //     for (var i = 0; i < this.leaveTypeList.length; i++) {
  //       //alert(this.tblSearchType + " - " + this.skillCriteriaList[i].departmentName)
  //       completeDataList.push({
  //         LeaveType: this.leaveTypeList[i].leaveTypeName,
  //         Description: this.leaveTypeList[i].leaveTypeDesc
  //       });
  //     }
  //     this.csvExportService.exportData(
  //       completeDataList,
  //       new IgxCsvExporterOptions("LeaveTypeCompleteCSV", CsvFileTypes.CSV)
  //     );
  //   }
  //   // case 2: When tblSearchType is not empty then assign new data list
  //   else if (this.tblSearchType != "") {
  //     var filteredDataList = [];
  //     for (var i = 0; i < this.leaveTypeList.length; i++) {
  //       if (
  //         this.leaveTypeList[i].leaveTypeName
  //           .toUpperCase()
  //           .includes(this.tblSearchType.toUpperCase()) ||
  //         this.leaveTypeList[i].leaveTypeDesc
  //           .toUpperCase()
  //           .includes(this.tblSearchType.toUpperCase())
  //       ) {
  //         filteredDataList.push({
  //           LeaveType: this.leaveTypeList[i].leaveTypeName,
  //           Description: this.leaveTypeList[i].leaveTypeDesc
  //         });
  //       }
  //     }

  //     if (filteredDataList.length > 0) {
  //       this.csvExportService.exportData(
  //         filteredDataList,
  //         new IgxCsvExporterOptions("LeaveTypeFilterCSV", CsvFileTypes.CSV)
  //       );
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }

  // downloadExcelType() {
  //   //alert('Excel works');
  //   // case 1: When tblSearchType is empty then assign full data list
  //   if (this.tblSearchType == "") {
  //     //var completeDataList = [];
  //     for (var i = 0; i < this.leaveTypeList.length; i++) {
  //       this.excelDataListType.push({
  //         LeaveType: this.leaveTypeList[i].leaveTypeName,
  //         Description: this.leaveTypeList[i].leaveTypeDesc
  //       });
  //     }
  //     this.excelExportService.export(
  //       this.excelDataContentType,
  //       new IgxExcelExporterOptions("LeaveTypeCompleteExcel")
  //     );
  //     this.excelDataListType = [];
  //   }
  //   // case 2: When tblSearchType is not empty then assign new data list
  //   else if (this.tblSearchType != "") {
  //     for (var i = 0; i < this.leaveTypeList.length; i++) {
  //       if (
  //         this.leaveTypeList[i].leaveTypeName
  //           .toUpperCase()
  //           .includes(this.tblSearchType.toUpperCase()) ||
  //         this.leaveTypeList[i].leaveTypeDesc
  //           .toUpperCase()
  //           .includes(this.tblSearchType.toUpperCase())
  //       ) {
  //         this.excelDataListType.push({
  //           LeaveType: this.leaveTypeList[i].leaveTypeName,
  //           Description: this.leaveTypeList[i].leaveTypeDesc
  //         });
  //       }
  //     }

  //     if (this.excelDataListType.length > 0) {
  //       //alert("Filter List " + this.excelDataList.length);

  //       this.excelExportService.export(
  //         this.excelDataContentType,
  //         new IgxExcelExporterOptions("LeaveTypeFilterExcel")
  //       );
  //       this.excelDataListType = [];
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }
}
