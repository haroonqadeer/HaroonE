import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppComponent } from '../../../../../../src/app/app.component';
import * as jsPDF from 'jspdf';
import {
  IgxExcelExporterOptions,
  IgxExcelExporterService,
  IgxGridComponent,
  IgxCsvExporterService,
  IgxCsvExporterOptions,
  CsvFileTypes
} from "igniteui-angular";
import { HttpHeaders, HttpClient } from '@angular/common/http';


//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting department into main table -------------------//
//-------------------Getting departmentdata into main table -------------------//
//-------------------Add new departmentdata into database --------------------------//
//-------------------Add new department into database --------------------------//
//-------------------Update department into database ---------------------------//
//-------------------Delete department from database ---------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//-------------------For sorting the record-----------------------------//
//----------------------------------------------------------------------------//


declare var $: any;
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  serverUrl = "https://localhost:7004/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  // list for excel data
  excelDataList = [];
  //excelDataListFilter = [];
  companyList = [];
  locations = [];
  departments = [];
  departmentsDetails = [];

  //dropdown search ng-models
  dropSearchLocation = '';
  dropSearchDept = '';


  //Page NgModels
  tblSearch = "";

  // Add Department Details NgModels
  departmentId = "";
  departmentNameCd = "";
  departmentLocationCd = "";
  cmpnyId = "";

  //Add New department modal window
  departId = "";
  departName = "";

  //Delete NgModels
  userPassword = "";
  userPINCode = "";

  // To Access id of Delete Entry
  dDepartmentId = "";
  dDepartmentNameCd = "";
  dDepartmentLocationCd = "";


  //* variables for pagination and orderby pipe
  p = 1;
  pDept = 1;
  order = 'info.name';
  reverse = false;
  sortedCollection: any[];
  itemPerPage = '10';
  itemPerPageDept = '5';

  //For Branch dropdown

  constructor(public toastr: ToastrManager,
    private app: AppComponent,
    private excelExportService: IgxExcelExporterService,
    private csvExportService: IgxCsvExporterService,
    private http: HttpClient) { }

  ngOnInit() {
    this.getDepartmentDetails();
    this.getLocation();
    this.getDepartment();
    this.getCompany();
  }

  @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent;//For excel
  @ViewChild("exportPDF") public exportPDF: ElementRef;//For PDF


  //To get company
  getCompany() {
    //return false;

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getCompany', { headers: reqHeader }).subscribe((data: any) => {
      this.companyList = data
    });
  }

  //To get departments details for display in main table
  getDepartmentDetails() {
    //return false;

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getDepartmentDetails', { headers: reqHeader }).subscribe((data: any) => {
      this.departmentsDetails = data
    });
  }


  //To get departments
  getLocation() {
    //return false;

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getLocation', { headers: reqHeader }).subscribe((data: any) => {
      this.locations = data
    });
  }

  //To get departments
  getDepartment() {
    //return false;

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getDepartment', { headers: reqHeader }).subscribe((data: any) => {
      this.departments = data
    });
  }

  onLocationClick() {
    //alert("location");
    this.dropSearchLocation = '';
  }
  onDeptClick() {
    //alert("Dept");
    this.dropSearchDept = '';
  }


  // function for saving and updating the data 
  saveDepartmentDetails() {
    if (this.departmentLocationCd == "") {
      this.toastr.errorToastr('Please Select Branch', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.departmentNameCd == "") {
      this.toastr.errorToastr('Please Select Department', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {


      if (this.departmentId != "") {
        return false;
        var updateData = {
          "locationCd": this.departmentLocationCd,
          "deptCd": this.departmentNameCd,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.put(this.serverUrl + 'api/updateDepartmentDetails', updateData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == undefined) {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          }
          else {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });

            this.clear();
            $('#departmentModal').modal('hide');
            this.getDepartmentDetails();

            return false;
          }

        });
      }
      else {

        var saveData = {
          "locationCd": this.departmentLocationCd,
          "deptCd": this.departmentNameCd,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
        //alert(reqHeader);
        this.http.post(this.serverUrl + 'api/saveDepartmentDetails', saveData, { responseType: 'json' }).subscribe((data: any) => {
          // this.http.post(this.serverUrl + 'api/saveDepartment', saveData).subscribe((data: any) => {

          //alert(data.msg);
          if (data.msg == "Department Detail Already Exist") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            $('#departmentModal').modal('hide');
            this.getDepartmentDetails();
            return false;
          }
          else if (data.msg == "Department Details Inserted Successfully") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#departmentModal').modal('hide');
            this.getDepartmentDetails();
            return false;
          }
          else {
            this.toastr.errorToastr(data.msg, 'Error !', { toastTimeout: (2500) });
            this.clear();
            $('#departmentModal').modal('hide');
            this.getDepartmentDetails();
            return false;
          }
        });
      }
    }
  }


  // save department function
  saveDept() {
    if (this.departName.trim() == '') {
      this.toastr.errorToastr('Please Enter Department', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {
      if (this.departId != '') {
        //this.app.showSpinner();
        //this.app.hideSpinner();
        //this.toastr.successToastr('updated successfully', 'Success', { toastTimeout: (2500) });
        //this.clear();
        //return false;

        var updateData = {
          'deptCd': this.departId,
          'deptName': this.departName,
          'cmpnyId': this.companyList[0].cmpnyId,
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.put(this.serverUrl + 'api/updateDepartment', updateData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == undefined) {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          } else {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#deptModal').modal('hide');
            this.getDepartment();
            return false;
          }
        });
      }
      else {
        //this.app.showSpinner();
        //this.app.hideSpinner();
        //this.toastr.successToastr('saved successfully', 'Error', { toastTimeout: (2500) });
        //this.clear();
        //return false;

        var saveData = {
          'deptName': this.departName,
          'cmpnyId': this.companyList[0].cmpnyId,
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.post(this.serverUrl + 'api/saveDepartment', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == undefined) {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          }
          else {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#deptModal').modal('hide');
            this.getDepartment();
            return false;
          }
        });
      }
    }
  }


  // clear the input fields
  clear() {
    this.departmentNameCd = "";
    this.departmentLocationCd = "";

    this.departName = "";

    this.dropSearchLocation = "";
    this.dropSearchDept = "";

    this.userPassword = "";
    this.userPINCode = "";

    this.dDepartmentId = "";

    this.dDepartmentLocationCd = "";
    this.dDepartmentNameCd = "";
  }


  // edit function
  edit(item) {
    //alert("Edit OK - " + item.departmentId + "-" + item.departmentName + "-" + String(item.branchId));

    //this.departmentId = item.deprtmntId;
    this.departmentNameCd = item.deptId;
    this.departmentLocationCd = item.locationCd;

  }


  editDept(item) {
    this.departId = item.deptCd;
    this.departName = item.deptName;
  }


  // get the "ids" of the delete entry 
  deleteDeptDetails(item) {
    this.clear();
    this.dDepartmentNameCd = item.deptId;
    this.dDepartmentLocationCd = item.locationCd;
  }


  // small Department modal window
  deleteDept(item) {
    this.clear();
    this.dDepartmentId = item.deptCd;
  }


  // delete function
  delete() {
    if (this.userPassword == "") {
      this.toastr.errorToastr('Please Enter Password', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.userPINCode == "") {
      this.toastr.errorToastr('Please Enter PIN Code', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {
      //this.app.showSpinner();
      //this.app.hideSpinner();
      //this.toastr.successToastr('Record Deleted Successfully', 'Success', { toastTimeout: (2500) });
      //this.clear();
      //$('#deleteModal').modal('hide');

      //return false;

      //alert(this.dDepartmentId);

      if (this.dDepartmentLocationCd != "" && this.dDepartmentNameCd != "") {

        //alert("Dept Details Location " + this.dDepartmentLocationCd + " Dept Cd = " + this.dDepartmentNameCd);

        var deleteData = {
          "locationCd": this.dDepartmentLocationCd,
          "deptCd": this.dDepartmentNameCd,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.put(this.serverUrl + 'api/deleteDepartmentDetails', deleteData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == "Error Occured") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          }
          else {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#deleteModal').modal('hide');
            this.getDepartmentDetails();
            return false;
          }

        });
      }//if ends
      else if (this.dDepartmentId != "") {

        //alert(this.dDepartmentId);

        var data = {
          'deptCd': this.dDepartmentId
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.put(this.serverUrl + 'api/deleteDepartment', data, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg == undefined) {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          }
          else {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#deleteModal').modal('hide');
            this.getDepartment();
            return false;
          }
        });
      }// else if ends      
    }//else ends
  }


  //function for sorting table data 
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }


  // For Print Purpose 
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


  // For PDF Download
  downloadPDF() {
    var doc = new jsPDF("p", "pt", "A4"),
      source = $("#printArea")[0],
      margins = {
        top: 75,
        right: 30,
        bottom: 50,
        left: 30,
        width: 150
      };
    doc.fromHTML(
      source, // HTML string or DOM elem ref.
      margins.left, // x coord
      margins.top,
      {
        // y coord
        width: margins.width // max width of content on PDF
      },
      function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF
        //          this allow the insertion of new lines after html
        doc.save("Test.pdf");
      },
      margins
    );
  }


  //For CSV File 
  public downloadCSV() {
    // case 1: When tblSearch is empty then assign full data list
    if (this.tblSearch == "") {
      var completeDataList = [];
      for (var i = 0; i < this.departmentsDetails.length; i++) {
        //alert(this.tblSearch + " - " + this.departmentsDetails[i].departmentName)
        completeDataList.push({
          departmentName: this.departmentsDetails[i].deptName,
          branchCity: this.departmentsDetails[i].locationName
        });
      }
      this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("DepartmentCompleteCSV", CsvFileTypes.CSV));
    }
    // case 2: When tblSearch is not empty then assign new data list
    else if (this.tblSearch != "") {
      var filteredDataList = [];
      for (var i = 0; i < this.departmentsDetails.length; i++) {
        if (this.departmentsDetails[i].deptName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.departmentsDetails[i].locationName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
          filteredDataList.push({
            departmentName: this.departmentsDetails[i].deptName,
            branchCity: this.departmentsDetails[i].locationName
          });
        }
      }

      if (filteredDataList.length > 0) {
        this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("DepartmentFilterCSV", CsvFileTypes.CSV));
      } else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }


  //For Exce File
  public downloadExcel() {
    // case 1: When tblSearch is empty then assign full data list
    if (this.tblSearch == "") {
      //var completeDataList = [];
      for (var i = 0; i < this.departmentsDetails.length; i++) {
        this.excelDataList.push({
          departmentName: this.departmentsDetails[i].deptName,
          branchCity: this.departmentsDetails[i].locationName
        });
      }
      this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("DepartmentCompleteExcel"));
      this.excelDataList = [];
    }
    // case 2: When tblSearch is not empty then assign new data list
    else if (this.tblSearch != "") {
      for (var i = 0; i < this.departmentsDetails.length; i++) {
        if (this.departmentsDetails[i].deptName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
          this.departmentsDetails[i].locationName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
          this.excelDataList.push({
            departmentName: this.departmentsDetails[i].deptName,
            branchCity: this.departmentsDetails[i].locationName
          });
        }
      }

      if (this.excelDataList.length > 0) {
        //alert("Filter List " + this.excelDataList.length);

        this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("DepartmentFilterExcel"));
        this.excelDataList = [];
      }
      else {
        this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
      }
    }
  }

}