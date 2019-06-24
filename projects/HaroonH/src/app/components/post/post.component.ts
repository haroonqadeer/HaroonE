import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TreeNode } from 'primeng/api';
//import { AppComponent } from '../../app.component';
import { AppComponent } from 'src/app/app.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],

  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {

  serverUrl = "http://localhost:26880/";
  //serverUrl = "http://192.168.200.19:3003/";

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

  orgChartDesigID = "";
  orgChartLocationCd = "";
  orgChartParentLocationCd = "";
  orgChartParentDeptCd = "";
  orgChartDeptCd = "";
  orgChartParentDesigID = "";
  orgChartBPSCd = "";
  orgChartDesigName = "";

  //lists
  offices = []
  departments = []
  sections = []
  jobTypes = []
  jobNatures = []
  bpsList = []
  designations = []
  posts = []
  jobPost = [];

  public orgList = [];
  public orgChild = [];


  public chartData = []


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


  constructor(private toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient) { }

  ngOnInit() {
    this.getOffices();
    this.getPost();
    this.getJobType();
    this.getBPS();
    this.getJobNature();
  }

  onNodeSelect(event) {

    this.clearPost();

    this.orgChartDesigName = event.node.label;
    //alert(event.node.label)
    //alert(this.chartData.length)
    for (var i = 0; i < this.chartData.length; i++) {
      if (this.orgChartDesigName == this.chartData[i].jobDesigName) {
        this.orgChartBPSCd = String(this.chartData[i].payGradeCd);
        this.orgChartDesigID = String(this.chartData[i].jobDesigID);
        this.orgChartDeptCd = String(this.chartData[i].jobPostDeptCd);

        i = this.chartData.length + 1;
      }

    }

    $('#jobModal').modal('show');

  }

  onDeptChange(item) {

    this.clearJob();

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getSection?DeptCd=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.sections = data;
    });

    this.http.get(this.serverUrl + 'api/getSectionPostQty?DeptCd=' + item, { headers: reqHeader }).subscribe((data: any) => {

      if (data != "")
        this.sectionQty = data[0].qty;
      else
        this.sectionQty = 0;
    });
  }

  onSectionChange(item) {

    this.clearJob();
    this.sectionName = item;

    //alert(this.sectionQty);
    if (this.sectionQty == 0) {
      this.cmbPost = true;
      this.btnAddPost = true;

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.get(this.serverUrl + 'api/getjobDesignation?deptCd=' + this.departmentName, { headers: reqHeader }).subscribe((data: any) => {

        this.jobPost = data;
      });
    } else {
      this.cmbPost = false;
      this.btnAddPost = false;
    }
  }

  onBranchChange(item) {

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getDepartments?LocationCd=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.departments = data;
    });
  }

  onBPSChange(item) {
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getDesignation?BPS=' + item, { headers: reqHeader }).subscribe((data: any) => {

      this.designations = data;
    });
  }

  getOrganoGram() {

    if (this.officeName == '') {
      this.toastr.errorToastr('Please select Office', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.departmentName == '') {
      this.toastr.errorToastr('Please select Department', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.sectionName == '') {

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.get(this.serverUrl + 'api/getOrgChartDept?deptCd=' + this.departmentName + '&locCd=' + this.officeName, { headers: reqHeader }).subscribe((data: any) => {

        this.data1 = data;
      });

      this.http.get(this.serverUrl + 'api/getOrgChart?deptCd=' + this.departmentName + '&locCd=' + this.officeName, { headers: reqHeader }).subscribe((data: any) => {

        this.chartData = data;
      });

    } else {

      if (this.sectionQty == 0) {
        this.toastr.errorToastr('Sorry No Post Entered', 'Error', { toastTimeout: (2500) });
        return;
      } else {

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getOrgChartSection?sectCd=' + this.sectionName + '&locCd=' + this.officeName, { headers: reqHeader }).subscribe((data: any) => {

          this.data1 = data;
        });

        this.http.get(this.serverUrl + 'api/getSecOrgChart?sectCd=' + this.sectionName + '&locCd=' + this.officeName, { headers: reqHeader }).subscribe((data: any) => {

          this.chartData = data;
        });
      }

    }

  }

  getPost() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getPost', { headers: reqHeader }).subscribe((data: any) => {

      this.posts = data;
    });
  }

  getJobType() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getJobType', { headers: reqHeader }).subscribe((data: any) => {

      this.jobTypes = data;
    });
  }

  getJobNature() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getJobNature', { headers: reqHeader }).subscribe((data: any) => {

      this.jobNatures = data;
    });
  }

  getBPS() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getBPS', { headers: reqHeader }).subscribe((data: any) => {

      this.bpsList = data;
    });
  }

  getOffices() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getBranches', { headers: reqHeader }).subscribe((data: any) => {

      this.offices = data;
    });
  }

  addPost() {
    if (this.officeName == '') {
      this.toastr.errorToastr('Please select Office', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.departmentName == '') {
      this.toastr.errorToastr('Please select Department', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.cmbPost == true && this.jobPostName == '') {
      this.toastr.errorToastr('Please select Job Post', 'Error', { toastTimeout: (2500) });
      return;
    } else {

      $('#jobModal').modal('show');
    }
  }

  save() {

    var bpsJobPost = 0;

    if (this.jobType == '') {
      this.toastr.errorToastr('Please select Job Type', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.jobNature == '') {
      this.toastr.errorToastr('Please select Job Nature', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.jobTitle == '') {
      this.toastr.errorToastr('Please select Job Title', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.BPS == '') {
      this.toastr.errorToastr('Please select BPS', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.designation == '') {
      this.toastr.errorToastr('Please select Designation', 'Error', { toastTimeout: (2500) });
      return;
    } else {

      if (this.sectionName == '') {
        if (this.chartData.length == 0) {

          var saveData = {
            jobTypeCd: this.jobType,
            jobNatureCd: this.jobNature,
            payGradeCd: this.BPS,
            JobPostLocationCd: this.officeName,
            jobPostDeptCd: this.departmentName,
            DesigCd: this.designation,
            jobDesigName: this.jobTitle
          };

          var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

          this.http.post(this.serverUrl + 'api/saveDeptJobPost', saveData, { headers: reqHeader }).subscribe((data: any) => {

            if (data.msg == "Record Saved Successfully!") {
              this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
              this.getPost();
              this.getOrganoGram();
              $('#jobModal').modal('hide');
              //this.app.hideSpinner();
              //this.clearJob();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
              //$('#companyModal').modal('hide');
              //this.app.hideSpinner();
              return false;
            }
          });

        } else {

          if (this.orgChartBPSCd <= this.BPS) {
            this.toastr.errorToastr('BPS is Greater than Old Post BPS', 'Error', { toastTimeout: (2500) });
            return;
          } else {

            var savedata = {
              jobTypeCd: this.jobType,
              jobNatureCd: this.jobNature,
              payGradeCd: this.BPS,
              JobPostLocationCd: this.officeName,
              jobPostDeptCd: this.orgChartDeptCd,
              DesigCd: this.designation,
              jobDesigName: this.jobTitle,
              ManagerJobDesigID: this.orgChartDesigID,
              ManagerJobPostDeptCd: this.orgChartDeptCd
            };

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/saveJobPost', savedata, { headers: reqHeader }).subscribe((data: any) => {

              if (data.msg == "Record Saved Successfully!") {
                this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                this.getPost();
                this.getOrganoGram();
                $('#jobModal').modal('hide');
                //this.app.hideSpinner();
                //this.clearJob();
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

      } else {

        if (this.cmbPost == true) {

          for (var i = 0; i < this.jobPost.length; i++) {
            if (this.jobPostName == this.jobPost[i].jobDesigID) {
              bpsJobPost = this.jobPost[i].payGradeCd;
            }
          }

          if (bpsJobPost <= parseInt(this.BPS)) {
            this.toastr.errorToastr('BPS is Greater than Old Post BPS', 'Error', { toastTimeout: (2500) });
            return;
          } else {

            var savedata = {
              jobTypeCd: this.jobType,
              jobNatureCd: this.jobNature,
              payGradeCd: this.BPS,
              JobPostLocationCd: this.officeName,
              jobPostDeptCd: this.sectionName,
              DesigCd: this.designation,
              jobDesigName: this.jobTitle,
              ManagerJobDesigID: this.jobPostName,
              ManagerJobPostDeptCd: this.departmentName
            };

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/saveJobPost', savedata, { headers: reqHeader }).subscribe((data: any) => {

              if (data.msg == "Record Saved Successfully!") {
                this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                this.getPost();
                this.getOrganoGram();
                $('#jobModal').modal('hide');
                //this.app.hideSpinner();
                //this.clearJob();
                return false;
              } else {
                this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                //$('#companyModal').modal('hide');
                //this.app.hideSpinner();
                return false;
              }
            });
          }

        } else {

          //alert(this.orgChartBPSCd + ' - ' + this.BPS);
          if (this.orgChartBPSCd <= this.BPS) {
            this.toastr.errorToastr('BPS is Greater than Old Post BPS', 'Error', { toastTimeout: (2500) });
            return;
          } else {

            var savedata = {
              jobTypeCd: this.jobType,
              jobNatureCd: this.jobNature,
              payGradeCd: this.BPS,
              JobPostLocationCd: this.officeName,
              jobPostDeptCd: this.sectionName,
              DesigCd: this.designation,
              jobDesigName: this.jobTitle,
              ManagerJobDesigID: this.orgChartDesigID,
              ManagerJobPostDeptCd: this.orgChartDeptCd
            };

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/saveJobPost', savedata, { headers: reqHeader }).subscribe((data: any) => {

              if (data.msg == "Record Saved Successfully!") {
                this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                this.getPost();
                this.getOrganoGram();
                $('#jobModal').modal('hide');
                //this.app.hideSpinner();
                //this.clearJob();
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

    }
  }
  //if you want to clear input
  clear() {

    this.officeName = '';
    this.departmentName = '';
    this.sectionName = '';
    this.jobNature = '';
    this.jobType = '';
    this.jobTitle = '';
    this.BPS = '';
    this.designation = '';
    this.data1 = [];
    // this.userId = 0;
    // this.txtUsername = '';

  }

  clearJob() {

    //this.officeName = '';
    //this.departmentName = '';
    this.sectionName = '';
    //this.sections = [];
    this.jobNature = '';
    this.jobType = '';
    this.jobTitle = '';
    this.BPS = '';
    this.designation = '';
    this.data1 = [];
    this.cmbPost = false;
    this.btnAddPost = true;
    //alert(this.sectionName);
  }

  clearPost() {

    this.jobNature = '';
    this.jobType = '';
    this.jobTitle = '';
    this.BPS = '';
    this.designation = '';

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

  downPDF() {
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
  public downloadCSV() {
    // case 1: When userSearch is empty then assign full data list
    // if (this.userSearch == "") {
    //   var completeDataList = [];
    //   for (var i = 0; i < this.userData.length; i++) {
    //     completeDataList.push({
    //       userName: this.userData[i].uName,
    //       email: this.userData[i].uEmail,
    //       role: this.userData[i].uRole,
    //       userSince: this.userData[i].uSince,
    //       lastLogin: this.userData[i].lastLogin
    //     });
    //   }
    //   this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("UserProfileCompleteCSV", CsvFileTypes.CSV));
    // }
    // // case 2: When userSearch is not empty then assign new data list
    // else if (this.userSearch != "") {
    //   var filteredDataList = [];
    //   for (var i = 0; i < this.userData.length; i++) {

    //     if (this.userData[i].uName.toUpperCase().includes(this.userSearch.toUpperCase()) ||
    //       this.userData[i].uEmail.toUpperCase().includes(this.userSearch.toUpperCase()) ||
    //       this.userData[i].uRole.toUpperCase().includes(this.userSearch.toUpperCase()) ||
    //       this.userData[i].uSince.toUpperCase().includes(this.userSearch.toUpperCase()) ||
    //       this.userData[i].lastLogin.toUpperCase().includes(this.userSearch.toUpperCase())) {
    //       filteredDataList.push({
    //         userName: this.userData[i].uName,
    //         email: this.userData[i].uEmail,
    //         role: this.userData[i].uRole,
    //         userSince: this.userData[i].uSince,
    //         lastLogin: this.userData[i].lastLogin
    //       });
    //     }
    //   }

    //   if (filteredDataList.length > 0) {
    //     this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("UserProfileFilterCSV", CsvFileTypes.CSV));
    //   }
    //   else {
    //     this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
    //   }
    // }
  }


  //For Exce File
  public downloadExcel() {
    // case 1: When userSearch is empty then assign full data list
    // if (this.userSearch == "") {
    //   for (var i = 0; i < this.userData.length; i++) {
    //     this.excelDataList.push({
    //       userName: this.userData[i].uName,
    //       email: this.userData[i].uEmail,
    //       role: this.userData[i].uRole,
    //       userSince: this.userData[i].uSince,
    //       lastLogin: this.userData[i].lastLogin
    //     });
    //   }

    //   this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("UserProfileCompleteExcel"));
    //   this.excelDataList = [];
    // }
    // // case 2: When userSearch is not empty then assign new data list
    // else if (this.userSearch != "") {

    //   for (var i = 0; i < this.userData.length; i++) {
    //     if (this.userData[i].uName.toUpperCase().includes(this.userSearch.toUpperCase()) ||
    //       this.userData[i].uEmail.toUpperCase().includes(this.userSearch.toUpperCase()) ||
    //       this.userData[i].uRole.toUpperCase().includes(this.userSearch.toUpperCase()) ||
    //       this.userData[i].uSince.toUpperCase().includes(this.userSearch.toUpperCase()) ||
    //       this.userData[i].lastLogin.toUpperCase().includes(this.userSearch.toUpperCase())) {
    //       this.excelDataList.push({
    //         userName: this.userData[i].uName,
    //         email: this.userData[i].uEmail,
    //         role: this.userData[i].uRole,
    //         userSince: this.userData[i].uSince,
    //         lastLogin: this.userData[i].lastLogin
    //       });
    //     }
    //   }

    //   if (this.excelDataList.length > 0) {

    //     this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("UserProfileFilterExcel"));
    //     this.excelDataList = [];

    //   }
    //   else {
    //     this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
    //   }
    // }
  }

}
