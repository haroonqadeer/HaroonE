import { Component, OnInit, ViewChild, ElementRef, NgModule, EventEmitter, Output } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppComponent } from '../../../../../../src/app/app.component';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { ConfigAddressComponent } from 'src/app/components/config-address/config-address.component';
import { ConfigContactComponent } from 'src/app/components/config-contact/config-contact.component';

//import { SelectItem } from 'primeng/api';

// import * as jsPDF from 'jspdf';
import {
  IgxExcelExporterOptions,
  IgxExcelExporterService,
  IgxGridComponent,
  IgxCsvExporterService,
  IgxCsvExporterOptions,
  CsvFileTypes
} from "igniteui-angular";
import { FormArray, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgForOf } from '@angular/common';

//import { AddressComponent } from 'src/app/shared/address/address.component';

// import { DepartmentComponent } from "src/app/components/department/department.component";

import { ValidationAddressService } from '../../shared/services/validation-address.service'; //'src/app/shared/services/validation-address.service';
// import { AddressComponent } from '../../shared/address/address.component';


//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting branch data into main table -------------------//
//-------------------Add new branch into database --------------------------//
//-------------------Add new city into database --------------------------//
//-------------------Update branch into database ---------------------------//
//-------------------Delete branch from database ---------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//-------------------Function for email validation -----------------------------//
//-------------------For sorting the record-----------------------------//
//----------------------------------------------------------------------------//


declare var $: any;

// interface City {
//   label: string;
//   countryCode: string;
// }


@Component({
  // providers: [AddressComponent],
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})

export class BranchComponent implements OnInit {

  @Output() myEvent = new EventEmitter();

  // public contactForm: FormGroup;
  // public addressForm: FormGroup;

  //areaCode = false;
  //mobileNetworkCode = false;

  branchBox = true;

  //work = false;
  //shipping = false;
  //postal = false;


  serverUrl = "https://localhost:7005/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  // list for excel data
  excelDataList = [];
  contactTypeList = [];
  countryList = [];
  areaList = [];
  networkList = [];
  addressTypeList = [];
  emailTypeList = [];

  countryListForAddress = [];
  provinceList = [];
  districtList = [];
  cityList = [];


  //** Dropdown (temporary lists) for filters */
  //dropCountryList = [];
  dropProvinceList = [];
  dropDistrictList = [];
  dropCityList = []



  //*Page Models
  branchId = null;
  branchType = "";
  branchTitle = "";

  branchCity = "";

  branchWebsite = "";

  branchAddressType = "";
  branchWork = "";
  branchShipping = "";
  branchPostal = "";

  dbranchId = null;

  //*NgModel For Searching textboxes
  tblSearch = "";

  menuComboText = "";

  //*City Modal Window Models
  cityName = "";

  //*Delete Modal Window Models
  userPassword = "";
  userPINCode = "";


  //* dropdown search ng-models
  dropSearchBranch = "";

  //* variables for pagination and orderby pipe
  p = 1;
  order = 'info.label';
  reverse = false;
  sortedCollection: any[];
  itemPerPage = '10';

  //contact Detail
  contactDetail = [
    {
      contactId: 0,
      contactType: "",
      countryCode: "",
      contactCode: "",
      areaCode: true,
      mobileCode: false,
      contactNumber: "",
      mobileNumber: ""
    }
  ];

  //address Detail
  addressDetail = [
    {
      addressType: "",
      address: "",
      countryName: "",
      countryCode: "",
      provinceList: "",
      provinceCode: "",
      districtList: "",
      districtCode: "",
      cityList: "",
      cityCode: ""
    }
  ];

  //Emails Detail
  emailDetail = [
    {
      type: "",
      email: ""
    }
  ];


  branches = [
    {
      branId: 1,
      branType: "Head Quarter",
      branTitle: "Infovative Solution",

      ctyId: 1,
      ctyName: "Islamabad",
      branWebsite: "www.google.com",
      //*------------------------------------//

      //*--------------------------------------//
      //branContact: this.contactDetail,
      branPhone: "0512290450",
      branMobile: "03331234567",
      branFax: "0512234567",
      branAddress: "G-14 Markaz",
      branEmail: "abc@gmail.com"

    },
    {
      branId: 2,
      branType: "Branch",
      branTitle: "Infovative Solution",
      branAddress: "G-14 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512290450",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 3,
      branType: "Branch",
      branTitle: "Infovative Solution",
      branAddress: "G-8 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512290450",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 4,
      branType: "Head Quarter",
      branTitle: "Alpha Solution",
      branAddress: "G-10 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512290450",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 5,
      branType: "Branch",
      branTitle: "Infovative Solution",
      branAddress: "G-12 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512290450",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 6,
      branType: "Branch",
      branTitle: "Infovative Solution",
      branAddress: "G-13 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512290560",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 7,
      branType: "Branch",
      branTitle: "Infovative Solution",
      branAddress: "G-15 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512290670",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 8,
      branType: "Head Quarter",
      branTitle: "Infovative Tech",
      branAddress: "G-15 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512290560",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 9,
      branType: "Head Quarter",
      branTitle: "Infovative Hub",
      branAddress: "G-11 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512245450",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 10,
      branType: "Branch",
      branTitle: "Infovative Solution",
      branAddress: "G-6 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512295350",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 11,
      branType: "Branch",
      branTitle: "Infovative Solution",
      branAddress: "G-7 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512290550",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 12,
      branType: "Branch",
      branTitle: "Infovative Solution",
      branAddress: "I-9 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512220450",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 13,
      branType: "Branch",
      branTitle: "Infovative Solution",
      branAddress: "I-8 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512290450",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 14,
      branType: "Branch",
      branTitle: "Infovative Solution",
      branAddress: "E-11 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512290450",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    },
    {
      branId: 15,
      branType: "Branch",
      branTitle: "Infovative Solution",
      branAddress: "D-17 Markaz",
      ctyId: 1,
      ctyName: "Islamabad",
      branEmail: "abc@gmail.com",
      branPhone: "0512290450",
      branMobile: "03331234567",
      branFax: "0512234567",
      branWebsite: "www.google.com"
    }
  ]

  //*use in city combobox
  cities = [
    { ctyId: '1', ctyName: 'Islamabad' },
    { ctyId: '2', ctyName: 'Karachi' },
    { ctyId: '3', ctyName: 'Lahore' },
    { ctyId: '4', ctyName: 'Quetta' }
  ];

  constructor(public toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient,
    private excelExportService: IgxExcelExporterService,
    private csvExportService: IgxCsvExporterService,
    private fb: FormBuilder,
    private validObj: ValidationAddressService,
    // private addObj: AddressComponent
    ) {

  }

  ngOnInit() {
    // this.getAddressTypes();
    // this.getCountry();
    // this.getProvince();
    // this.getDistrict();
    // this.getCity();
    // this.getContactType();
    // this.getEmailType();
  }


  @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent;//For excel
  @ViewChild("exportPDF") public exportPDF: ElementRef;// for pdf

  //@ViewChild("addressObj") public addressObj: AddressComponent;

  //* get all branch data
  getBranches() {
    //return false;

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getBranch', { headers: reqHeader }).subscribe((data: any) => {
      this.branches = data
    });
  }

  //* get address types
  getAddressTypes() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getAddressType', { headers: reqHeader }).subscribe((data: any) => {

      for (var i = 0; i < data.length; i++) {
        this.addressTypeList.push({
          label: data[i].addressTypeName,
          value: data[i].addressTypeCd
        });
      }
    });
  }

  //* get country
  getCountry() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getCountry', { headers: reqHeader }).subscribe((data: any) => {

      for (var i = 0; i < data.length; i++) {
        this.countryListForAddress.push({
          label: data[i].cntryName,
          value: data[i].cntryCd
        });

        this.countryList.push({
          label: data[i].cntryName + ' ' + data[i].cntryCallingCd,
          value: data[i].cntryCallingCd
        });
      }

    });

  }

  //* get province
  getProvince() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getProvince', { headers: reqHeader }).subscribe((data: any) => {

      for (var i = 0; i < data.length; i++) {
        this.provinceList.push({
          label: data[i].prvinceName,
          value: data[i].prvncCd,
          cntryCd: data[i].cntryCd
        });
      }

    });

  }

  //* get district
  getDistrict() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getDistrict', { headers: reqHeader }).subscribe((data: any) => {

      for (var i = 0; i < data.length; i++) {
        this.districtList.push({
          label: data[i].districtName,
          value: data[i].districtCd,
          prvncCd: data[i].prvncCd,
        });
      }

    });

  }

  //  //* get city
  getCity() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getCity', { headers: reqHeader }).subscribe((data: any) => {

      for (var i = 0; i < data.length; i++) {
        this.cityList.push({
          label: data[i].thslName,
          value: data[i].thslCd,
          districtCd: data[i].districtCd,
        });
      }

    });

  }

  //* get contact types
  getContactType() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getTelephoneType', { headers: reqHeader }).subscribe((data: any) => {

      for (var i = 0; i < data.length; i++) {
        this.contactTypeList.push({
          label: data[i].teleTypeName,
          value: data[i].teleTypeCd
        });
      }

    });

  }

  //* get email types
  getEmailType() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getEmailType', { headers: reqHeader }).subscribe((data: any) => {

      for (var i = 0; i < data.length; i++) {
        this.emailTypeList.push({
          label: data[i].emailTypeName,
          value: data[i].emailTypeCd
        });
      }

    });

  }


  clearCty() {
    this.cityName = "";
  }

  onBranchClick() {
    this.dropSearchBranch = "";
  }

  //* Function for saving and updating the data 
  saveBranch() {
    if (this.branchType.trim() == "") {
      this.toastr.errorToastr('Please Enter Branch Type', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.branchTitle.trim() == "") {
      this.toastr.errorToastr('Please Enter Branch Title', 'Error', { toastTimeout: (2500) });
      return false;
    }
    // else if (this.branchCity.trim() == "") {
    //   this.toastr.errorToastr('Please Enter Branch City', 'Error', { toastTimeout: (2500) });
    //   return false;
    // }
    // else if (this.branchWebsite.trim() == "") {
    //   this.toastr.errorToastr('Please Enter Branch Website', 'Error', { toastTimeout: (2500) });
    //   return false;
    // }
    // address type conditions
    else if (this.addressDetail.length == 0) {
      this.toastr.errorToastr('Please Add Address Info Type', 'Error', { toastTimeout: (2500) });
      return false;
    }
    // contact type conditions
    else if (this.contactDetail.length == 0) {
      this.toastr.errorToastr('Please Add Contact Info Type', 'Error', { toastTimeout: (2500) });
      return false;
    }
    // email type conditions
    else if (this.emailDetail.length == 0) {
      this.toastr.errorToastr('Please Add Email Info Type', 'Error', { toastTimeout: (2500) });
      return false;
    }

    else {

      // address type conditions for branch/location
      if (this.addressDetail.length > 0) {
        for (let i = 0; i < this.addressDetail.length; i++) {
          if (this.addressDetail[i].addressType == "") {
            this.toastr.errorToastr('Please Select Address Type', 'Error', { toastTimeout: (2500) });
            return false;
          }
          else if (this.addressDetail[i].address.trim() == "") {
            this.toastr.errorToastr('Please Enter Address', 'Error', { toastTimeout: (2500) });
            return false;
          }
          else if (this.addressDetail[i].countryCode == "") {
            this.toastr.errorToastr('Please Select Country', 'Error', { toastTimeout: (2500) });
            return false;
          }
          else if (this.addressDetail[i].provinceCode == "") {
            this.toastr.errorToastr('Please Select Province', 'Error', { toastTimeout: (2500) });
            return false;
          }
          else if (this.addressDetail[i].districtCode == "") {
            this.toastr.errorToastr('Please Select District', 'Error', { toastTimeout: (2500) });
            return false;
          }
          else if (this.addressDetail[i].cityCode == "") {
            this.toastr.errorToastr('Please Select City', 'Error', { toastTimeout: (2500) });
            return false;
          }
        }
      }

      // contact type conditions for branch/location
      if (this.contactDetail.length > 0) {
        for (let i = 0; i < this.contactDetail.length; i++) {
          if (this.contactDetail[i].contactType == "") {
            this.toastr.errorToastr('Please Select Contact Type', 'Error', { toastTimeout: (2500) });
            return false;
          }
          else if (this.contactDetail[i].countryCode == "") {
            this.toastr.errorToastr('Please Select Country Code', 'Error', { toastTimeout: (2500) });
            return false;
          }
          else if (this.contactDetail[i].contactNumber.trim() == "" && this.contactDetail[i].areaCode == true) {
            this.toastr.errorToastr('Please Enter Landline Contact Number', 'Error', { toastTimeout: (2500) });
            return false;
          }
          else if (this.contactDetail[i].mobileNumber.trim() == "" && this.contactDetail[i].mobileCode == true) {
            this.toastr.errorToastr('Please Enter Mobile Contact Number', 'Error', { toastTimeout: (2500) });
            return false;
          }
        }
      }

      // email type conditions for branch/location
      if (this.emailDetail.length > 0) {
        for (let i = 0; i < this.emailDetail.length; i++) {
          if (this.emailDetail[i].type == "") {
            this.toastr.errorToastr('Please Select Email Type', 'Error', { toastTimeout: (2500) });
            return false;
          }
          else if (this.emailDetail[i].email.trim() == "") {
            this.toastr.errorToastr('Please Enter Email', 'Error', { toastTimeout: (2500) });
            return false;
          }
          else if (this.isEmail(this.emailDetail[i].email) == false) {
            this.toastr.errorToastr('Invalid email', 'Error', { toastTimeout: (2500) });
            return false;
          }
        }
      }

      //this.addContact();

      // alert(this.branchId);

      if (this.branchId != "") {
        // this.app.showSpinner();
        // this.app.hideSpinner();
        this.toastr.successToastr('Updated Successfully', 'Success', { toastTimeout: (2500) });
        this.clear();
        //this.contactDetail=[];
        $('#branchModal').modal('hide');

        return false;

        var updateData = { "ID": this.branchId, Password: this.userPassword, PIN: this.userPINCode };

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
        //this.app.showSpinner();
        //this.toastr.successToastr('saved successfully', 'Success', { toastTimeout: (2500) });
        //this.clear();
        //this.contactDetail=[];
        //$('#branchModal').modal('hide');
        //this.app.hideSpinner();

        //return false;



        var saveData = {
          "locationType": this.branchType,
          "locationName": this.branchTitle,
          "addressList": JSON.stringify(this.addressDetail),
          "contactList": JSON.stringify(this.contactDetail),
          "emailList": JSON.stringify(this.emailDetail)
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.post(this.serverUrl + 'api/saveBranch', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg != "Done") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          } else {
            this.toastr.successToastr('Record saved Successfully', 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#branchModal').modal('hide');
            return false;
          }

        });
      }
    }
  }


  //*Function for Saving city data
  saveCity() {

    if (this.cityName.trim() == '') {
      this.toastr.errorToastr('Please enter city label', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {
      let data = this.cities.find(x => x.ctyName == this.cityName);

      if (data != undefined) {
        this.toastr.errorToastr('City label already exist', 'Error', { toastTimeout: (2500) });
        return false;
      }
      else {
        this.app.showSpinner();
        this.app.hideSpinner();

        this.toastr.successToastr('Saved successfully', 'Success', { toastTimeout: (2500) });

        this.cities.push({ ctyId: this.cities.length + "", ctyName: this.cityName });

        this.clear();
        // $('#addCityModal').click();
        $('#cityModal').modal('hide');

        return false;

        // var updateData = { "sectionlabel": this.cityName };

        // var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        // this.http.post(this.serverUrl + 'api/pwCreate', updateData, { headers: reqHeader }).subscribe((data: any) => {

        //   if (data.msg != undefined) {
        //     this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
        //     return false;
        //   } else {
        //     this.toastr.successToastr('Record Deleted Successfully', 'Success!', { toastTimeout: (2500) });
        //     $('#cityModal').modal('hide');
        //     return false;
        //   }

        // });

      }
    }
  }


  //*Clear the input fields
  clear() {

    //return false;

    this.dropSearchBranch = "";

    this.branchId = 0;
    this.branchType = '';
    this.branchTitle = '';
    //this.branchAddress = '';
    this.branchCity = '';
    // this.branchEmail = '';
    // this.branchPhone = '';
    // this.branchMobile = '';
    // this.branchFax = '';
    this.branchWebsite = '';

    // this.addressDetail = [];
    // this.contactDetail = [];
    // this.emailDetail = [];

    this.addressDetail = [
      {
        addressType: "",
        address: "",
        countryName: "",
        countryCode: "",
        provinceList: "",
        provinceCode: "",
        districtList: "",
        districtCode: "",
        cityList: "",
        cityCode: ""
      }
    ];

    this.contactDetail = [
      {
        contactId: 0,
        contactType: "",
        countryCode: "",
        contactCode: "",
        areaCode: true,
        mobileCode: false,
        contactNumber: "",
        mobileNumber: ""
      }
    ];

    this.emailDetail = [
      {
        type: "",
        email: ""
      }
    ];

    this.cityName = "";

    this.userPassword = '';
    this.userPINCode = '';

    this.dbranchId = "";

    this.dropProvinceList = [];
    this.dropDistrictList = [];
    this.dropCityList = []
  }


  //*Edit Function
  edit(item) {
    this.branchId = item.branId;
    this.branchType = item.branType;
    this.branchTitle = item.branTitle;
    //this.branchAddress = item.branAddress;
    this.branchCity = item.ctyId.toString();
    // this.branchEmail = item.branEmail;
    // this.branchPhone = item.branPhone;
    // this.branchMobile = item.branMobile;
    // this.branchFax = item.branFax;
    this.branchWebsite = item.branWebsite;

  }


  //*get the "id" of the delete entry 
  deleteTemp(item) {
    this.clear();
    this.dbranchId = item.branId;
  }


  //* Delete Function 
  delete() {
    if (this.userPassword.trim() == "") {
      this.toastr.errorToastr('Please Enter Password', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.userPINCode.trim() == "") {
      this.toastr.errorToastr('Please Enter PIN Code', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {
      this.app.showSpinner();
      this.app.hideSpinner();
      this.toastr.successToastr('Record Deleted Successfully', 'Success', { toastTimeout: (2500) });
      this.clear();
      $('#deleteModal').modal('hide');

      return false;

      // var data = { "ID": this.dbranchId, Password: this.userPassword, PIN: this.userPINCode };

      // var token = localStorage.getItem(this.tokenKey);

      // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      // this.http.put(this.serverUrl + 'api/pwCreate', data, { headers: reqHeader }).subscribe((data: any) => {

      //   if (data.msg != undefined) {
      //     this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
      //     return false;
      //   } else {
      //     this.toastr.successToastr('Record Deleted Successfully', 'Success!', { toastTimeout: (2500) });
      //     $('#actionModal').modal('hide');
      //     return false;
      //   }

      // });
    }
  }


  //* function for email validation
  isEmail(email) {
    return this.app.validateEmail(email);
  }


  //*function for sort table data 
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

    // var doc = new jsPDF("p", "pt", "A4"),
    //   source = $("#printArea")[0],
    //   margins = {
    //     top: 75,
    //     right: 30,
    //     bottom: 50,
    //     left: 30,
    //     width: 50
    //   };
    // doc.fromHTML(
    //   source, // HTML string or DOM elem ref.
    //   margins.left, // x coord
    //   margins.top,
    //   {
    //     // y coord
    //     width: margins.width // max width of content on PDF
    //   },
    //   function (dispose) {
    //     // dispose: object with X, Y of the last line add to the PDF
    //     //          this allow the insertion of new lines after html
    //     doc.save("Test.pdf");
    //   },
    //   margins
    // );
  }


  //For CSV File 
  public downloadCSV() {

    return false;

  }


  //For Exce File
  public downloadExcel() {
    return false;

  }


  onContactChange(contactType, item) {

    if (contactType == "1" || contactType == "2" || contactType == "6") {
      item.areaCode = false;
      item.mobileCode = true;
    }
    else if (contactType == "3" || contactType == "4" || contactType == "5" || contactType == "7") {
      item.areaCode = true;
      item.mobileCode = false;
    }
    else {
      return;
    }
  }


  addContact() {
    this.contactDetail.push({
      contactId: 0,
      contactType: "",
      countryCode: "",
      contactCode: "",
      areaCode: true,
      mobileCode: false,
      contactNumber: "",
      mobileNumber: ""
    });

  }

  addAddress() {
    //this.clear();
    this.addressDetail.push({
      addressType: "",
      address: "",
      countryName: "",
      countryCode: "",
      provinceList: "",
      provinceCode: "",
      districtList: "",
      districtCode: "",
      cityList: "",
      cityCode: ""
    });

  }

  addEmail() {

    this.emailDetail.push({
      type: "",
      email: ""
    });

  }

  // clearContact() {

  //   this.branchContactType = '';
  //   this.branchCountryCode = '';
  //   this.branchAreaCode = '';
  //   this.branchMobileNetworkCode = '';
  //   this.branchContactNumber = '';
  // }

  // editContact(item) {
  //   this.branchContactType = item.branchContactType;
  //   this.branchCountryCode = item.branchCountryCode;
  //   this.branchAreaCode = item.branchAreaCode;
  //   this.branchMobileNetworkCode = item.branchMobileNetworkCode;
  //   this.branchContactNumber = item.branchContactNumber;
  // }


  // addBranchGroup() {
  //   return this.fb.group({
  //     //menuComboText: [''],
  //     branchContactType: ['', Validators.required],
  //     branchCountryCode: ['', Validators.required],
  //     branchAreaCode: [''],
  //     branchMobileNetworkCode: [''],
  //     branchContactNumber: ['', Validators.required]
  //     //menuCombo: ['', Validators.required]
  //   })
  // }

  // Add New ComboBox to an array()
  // addBranchContact() {
  //   this.branchValue.push(this.addBranchGroup());
  // }

  //Getting new ComboBox from array and show in front page
  // get branchValue() {
  //   return <FormArray>this.contactForm.get('branches');
  // }

  //Deleting contact row
  removeContact(item) {
    this.contactDetail.splice(item, 1);
  }

  //Deleting address row
  removeAddress(item) {
    this.addressDetail.splice(item, 1);
  }

  //Deleting address row
  removeEmail(item) {
    this.emailDetail.splice(item, 1);
  }


  //*--------------------------------Address-------------------------------//

  // onChangeAddress(addressType) {

  //   //alert(contactType.value(index.toString()));

  //   if (addressType == "Work") {
  //     this.work = true;
  //     this.shipping = false;
  //     this.postal = false;
  //   }
  //   else if (addressType == "Shipping") {
  //     this.work = false;
  //     this.shipping = true;
  //     this.postal = false;
  //   }
  //   else if (addressType == "Postal") {
  //     this.work = false;
  //     this.shipping = false;
  //     this.postal = true;
  //   }
  //   else {
  //     return;
  //   }
  // }

  // addBranchGroupAddress() {
  //   return this.fb.group({
  //     //menuComboText: [''],
  //     branchWork: ['', Validators.required],
  //     branchShipping: ['', Validators.required],
  //     branchPostal: ['', Validators.required]
  //     //menuCombo: ['', Validators.required]
  //   })
  // }

  // // Add New ComboBox to an array()
  // addBranchAddress() {
  //   this.branchAddressValue.push(this.addBranchGroupAddress());
  // }

  // //Getting new ComboBox from array and show in front page
  // get branchAddressValue() {
  //   return <FormArray>this.addressForm.get('branchAddresses');
  // }

  // //Deleting every comboBox with specific id which is ([formGroupName]="i")
  // deleteBranchAddress(i) {
  //   this.branchAddressValue.removeAt(i);
  //   //alert(i);
  //   //alert(this.contactFormBranch.get('menuCombo.areaName'));
  //   //alert(this.branchValue[i]);
  // }

  // greetStudent() {
  //   this.validObj.sendMessage("Good Morning");
  // }
  // appreciateStudent() {
  //   this.validObj.sendMessage("Well Done");
  // }


  onCountryChange(item) {

    if (item == "") {
      this.dropProvinceList = this.provinceList;
    }
    else {
      this.dropProvinceList = this.provinceList.filter((x) => x.cntryCd == item);
    }
  }

  onProvinceChange(item) {

    if (item == "") {
      this.dropDistrictList = this.districtList;
    }
    else {
      this.dropDistrictList = this.districtList.filter((x) => x.prvncCd == item);
    }
  }

  onDistrictChange(item) {

    if (item == "") {
      this.dropCityList = this.cityList;
    }
    else {
      this.dropCityList = this.cityList.filter((x) => x.districtCd == item);
    }
  }


}
