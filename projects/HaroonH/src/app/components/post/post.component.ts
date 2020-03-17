import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { TreeNode } from "primeng/api";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";

// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";

import { AppComponent } from "src/app/app.component";

declare var $: any;

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],
  styles: [
    `
      .post.ui-organizationchart .ui-organizationchart-node-content.ui-person {
        padding: 0;
        border: 0 none;
      }

      .node-header,
      .node-content {
        padding: 0.5em 0.7em;
      }

      .node-header {
        background-color: #11193d;
        color: #f6f6f6;
      }

      .node-content {
        text-align: center;
        background-color: #11193d;
      }

      .node-content img {
        border-radius: 50%;
      }

      .department-cfo {
        background-color: #7247bc;
        color: #ffffff;
      }

      .department-coo {
        background-color: #a534b6;
        color: #ffffff;
      }

      .department-cto {
        background-color: #019040;
        color: #ffffff;
      }

      .ui-person .ui-node-toggler {
        color: #495ebb !important;
        outline: 0 !important;
      }

      .department-cto .ui-node-toggler {
        color: #ffffff !important;
        outline: 0 !important;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {
  // serverUrl = "http://localhost:3001/";
  serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9013/";
  // serverUrl = "http://52.163.189.189:9013/";

  //ngprime organization chart
  data1: TreeNode[];

  selectedNode: TreeNode;

  //Page Models
  postSearch = "";

  //Modal Window Add New Models
  jobDesigId = "";
  postHeading = "Add";
  rptOffDeptCd = "";
  rptOffLocCd = "";
  txtPostTitle = "";
  officeName = "";
  departmentName = "";
  jobPostName = "";
  sectionName = "";
  txtReptOfficer = "";
  txtLeaveRule = "";
  formLeaveRule = new FormControl();
  BPS = "";
  jobNature = "";
  jobType = "";

  lblDeptCd = "";
  lblLocCd = "";
  srchDesig = "";

  //lists
  offices = [];
  departments = [];
  departmentList = [];
  reptOfficer = [];
  reptOfficerList = [];
  sections = [];
  sectionList = [];
  jobTypes = [];
  jobNatures = [];
  bps = [];
  bpsList = [];
  designations = [];
  designationList = [];
  posts = [];
  postDetail = [];
  jobPost = [];
  jobPostList = [];
  jobDesignation = [];
  jobBpsList = [];
  ruleList = [];

  public orgList = [];
  public orgChild = [];

  public chartData = [];

  //* Excel Data List
  excelDataList = [];

  //* variables for pagination and orderby pipe
  p = 1;
  //pGroup = 1;
  order = "info.name";
  reverse = false;
  // orderGroup = 'info.name';
  // reverseGroup = false;
  sortedCollection: any[];
  itemPerPage = "10";
  //itemPerPageGroup = '5';

  constructor(
    public toastr: ToastrManager,
    private app: AppComponent,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getOffices();
    this.getDepartment();
    this.getSection();
    this.getLeaveRule();
    this.getPost();
    this.getJobType();
    this.getDesignation();
    this.getBPS();
    this.getReportingOfficer();
    this.getPostDetail();
  }

  // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel

  getDepartment() {
    //return false;

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getDepartments?cmpnyID=59", {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        this.departmentList = data;

        this.app.hideSpinner();
      });
  }

  getSection() {
    //return false;

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getSection?cmpnyID=59", { headers: reqHeader })
      .subscribe((data: any) => {
        this.sectionList = data;

        this.app.hideSpinner();
      });
  }

  getLeaveRule() {
    //return false;

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getLeaveRule", { headers: reqHeader })
      .subscribe((data: any) => {
        this.ruleList = data;

        this.app.hideSpinner();
      });
  }

  onDeptChange(item) {
    this.sections = [];
    this.sectionName = "";

    for (var i = 0; i < this.sectionList.length; i++) {
      if (this.sectionList[i].parentDeptCd == item) {
        this.sections.push({
          deptCd: this.sectionList[i].deptCd,
          deptName: this.sectionList[i].deptName
        });
      }
    }
  }

  getDesignation() {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getJobDesignations", { headers: reqHeader })
      .subscribe((data: any) => {
        this.jobPost = data;
      });
  }

  onBranchChange(item) {
    this.departments = [];
    this.departmentName = "";
    this.sectionName = "";

    for (var i = 0; i < this.departmentList.length; i++) {
      if (this.departmentList[i].locationCd == item) {
        this.departments.push({
          deptCd: this.departmentList[i].deptCd,
          deptName: this.departmentList[i].deptName
        });
      }
    }
  }

  onRptOffChange(item) {
    this.rptOffDeptCd = "";
    this.rptOffLocCd = "";

    for (var i = 0; this.reptOfficer.length; i++) {
      if (item == this.reptOfficer[i].jobDesigID) {
        this.rptOffDeptCd = this.reptOfficer[i].jobPostDeptCd;
        this.rptOffLocCd = this.reptOfficer[i].jobPostLocationCd;
        i = this.reptOfficer.length + 1;
      }
    }

    // alert(this.rptOffDeptCd);
    // alert(this.rptOffLocCd);
  }

  onBPSChange(item) {
    this.reptOfficer = [];

    for (var i = 0; i < this.reptOfficerList.length; i++) {
      if (this.reptOfficerList[i].payGradeCd > item) {
        this.reptOfficer.push({
          jobDesigID: this.reptOfficerList[i].jobDesigID,
          jobDesigName: this.reptOfficerList[i].jobDesigName,
          payGradeCd: this.reptOfficerList[i].payGradeCd,
          jobPostDeptCd: this.reptOfficerList[i].jobPostDeptCd,
          jobPostLocationCd: this.reptOfficerList[i].jobPostLocationCd
        });
      }
    }
  }

  getOrganoGram(item) {
    $("#organoGramModal").modal("show");
    this.app.showSpinner();

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(
        this.serverUrl +
          "api/getOrgChart?jobDesig=" +
          item.jobDesigID +
          "&locCd=" +
          item.locationCd +
          "&deptCd=" +
          item.deptCd,
        {
          headers: reqHeader
        }
      )
      .subscribe((data: any) => {
        this.data1 = data;

        this.app.hideSpinner();
      });
  }

  getPost() {
    //return false;

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getPost", { headers: reqHeader })
      .subscribe((data: any) => {
        this.posts = data;

        this.app.hideSpinner();
      });
  }

  getPostDetail() {
    //return false;

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getPostDetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.postDetail = data;

        this.app.hideSpinner();
      });
  }

  getJobType() {
    //return false;

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getJobType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.jobTypes = data;

        this.app.hideSpinner();
      });
  }

  getBPS() {
    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getBPS", { headers: reqHeader })
      .subscribe((data: any) => {
        this.bps = data;

        this.app.hideSpinner();
      });
  }

  getOffices() {
    //return false;

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getBranches?cmpnyID=59", {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        this.offices = data;

        this.app.hideSpinner();
      });
  }

  getReportingOfficer() {
    //return false;

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getReportingOfficer", {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        this.reptOfficerList = data;

        this.app.hideSpinner();
      });
  }

  onJobChange(item) {
    this.bpsList = [];
    var payGrade = 0;

    for (var i = 0; i < this.jobPost.length; i++) {
      if (this.jobPost[i].desigCd == item) {
        payGrade = this.jobPost[i].payGradeCd;
        i = this.jobPost.length + 1;
      }
    }

    if (payGrade != 0) {
      for (var i = 0; i < this.bps.length; i++) {
        if (this.bps[i].payGradeCd == payGrade) {
          this.bpsList.push({
            payGradeCd: this.bps[i].payGradeCd,
            payGradeName: this.bps[i].payGradeName
          });
        }
      }
    }
  }

  editPost(item) {
    this.clear();

    var tempList = [];

    this.postHeading = "Edit";

    for (var i = 0; i < this.postDetail.length; i++) {
      if (item.jobDesigID == this.postDetail[i].jobDesigID) {
        tempList.push(this.postDetail[i].leaveRuleID);

        this.formLeaveRule = new FormControl(tempList);

        this.txtLeaveRule = tempList.toString();
        this.jobDesigId = item.jobDesigID;
        this.rptOffDeptCd = this.postDetail[i].managerJobPostDeptCd;
        this.rptOffLocCd = this.postDetail[i].managerJobPostLocationCd;
        this.txtPostTitle = this.postDetail[i].jobDesigName;
        this.officeName = this.postDetail[i].jobPostLocationCd;
        if (this.officeName != "") {
          this.onBranchChange(this.officeName);
          if (this.postDetail[i].deptCd == 0) {
            this.onDeptChange(this.postDetail[i].sectCd);
            this.departmentName = this.postDetail[i].sectCd;
          } else {
            this.onDeptChange(this.postDetail[i].deptCd);
            this.departmentName = this.postDetail[i].deptCd;
            this.sectionName = this.postDetail[i].sectCd;
          }
        }
        this.jobPostName = this.postDetail[i].desigCd;
        this.jobNature = this.postDetail[i].jobNatureCd.toString();
        this.jobType = this.postDetail[i].jobTypeCd;
        this.onJobChange(this.jobPostName);
        if (this.jobPostName != "") {
          this.BPS = this.postDetail[i].payGradeCd;
          this.onBPSChange(this.BPS);
        }
        if (this.BPS != "") {
          this.txtReptOfficer = this.postDetail[i].managerJobDesigID;
        }
      }
    }
  }

  //*get the "id" of the delete entry
  deletePost(item) {
    this.clear();

    this.jobDesigId = item.jobDesigID;

    this.generatePin();
  }

  /*** Pin generation or Delete Role  ***/
  generatePin() {
    //* check if global variable is empty
    if (this.app.pin != "") {
      //* Initialize List and Assign data to list. Sending list to api
      this.app.showSpinner();

      var branchData = {
        jobDesigID: this.jobDesigId
      };

      this.http
        .post(this.serverUrl + "api/deleteJobPost", branchData)
        .subscribe((data: any) => {
          if (data.msg != "Record Deleted Successfully!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            this.getPost();
            this.getPostDetail();
            return false;
          } else {
            this.app.hideSpinner();
            this.app.pin = "";
            this.clear();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500
            });
            this.getPost();
            this.getPostDetail();
            return false;
          }
        });
    } else {
      this.app.genPin();
    }
  }

  save() {
    if (this.txtPostTitle == "") {
      this.toastr.errorToastr("Please Enter Post Title", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.officeName == "") {
      this.toastr.errorToastr("Please select Branch", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.departmentName == "") {
      this.toastr.errorToastr("Please select Department", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.jobPostName == "") {
      this.toastr.errorToastr("Please select Job Designation", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.BPS == "") {
      this.toastr.errorToastr("Please select Pay Scale", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.txtReptOfficer == "") {
      this.toastr.errorToastr("Please select Reporting Officer", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.jobNature == "") {
      this.toastr.errorToastr("Please select job Nature", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.txtLeaveRule == "") {
      this.toastr.errorToastr("Please select Leave Rule", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.jobType == "") {
      this.toastr.errorToastr("Please select Nature of Appointment", "Error", {
        toastTimeout: 2500
      });
      return;
    } else {
      var leaveRuleList = [];
      for (var i = 0; i < this.txtLeaveRule.length; i++) {
        leaveRuleList.push({
          LeaveRuleID: this.txtLeaveRule[i]
        });
      }
      if (this.jobDesigId == "") {
        if (this.sectionName == "") {
          this.app.showSpinner();

          var saveData = {
            jobDesigName: this.txtPostTitle,
            jobPostLocationCd: this.officeName,
            jobPostDeptCd: this.departmentName,
            ManagerJobPostDeptCd: this.rptOffDeptCd,
            ManagerJobPostLocCd: this.rptOffLocCd,
            DesigCd: this.jobPostName,
            payGradeCd: this.BPS,
            ManagerJobDesigID: this.txtReptOfficer,
            jobNatureCd: this.jobNature,
            leaveRule: JSON.stringify(leaveRuleList),
            jobTypeCd: this.jobType
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json"
          });

          this.http
            .post(this.serverUrl + "api/saveJobPost", saveData, {
              headers: reqHeader
            })
            .subscribe((data: any) => {
              if (data.msg == "Record Saved Successfully!") {
                this.toastr.successToastr(data.msg, "Success!", {
                  toastTimeout: 2500
                });
                this.getPost();
                this.getPostDetail();
                this.app.hideSpinner();
                this.clear();
                return false;
              } else {
                this.toastr.errorToastr(data.msg, "Error!", {
                  toastTimeout: 2500
                });
                //$('#companyModal').modal('hide');
                this.app.hideSpinner();
                return false;
              }
            });
        } else {
          this.app.showSpinner();

          var savedata = {
            jobDesigName: this.txtPostTitle,
            jobPostLocationCd: this.officeName,
            jobPostDeptCd: this.sectionName,
            ManagerJobPostDeptCd: this.rptOffDeptCd,
            ManagerJobPostLocCd: this.rptOffLocCd,
            DesigCd: this.jobPostName,
            payGradeCd: this.BPS,
            ManagerJobDesigID: this.txtReptOfficer,
            jobNatureCd: this.jobNature,
            leaveRule: JSON.stringify(leaveRuleList),
            jobTypeCd: this.jobType
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json"
          });

          this.http
            .post(this.serverUrl + "api/saveJobPost", savedata, {
              headers: reqHeader
            })
            .subscribe((data: any) => {
              if (data.msg == "Record Saved Successfully!") {
                this.toastr.successToastr(data.msg, "Success!", {
                  toastTimeout: 2500
                });
                this.getPost();
                this.getPostDetail();
                //this.getOrganoGram();
                //$('#jobModal').modal('hide');
                this.app.hideSpinner();
                this.clear();
                return false;
              } else {
                this.toastr.errorToastr(data.msg, "Error!", {
                  toastTimeout: 2500
                });
                //$('#companyModal').modal('hide');
                this.app.hideSpinner();
                return false;
              }
            });
        }
      } else {
        if (this.sectionName == "") {
          // alert(this.jobDesigId);
          // alert(this.officeName);
          // alert(this.departmentName);
          // alert(this.rptOffDeptCd);
          // alert(this.rptOffLocCd);
          // alert(this.txtReptOfficer);

          this.app.showSpinner();

          var updateData = {
            jobDesigID: this.jobDesigId,
            jobDesigName: this.txtPostTitle,
            jobPostLocationCd: this.officeName,
            jobPostDeptCd: this.departmentName,
            ManagerJobPostDeptCd: this.rptOffDeptCd,
            ManagerJobPostLocCd: this.rptOffLocCd,
            DesigCd: this.jobPostName,
            payGradeCd: this.BPS,
            ManagerJobDesigID: this.txtReptOfficer,
            jobNatureCd: this.jobNature,
            leaveRule: JSON.stringify(leaveRuleList),
            jobTypeCd: this.jobType
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json"
          });

          this.http
            .post(this.serverUrl + "api/updateJobPost", updateData, {
              headers: reqHeader
            })
            .subscribe((data: any) => {
              if (data.msg == "Record Updated Successfully!") {
                this.toastr.successToastr(data.msg, "Success!", {
                  toastTimeout: 2500
                });
                this.getPost();
                this.getPostDetail();
                this.app.hideSpinner();
                $("#postModal").modal("hide");
                this.clear();
                return false;
              } else {
                this.toastr.errorToastr(data.msg, "Error!", {
                  toastTimeout: 2500
                });
                this.app.hideSpinner();
                return false;
              }
            });
        } else {
          this.app.showSpinner();

          var updatedata = {
            jobDesigID: this.jobDesigId,
            jobDesigName: this.txtPostTitle,
            jobPostLocationCd: this.officeName,
            jobPostDeptCd: this.sectionName,
            ManagerJobPostDeptCd: this.rptOffDeptCd,
            ManagerJobPostLocCd: this.rptOffLocCd,
            DesigCd: this.jobPostName,
            payGradeCd: this.BPS,
            ManagerJobDesigID: this.txtReptOfficer,
            jobNatureCd: this.jobNature,
            leaveRule: JSON.stringify(leaveRuleList),
            jobTypeCd: this.jobType
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json"
          });

          this.http
            .post(this.serverUrl + "api/updateJobPost", updatedata, {
              headers: reqHeader
            })
            .subscribe((data: any) => {
              if (data.msg == "Record Updated Successfully!") {
                this.toastr.successToastr(data.msg, "Success!", {
                  toastTimeout: 2500
                });
                this.getPost();
                this.getPostDetail();
                this.app.hideSpinner();
                $("#postModal").modal("hide");
                this.clear();
                return false;
              } else {
                this.toastr.errorToastr(data.msg, "Error!", {
                  toastTimeout: 2500
                });
                //$('#companyModal').modal('hide');
                this.app.hideSpinner();
                return false;
              }
            });
        }
      }
    }
  }
  //if you want to clear input
  clear() {
    this.rptOffDeptCd = "";
    this.jobDesigId = "";
    this.rptOffLocCd = "";
    this.txtPostTitle = "";
    this.officeName = "";
    this.departmentName = "";
    this.jobPostName = "";
    this.sectionName = "";
    this.txtReptOfficer = "";
    this.txtLeaveRule = "";
    this.postHeading = "Add";
    this.BPS = "";
    this.jobNature = "";
    this.jobType = "";
    this.data1 = [];
    this.formLeaveRule = new FormControl();
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

  //For CSV
  // downloadCSV() {
  //   //alert('CSV works');

  //   // case 1: When postSearch is empty then assign full data list
  //   if (this.postSearch == "") {
  //     var completeDataList = [];
  //     for (var i = 0; i < this.posts.length; i++) {
  //       //alert(this.postSearch + " - " + this.skillCriteriaList[i].departmentName)
  //       completeDataList.push({
  //         Office: this.posts[i].office,
  //         Department: this.posts[i].department,
  //         Section: this.posts[i].section,
  //         JobTitle: this.posts[i].designation,
  //         Quantity: this.posts[i].desigCount
  //       });
  //     }
  //     this.csvExportService.exportData(
  //       completeDataList,
  //       new IgxCsvExporterOptions("postCompleteCSV", CsvFileTypes.CSV)
  //     );
  //   }

  //   // case 2: When postSearch is not empty then assign new data list
  //   else if (this.postSearch != "") {
  //     var filteredDataList = [];
  //     for (var i = 0; i < this.posts.length; i++) {
  //       if (
  //         this.posts[i].office
  //           .toUpperCase()
  //           .includes(this.postSearch.toUpperCase()) ||
  //         this.posts[i].department
  //           .toUpperCase()
  //           .includes(this.postSearch.toUpperCase()) ||
  //         this.posts[i].section
  //           .toUpperCase()
  //           .includes(this.postSearch.toUpperCase()) ||
  //         this.posts[i].designation
  //           .toUpperCase()
  //           .includes(this.postSearch.toUpperCase()) ||
  //         this.posts[i].desigCount == this.postSearch
  //       ) {
  //         filteredDataList.push({
  //           Office: this.posts[i].office,
  //           Department: this.posts[i].department,
  //           Section: this.posts[i].section,
  //           JobTitle: this.posts[i].designation,
  //           Quantity: this.posts[i].desigCount
  //         });
  //       }
  //     }

  //     if (filteredDataList.length > 0) {
  //       this.csvExportService.exportData(
  //         filteredDataList,
  //         new IgxCsvExporterOptions("postFilterCSV", CsvFileTypes.CSV)
  //       );
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }

  // downloadExcel() {
  //   //alert('Excel works');
  //   // case 1: When postSearch is empty then assign full data list
  //   if (this.postSearch == "") {
  //     //var completeDataList = [];
  //     for (var i = 0; i < this.posts.length; i++) {
  //       this.excelDataList.push({
  //         Office: this.posts[i].office,
  //         Department: this.posts[i].department,
  //         Section: this.posts[i].section,
  //         JobTitle: this.posts[i].designation,
  //         Quantity: this.posts[i].desigCount
  //       });
  //     }
  //     this.excelExportService.export(
  //       this.excelDataContent,
  //       new IgxExcelExporterOptions("postCompleteExcel")
  //     );
  //     this.excelDataList = [];
  //   }
  //   // case 2: When postSearch is not empty then assign new data list
  //   else if (this.postSearch != "") {
  //     for (var i = 0; i < this.posts.length; i++) {
  //       if (
  //         this.posts[i].office
  //           .toUpperCase()
  //           .includes(this.postSearch.toUpperCase()) ||
  //         this.posts[i].department
  //           .toUpperCase()
  //           .includes(this.postSearch.toUpperCase()) ||
  //         this.posts[i].section
  //           .toUpperCase()
  //           .includes(this.postSearch.toUpperCase()) ||
  //         this.posts[i].designation
  //           .toUpperCase()
  //           .includes(this.postSearch.toUpperCase()) ||
  //         this.posts[i].desigCount == this.postSearch
  //       ) {
  //         this.excelDataList.push({
  //           Office: this.posts[i].office,
  //           Department: this.posts[i].department,
  //           Section: this.posts[i].section,
  //           JobTitle: this.posts[i].designation,
  //           Quantity: this.posts[i].desigCount
  //         });
  //       }
  //     }

  //     if (this.excelDataList.length > 0) {
  //       //alert("Filter List " + this.excelDataList.length);

  //       this.excelExportService.export(
  //         this.excelDataContent,
  //         new IgxExcelExporterOptions("postFilterExcel")
  //       );
  //       this.excelDataList = [];
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }

  //function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
}
