import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { allSettled } from 'q';
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


//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting section data into main table -------------------//
//-------------------Add new section into database --------------------------//
//-------------------Update section into database ---------------------------//
//-------------------Delete section from database ---------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//-------------------For sorting the record-----------------------------//
//----------------------------------------------------------------------------//


declare var $: any;

@Component({
	selector: 'app-section',
	templateUrl: './section.component.html',
	styleUrls: ['./section.component.scss']
})

export class SectionComponent implements OnInit {

	serverUrl = "https://localhost:7003/";
	tokenKey = "token";

	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	}

	activeSection = true;

	// list for excel data
	excelDataList = [];

	//* variables for display values on page

	//*Variables for NgModels
	tblSearch;
	dSectionId = '';

	dSectionLocationCd = "";
	dSectionDepartmentCd = "";
	dSectionNameCd = "";

	cmpnyId = "";
	sectId = '';
	sectName = '';
	sectionLocationCd = '';
	sectionDeptCd = '';
	sectionNameCd = '';
	txtdPassword = '';
	txtdPin = '';

	//dropdown search ng-models
	dropSearchLocation = '';
	dropSearchDept = '';
	dropSearchSection = '';


	//* variables for pagination and orderby pipe
	p = 1;
	pSection = 1;
	order = 'info.name';
	reverse = false;
	sortedCollection: any[];
	itemPerPage = '10';
	itemPerPageSection = '5';

	//*List Variables
	companyList = [];
	locations = [];
	departments = [];
	sections = [];
	sectionDetails = [];

	tempDeptListData = [];
	departmentsDetails = [];

	tempSectionListData = [];
	locDeptSectDetails = [];


	constructor(private toastr: ToastrManager,
		private app: AppComponent,
		private http: HttpClient,
		private excelExportService: IgxExcelExporterService,
		private csvExportService: IgxCsvExporterService) { }

	ngOnInit() {
		this.getLocDeptSectDetails();
		this.getSectionDetails();
		this.getLocation();
		this.getDepartment();
		this.getSection();
		this.getDepartmentDetails();
		this.getCompany();
	}

	@ViewChild("excelDataContent") public excelDataContent: IgxGridComponent;//For excel
	@ViewChild("exportPDF") public exportPDF: ElementRef;


	//To get company
	getCompany() {
		//return false;

		var Token = localStorage.getItem(this.tokenKey);

		var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

		this.http.get(this.serverUrl + 'api/getCompany', { headers: reqHeader }).subscribe((data: any) => {
			this.companyList = data
		});
	}

	//To get location, department and section details
	getLocDeptSectDetails() {

		var Token = localStorage.getItem(this.tokenKey);

		var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

		this.http.get(this.serverUrl + 'api/getLocDeptSectDetails', { headers: reqHeader }).subscribe((data: any) => {
			this.locDeptSectDetails = data
		});
	}


	//To get section details for display in main table
	getSectionDetails() {

		var Token = localStorage.getItem(this.tokenKey);

		var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

		this.http.get(this.serverUrl + 'api/getSectionDetails', { headers: reqHeader }).subscribe((data: any) => {
			this.sectionDetails = data
		});
	}

	//To get location
	getLocation() {

		var Token = localStorage.getItem(this.tokenKey);

		var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

		this.http.get(this.serverUrl + 'api/getLocation', { headers: reqHeader }).subscribe((data: any) => {
			this.locations = data
		});
	}


	//function for get all saved depatment from db
	getDepartment() {

		var Token = localStorage.getItem(this.tokenKey);

		var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

		this.http.get(this.serverUrl + 'api/getDepartment', { headers: reqHeader }).subscribe((data: any) => {
			this.departments = data;
		});
	}

	//function for get all saved sections from db
	getSection() {

		var Token = localStorage.getItem(this.tokenKey);

		var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

		this.http.get(this.serverUrl + 'api/getSection', { headers: reqHeader }).subscribe((data: any) => {
			this.sections = data
		});
	}

	//To get departments details for display in main table
	getDepartmentDetails() {

		var Token = localStorage.getItem(this.tokenKey);

		var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

		this.http.get(this.serverUrl + 'api/getDepartmentDetails', { headers: reqHeader }).subscribe((data: any) => {
			this.departmentsDetails = data
		});
	}


	onLocationChange(item) {

		//alert(item);

		// this.dropSearchLocation = '';
		// this.dropSearchDept = '';
		// this.dropSearchSection = '';

		this.sectionDeptCd = "";
		this.sectionNameCd = "";
		this.activeSection = true;
		if (item == 0) {
			this.tempDeptListData = this.departmentsDetails;
		}
		else {
			this.tempDeptListData = this.departmentsDetails.filter((x) => x.locationCd == item);
		}
	}

	onDeptChange(item) {

		//this.dropSearchLocation = '';
		// this.dropSearchDept = '';
		// this.dropSearchSection = '';

		// this.sectionNameCd = "";

		if (item == 0) {
			this.sectionNameCd = "";
		}
		else {

			this.tempSectionListData = this.locDeptSectDetails.filter(
				(x) => x.deptId == item && x.locationCd == this.sectionLocationCd);

			this.activeSection = false;

		}
	}

	onLocationClick() {
		//alert("location");
		this.dropSearchLocation = '';
	}
	onDeptClick() {
		//alert("Dept");
		this.dropSearchDept = '';
	}

	onSectionClick() {
		//alert("Dept");
		this.dropSearchSection = '';
	}

	//functin for save new section 
	saveSection() {

		if (this.sectName.trim() == '') {
			this.toastr.errorToastr('Please Enter Department', 'Error', { toastTimeout: (2500) });
			return false;
		}
		else {
			if (this.sectId != '') {
				//this.app.showSpinner();
				//this.app.hideSpinner();
				//this.toastr.successToastr('updated successfully', 'Success', { toastTimeout: (2500) });
				//this.clear();
				//return false;

				var updateData = {
					'sectionId': this.sectId,
					'deptCd': this.sectionDeptCd,
					'sectionName': this.sectName,
					'cmpnyId': this.companyList[0].cmpnyId,
				};

				var token = localStorage.getItem(this.tokenKey);

				var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

				this.http.put(this.serverUrl + 'api/updateSection', updateData, { headers: reqHeader }).subscribe((data: any) => {

					if (data.msg == "Error Occured") {
						this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
						return false;
					} else {
						this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
						this.clear();
						$('#sectionModal').modal('hide');
						this.getSection();
						this.getLocDeptSectDetails();
						return false;
					}
				});
			}
			else {

				var saveData = {
					'deptCd': this.sectionDeptCd,
					'sectionName': this.sectName,
					'cmpnyId': this.companyList[0].cmpnyId,
				};

				var token = localStorage.getItem(this.tokenKey);

				var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

				this.http.post(this.serverUrl + 'api/saveSection', saveData, { headers: reqHeader }).subscribe((data: any) => {

					if (data.msg == undefined) {
						this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
						return false;
					} else {
						this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
						this.clear();
						$('#sectionModal').modal('hide');
						this.getSection();
						this.getLocDeptSectDetails();
						return false;
					}
				});
			}
		}
	}


	//Function for save and update section
	saveSectionDetails() {
		if (this.sectionLocationCd == '') {
			this.toastr.errorToastr('Please select head quarter/office', 'Error', { toastTimeout: (2500) });
			return false;
		}
		else if (this.sectionDeptCd == '') {
			this.toastr.errorToastr('Please select department', 'Error', { toastTimeout: (2500) });
			return false;
		}
		else if (this.sectionNameCd == '') {
			this.toastr.errorToastr('Please select enter section name', 'Error', { toastTimeout: (2500) });
			return false;
		}
		else {

			if (this.sectId != '') {
				return false;
				this.toastr.successToastr('updated successfully', 'Error', { toastTimeout: (2500) });
				this.clear();

				return false;

				var updateData = { "ID": this.sectId, "Password": this.txtdPassword, "PIN": this.txtdPin };

				var token = localStorage.getItem(this.tokenKey);

				var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

				this.http.put(this.serverUrl + 'api/pwCreate', updateData, { headers: reqHeader }).subscribe((data: any) => {

					if (data.msg != undefined) {
						this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
						return false;
					} else {
						this.toastr.successToastr('Record updated Successfully', 'Success!', { toastTimeout: (2500) });
						$('#actionModal').modal('hide');
						return false;
					}
				});
			}
			else {

				//alert("Location: " + this.sectionLocationCd + "Dept: " + this.sectionDeptCd + "Section: " + this.sectionNameCd);

				//return false;
				var saveData = {
					"locationCd": this.sectionLocationCd,
					"deptCd": this.sectionNameCd,
					"connectedUser": 12000
				};

				var token = localStorage.getItem(this.tokenKey);

				var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

				this.http.post(this.serverUrl + 'api/saveSectionDetails', saveData, { headers: reqHeader }).subscribe((data: any) => {

					if (data.msg == "Section Detail Already Exist") {
						this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
						this.clear();
						$('#sectionDetailModal').modal('hide');
						//this.activeSection = true;
						this.getSectionDetails();
						return false;
					}
					else if (data.msg == "Section Details Inserted Successfully") {
						this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
						this.clear();
						$('#sectionDetailModal').modal('hide');
						//this.activeSection = true;
						this.getSectionDetails();
						return false;
					}
					else {
						this.toastr.errorToastr(data.msg, 'Error !', { toastTimeout: (2500) });
						this.clear();
						$('#sectionDetailModal').modal('hide');
						//this.activeSection = true;
						this.getSectionDetails();
						return false;
					}
				});
			}
		}
	}


	//function for empty all fields
	clear() {
		this.dSectionId = '';
		this.sectId = ''
		this.sectName = '';
		this.sectionLocationCd = '';
		this.sectionDeptCd = '';
		this.sectionNameCd = '';

		this.txtdPassword = '';
		this.txtdPin = '';

		this.activeSection = true;

		this.dropSearchLocation = '';
		this.dropSearchDept = '';
		this.dropSearchSection = '';

	}


	// small Section modal window Edit
	editSection(item) {
		this.sectId = item.sectionId;
		this.sectName = item.sectionName;
	}

	// small Department modal window Delete
	deleteSection(item) {
		this.clear();
		this.dSectionId = item.sectionId;
		//alert(this.dSectionId);
	}

	// get the "ids" of the delete entry 
	deleteSectDetails(item) {
		this.clear();

		alert("Location: " + item.locationCd + "Dept: " + item.deptId + "Section: " + item.sectionId);

		this.dSectionLocationCd = item.locationCd;
		this.dSectionDepartmentCd = item.deptId;
		this.dSectionNameCd = item.sectionId;
	}


	// delete function
	delete() {
		if (this.txtdPassword == '') {
			this.toastr.errorToastr('Please enter password', 'Error', { toastTimeout: (2500) });
			return false
		}
		else if (this.txtdPin == '') {
			this.toastr.errorToastr('Please enter PIN', 'Error', { toastTimeout: (2500) });
			return false
		}
		else {

			if (this.dSectionLocationCd != "" && this.dSectionDepartmentCd != "" && this.dSectionNameCd != "") {

				alert("Section Details Location " + this.dSectionLocationCd + " Dept Cd = " + this.dSectionNameCd);

				var deleteData = {
					"locationCd": this.dSectionLocationCd,
					"deptCd": this.dSectionNameCd,
					"connectedUser": 12000
				};

				var token = localStorage.getItem(this.tokenKey);

				var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

				this.http.put(this.serverUrl + 'api/deleteSectionDetails', deleteData, { headers: reqHeader }).subscribe((data: any) => {

					if (data.msg == "Error Occured") {
						this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
						this.clear();
						$('#deleteModal').modal('hide');
						this.getSectionDetails();
						return false;
					}
					else {
						this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
						this.clear();
						$('#deleteModal').modal('hide');
						this.getSectionDetails();
						return false;
					}

				});
			}//if ends
			else if (this.dSectionId != "") {

				//alert(this.dSectionId);

				var data = {
					'sectionId': this.dSectionId
				};

				var token = localStorage.getItem(this.tokenKey);

				var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

				this.http.put(this.serverUrl + 'api/deleteSection', data, { headers: reqHeader }).subscribe((data: any) => {

					if (data.msg == "Error Occured") {
						this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
						return false;
					} else {
						this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
						this.clear();
						$('#deleteModal').modal('hide');
						this.getSection();
						return false;
					}
				});
			}// else if ends      
		}//else ends
	}

	//function for sort table data 

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
				width: 100
			};
		doc.fromHTML(
			source, // HTML string or DOM elem ref.
			margins.left, // x coord
			margins.top,
			{
				// y coord
				width: margins.width // max width of content on PDF
			},
			function () {
				// dispose: object with X, Y of the last line add to the PDF
				//          this allow the insertion of new lines after html
				doc.save("TestSection.pdf");
			},
			margins
		);
	}


	//For CSV File 
	public downloadCSV() {

		//alert(this.sectionDetails[0].locationName + "-" + this.sectionDetails[0].deptName + "-" + this.sectionDetails[0].sectionName);


		// case 1: When tblSearch is empty then assign full data list
		if (this.tblSearch == "") {
			var completeDataList = [];
			for (var i = 0; i < this.sectionDetails.length; i++) {
				completeDataList.push({
					location: this.sectionDetails[i].locationName,
					department: this.sectionDetails[i].deptName,
					section: this.sectionDetails[i].sectionName
				});
			}
			this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("SectionCompleteCSV", CsvFileTypes.CSV));
		}
		// case 2: When tblSearch is not empty then assign new data list
		else if (this.tblSearch != "") {
			var filteredDataList = [];
			for (var i = 0; i < this.sectionDetails.length; i++) {

				if (this.sectionDetails[i].locationName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
					this.sectionDetails[i].deptName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
					this.sectionDetails[i].sectionName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
					filteredDataList.push({
						location: this.sectionDetails[i].locationName,
						department: this.sectionDetails[i].deptName,
						section: this.sectionDetails[i].sectionName
					});
				}
			}

			if (filteredDataList.length > 0) {
				this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("SectionFilterCSV", CsvFileTypes.CSV));
			}
			else {
				this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
			}
		}
	}


	//For Exce File
	public downloadExcel() {
		// case 1: When tblSearch is empty then assign full data list
		if (this.tblSearch == "") {
			for (var i = 0; i < this.sectionDetails.length; i++) {
				this.excelDataList.push({
					location: this.sectionDetails[i].locationName,
					department: this.sectionDetails[i].deptName,
					section: this.sectionDetails[i].sectionName
				});
			}
			this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("SectionCompleteExcel"));
			this.excelDataList = [];
		}
		// case 2: When tblSearch is not empty then assign new data list
		else if (this.tblSearch != "") {
			for (var i = 0; i < this.sectionDetails.length; i++) {
				if (this.sectionDetails[i].locationName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
					this.sectionDetails[i].deptName.toUpperCase().includes(this.tblSearch.toUpperCase()) ||
					this.sectionDetails[i].sectionName.toUpperCase().includes(this.tblSearch.toUpperCase())) {
					this.excelDataList.push({
						location: this.sectionDetails[i].locationName,
						department: this.sectionDetails[i].deptName,
						section: this.sectionDetails[i].sectionName
					});
				}
			}

			if (this.excelDataList.length > 0) {
				this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("SectionFilterExcel"));
				this.excelDataList = [];
			}
			else {
				this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
			}
		}
	}

}