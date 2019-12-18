import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { TreeNode } from "primeng/api";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";

import {
  IgxExcelExporterOptions,
  IgxExcelExporterService,
  IgxGridComponent,
  IgxCsvExporterService,
  IgxCsvExporterOptions,
  CsvFileTypes
} from "igniteui-angular";

import { AppComponent } from "src/app/app.component";

declare var $: any;

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],

  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {
  serverUrl = "http://localhost:3001/";
  // serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9013/";
  // serverUrl = "http://52.163.189.189:9013/";

  //ngprime organization chart
  data1: TreeNode[];

  selectedNode: TreeNode;

  // lblOrg = '';
  // count = 0;

  //Page Models
  postSearch = "";
  cmbPost = false;
  btnAddPost = true;

  //Modal Window Add New Models
  txtPostTitle = "";
  officeName = "";
  departmentName = "";
  sectionName = "";

  jobPostName = "";
  jobType = "";
  jobNature = "";
  jobTitle = "";
  BPS = "";
  designation = "";
  sectionQty = 0;

  lblJobDeptCd = "";
  lblDeptCd = "";
  lblLocCd = "";
  // orgChartDesigID = "";
  // orgChartLocationCd = "";
  // orgChartParentLocationCd = "";
  // orgChartParentDeptCd = "";
  // orgChartDeptCd = "";
  // orgChartParentDesigID = "";
  // orgChartBPSCd = "";
  // orgChartDesigName = "";

  //lists
  offices = [];
  departments = [];
  departmentList = [];
  sections = [];
  sectionList = [];
  jobTypes = [];
  jobNatures = [];
  bpsList = [];
  designations = [];
  designationList = [];
  posts = [];
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
    private excelExportService: IgxExcelExporterService,
    private csvExportService: IgxCsvExporterService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getOffices();
    this.getDepartment();
    this.getSection();
    this.getLeaveRule();
    this.getPost();
    this.getJobType();
    this.getBPS();
    this.getJobNature();
  }

  //<<<<<<< HEAD
  @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel

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
    this.clearJob();

    this.sections = [];
    for (var i = 0; i < this.sectionList.length; i++) {
      if (this.sectionList[i].parentDeptCd == item) {
        this.sections.push({
          deptCd: this.sectionList[i].deptCd,
          deptName: this.sectionList[i].deptName
        });
      }
    }

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(
        this.serverUrl +
          "api/getDeptJobDesignation?cmpnyID=" +
          59 +
          "&&deptCd=" +
          item +
          "&&branch=" +
          this.officeName +
          "&&level=" +
          1,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.jobPost = data;
      });
  }

  onSectionChange(item) {
    this.clearJob();
    this.sectionName = item;

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(
        this.serverUrl +
          "api/getDeptJobDesignation?cmpnyID=" +
          59 +
          "&&deptCd=" +
          item +
          "&&branch=" +
          this.officeName +
          "&&level=" +
          2,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.jobPost = data;
      });
  }

  onBranchChange(item) {
    this.departments = [];

    for (var i = 0; i < this.departmentList.length; i++) {
      if (this.departmentList[i].locationCd == item) {
        this.departments.push({
          deptCd: this.departmentList[i].deptCd,
          deptName: this.departmentList[i].deptName
        });
      }
    }
  }

  getOrganoGram() {
    if (this.officeName == "") {
      this.toastr.errorToastr("Please select Office", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.departmentName == "") {
      this.toastr.errorToastr("Please select Department", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.sectionName == "") {
      this.app.showSpinner();

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .get(
          this.serverUrl +
            "api/getOrgChartDept?deptCd=" +
            this.departmentName +
            "&locCd=" +
            this.officeName,
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.data1 = data;

          this.app.hideSpinner();
        });

      this.app.showSpinner();

      this.http
        .get(
          this.serverUrl +
            "api/getOrgChart?deptCd=" +
            this.departmentName +
            "&locCd=" +
            this.officeName,
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.chartData = data;

          this.app.hideSpinner();
        });
    } else {
      this.app.showSpinner();

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .get(
          this.serverUrl +
            "api/getOrgChartSection?sectCd=" +
            this.sectionName +
            "&locCd=" +
            this.officeName,
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.data1 = data;

          this.app.hideSpinner();
        });

      this.app.showSpinner();

      this.http
        .get(
          this.serverUrl +
            "api/getSecOrgChart?sectCd=" +
            this.sectionName +
            "&locCd=" +
            this.officeName,
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.chartData = data;

          this.app.hideSpinner();
        });
    }
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

  getJobNature() {
    //return false;

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getJobNature", { headers: reqHeader })
      .subscribe((data: any) => {
        this.jobNatures = data;

        this.app.hideSpinner();
      });
  }

  getBPS() {
    //return false;

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getBPS", { headers: reqHeader })
      .subscribe((data: any) => {
        this.bpsList = data;

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

  onJobChange(item) {
    // this.jobBpsList = [];

    for (var i = 0; i < this.jobPost.length; i++) {
      if (item == this.jobPost[i].jobDesigID) {
        this.lblJobDeptCd = this.jobPost[i].jobPostDeptCd;
        i = this.jobPost.length + 1;
      }
    }

    for (var i = 0; i < this.jobPost.length; i++) {
      if (item == this.jobPost[i].jobDesigID) {
        this.getPostBPS(this.jobPost[i].payGradeCd);
        i = this.jobPost.length + 1;
      }
    }
  }

  getPostBPS(item) {
    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getJobBPS?payGradeCd=" + item, {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        this.bpsList = data;

        this.app.hideSpinner();
      });
  }

  editPost(item) {
    this.lblDeptCd = "";
    this.lblLocCd = "";

    this.lblDeptCd = item.locCd;
    this.lblLocCd = item.deptCd;

    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(
        this.serverUrl +
          "api/getJobDesignations?desigCd=" +
          item.desigCode +
          "&locCd=" +
          item.locCd +
          "&deptCd=" +
          item.deptCd,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.jobDesignation = data;

        this.app.hideSpinner();
      });
  }

  updatePost(item) {
    this.app.showSpinner();

    var saveData = {
      jobDesigName: item.jobDesigName,
      jobDesigID: item.jobDesigID
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "api/updateJobPost", saveData, {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        if (data.msg == "Record Updated Successfully!") {
          this.toastr.successToastr(data.msg, "Success!", {
            toastTimeout: 2500
          });
          this.getPost();
          $("#editPostModal").modal("hide");
          this.app.hideSpinner();
          this.clearJob();
          this.clear();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          //$('#companyModal').modal('hide');
          this.app.hideSpinner();
          return false;
        }
      });
  }

  deletePost(item) {
    this.app.showSpinner();

    var saveData = {
      jobPostDeptCd: this.lblDeptCd,
      jobPostLocCd: this.lblLocCd,
      jobDesigID: item.jobDesigID
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "api/deleteJobPost", saveData, {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        if (data.msg == "Record Deleted Successfully!") {
          this.toastr.successToastr(data.msg, "Success!", {
            toastTimeout: 2500
          });
          this.getPost();
          $("#editPostModal").modal("hide");
          this.app.hideSpinner();
          this.clearJob();
          this.clear();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          //$('#companyModal').modal('hide');
          this.app.hideSpinner();
          return false;
        }
      });
  }

  save() {
    var bpsJobPost = 0;

    if (this.officeName == "") {
      this.toastr.errorToastr("Please select Office", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.departmentName == "") {
      this.toastr.errorToastr("Please select Department", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.jobType == "") {
      this.toastr.errorToastr("Please select Job Type", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.jobNature == "") {
      this.toastr.errorToastr("Please select Job Nature", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.jobTitle == "") {
      this.toastr.errorToastr("Please select Job Title", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.BPS == "") {
      this.toastr.errorToastr("Please select Pay Grade", "Error", {
        toastTimeout: 2500
      });
      return;
    } else if (this.designation == "") {
      this.toastr.errorToastr("Please select Designation", "Error", {
        toastTimeout: 2500
      });
      return;
    } else {
      if (this.sectionName == "") {
        if (this.jobPostName == "") {
          this.app.showSpinner();

          var saveData = {
            jobTypeCd: this.jobType,
            jobNatureCd: this.jobNature,
            payGradeCd: this.BPS,
            JobPostLocationCd: this.officeName,
            jobPostDeptCd: this.departmentName,
            DesigCd: this.designation,
            jobDesigName: this.jobTitle
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json"
          });

          this.http
            .post(this.serverUrl + "api/saveDeptJobPost", saveData, {
              headers: reqHeader
            })
            .subscribe((data: any) => {
              if (data.msg == "Record Saved Successfully!") {
                this.toastr.successToastr(data.msg, "Success!", {
                  toastTimeout: 2500
                });
                this.getPost();
                this.app.hideSpinner();
                this.clearJob();
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
          for (var i = 0; i < this.jobPost.length; i++) {
            if (this.jobPostName == this.jobPost[i].jobDesigID) {
              bpsJobPost = this.jobPost[i].payGradeCd;
            }
          }

          if (bpsJobPost <= parseInt(this.BPS)) {
            this.toastr.errorToastr(
              "BPS is Greater than Old Post BPS",
              "Error",
              { toastTimeout: 2500 }
            );
            return;
          }

          this.app.showSpinner();

          var savedata = {
            jobTypeCd: this.jobType,
            jobNatureCd: this.jobNature,
            payGradeCd: this.BPS,
            JobPostLocationCd: this.officeName,
            jobPostDeptCd: this.departmentName,
            DesigCd: this.designation,
            jobDesigName: this.jobTitle,
            ManagerJobDesigID: this.jobPostName,
            ManagerJobPostDeptCd: this.departmentName
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json"
          });

          this.http
            .post(this.serverUrl + "api/saveJobPost", savedata, {
              headers: reqHeader
            })
            .subscribe((data: any) => {
              if (data.msg != undefined) {
                this.toastr.successToastr(data.msg, "Success!", {
                  toastTimeout: 2500
                });
                this.getPost();
                this.app.hideSpinner();
                this.clearJob();
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
        if (this.jobPostName == "") {
          this.toastr.errorToastr("Please select Job Designation", "Error", {
            toastTimeout: 2500
          });
          return;
        } else {
          for (var i = 0; i < this.jobPost.length; i++) {
            if (this.jobPostName == this.jobPost[i].jobDesigID) {
              bpsJobPost = this.jobPost[i].payGradeCd;
            }
          }

          if (bpsJobPost <= parseInt(this.BPS)) {
            this.toastr.errorToastr(
              "BPS is Greater than Old Post BPS",
              "Error",
              { toastTimeout: 2500 }
            );
            return;
          } else {
            this.app.showSpinner();

            var savedata = {
              jobTypeCd: this.jobType,
              jobNatureCd: this.jobNature,
              payGradeCd: this.BPS,
              JobPostLocationCd: this.officeName,
              jobPostDeptCd: this.sectionName,
              DesigCd: this.designation,
              jobDesigName: this.jobTitle,
              ManagerJobDesigID: this.jobPostName,
              ManagerJobPostDeptCd: this.lblJobDeptCd
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
                  //this.getOrganoGram();
                  //$('#jobModal').modal('hide');
                  this.app.hideSpinner();
                  this.clearJob();
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
  }
  //if you want to clear input
  clear() {
    this.officeName = "";
    this.departmentName = "";
    this.jobPostName = "";
    this.sectionName = "";
    this.jobNature = "";
    this.jobType = "";
    this.jobTitle = "";
    this.BPS = "";
    this.designation = "";
    this.data1 = [];
    // this.userId = 0;
    // this.txtUsername = '';
  }

  clearJob() {
    //this.officeName = '';
    //this.departmentName = '';
    this.sectionName = "";
    //this.sections = [];
    this.jobNature = "";
    this.jobType = "";
    this.jobTitle = "";
    this.BPS = "";
    this.designation = "";
    this.data1 = [];
    this.cmbPost = false;
    this.btnAddPost = true;
    //alert(this.sectionName);
  }

  clearPost() {
    this.jobNature = "";
    this.jobType = "";
    this.jobTitle = "";
    this.BPS = "";
    this.designation = "";
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
  downloadCSV() {
    //alert('CSV works');

    // case 1: When postSearch is empty then assign full data list
    if (this.postSearch == "") {
      var completeDataList = [];
      for (var i = 0; i < this.posts.length; i++) {
        //alert(this.postSearch + " - " + this.skillCriteriaList[i].departmentName)
        completeDataList.push({
          Office: this.posts[i].office,
          Department: this.posts[i].department,
          Section: this.posts[i].section,
          JobTitle: this.posts[i].designation,
          Quantity: this.posts[i].desigCount
        });
      }
      this.csvExportService.exportData(
        completeDataList,
        new IgxCsvExporterOptions("postCompleteCSV", CsvFileTypes.CSV)
      );
    }

    // case 2: When postSearch is not empty then assign new data list
    else if (this.postSearch != "") {
      var filteredDataList = [];
      for (var i = 0; i < this.posts.length; i++) {
        if (
          this.posts[i].office
            .toUpperCase()
            .includes(this.postSearch.toUpperCase()) ||
          this.posts[i].department
            .toUpperCase()
            .includes(this.postSearch.toUpperCase()) ||
          this.posts[i].section
            .toUpperCase()
            .includes(this.postSearch.toUpperCase()) ||
          this.posts[i].designation
            .toUpperCase()
            .includes(this.postSearch.toUpperCase()) ||
          this.posts[i].desigCount == this.postSearch
        ) {
          filteredDataList.push({
            Office: this.posts[i].office,
            Department: this.posts[i].department,
            Section: this.posts[i].section,
            JobTitle: this.posts[i].designation,
            Quantity: this.posts[i].desigCount
          });
        }
      }

      if (filteredDataList.length > 0) {
        this.csvExportService.exportData(
          filteredDataList,
          new IgxCsvExporterOptions("postFilterCSV", CsvFileTypes.CSV)
        );
      } else {
        this.toastr.errorToastr("Oops! No data found", "Error", {
          toastTimeout: 2500
        });
      }
    }
  }

  downloadExcel() {
    //alert('Excel works');
    // case 1: When postSearch is empty then assign full data list
    if (this.postSearch == "") {
      //var completeDataList = [];
      for (var i = 0; i < this.posts.length; i++) {
        this.excelDataList.push({
          Office: this.posts[i].office,
          Department: this.posts[i].department,
          Section: this.posts[i].section,
          JobTitle: this.posts[i].designation,
          Quantity: this.posts[i].desigCount
        });
      }
      this.excelExportService.export(
        this.excelDataContent,
        new IgxExcelExporterOptions("postCompleteExcel")
      );
      this.excelDataList = [];
    }
    // case 2: When postSearch is not empty then assign new data list
    else if (this.postSearch != "") {
      for (var i = 0; i < this.posts.length; i++) {
        if (
          this.posts[i].office
            .toUpperCase()
            .includes(this.postSearch.toUpperCase()) ||
          this.posts[i].department
            .toUpperCase()
            .includes(this.postSearch.toUpperCase()) ||
          this.posts[i].section
            .toUpperCase()
            .includes(this.postSearch.toUpperCase()) ||
          this.posts[i].designation
            .toUpperCase()
            .includes(this.postSearch.toUpperCase()) ||
          this.posts[i].desigCount == this.postSearch
        ) {
          this.excelDataList.push({
            Office: this.posts[i].office,
            Department: this.posts[i].department,
            Section: this.posts[i].section,
            JobTitle: this.posts[i].designation,
            Quantity: this.posts[i].desigCount
          });
        }
      }

      if (this.excelDataList.length > 0) {
        //alert("Filter List " + this.excelDataList.length);

        this.excelExportService.export(
          this.excelDataContent,
          new IgxExcelExporterOptions("postFilterExcel")
        );
        this.excelDataList = [];
      } else {
        this.toastr.errorToastr("Oops! No data found", "Error", {
          toastTimeout: 2500
        });
      }
    }
  }

  //function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
}
