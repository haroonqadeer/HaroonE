import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";

@Component({
  selector: "app-config-address",
  templateUrl: "./config-address.component.html",
  styleUrls: ["./config-address.component.scss"]
})
export class ConfigAddressComponent implements OnInit {
  serverUrl = "http://localhost:5000/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  srchCntry;
  srchCity;
  srchAdrs;

  addressList = [];
  cntryList = [];
  cityList = [];
  adrsTypeList = [];

  addressType = "";
  address = "";
  country = "";
  city = "";
  zipCode = "";

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getCountry();
    this.getCity();
    this.getAddressType();
  }

  getCountry() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCountry", { headers: reqHeader })
      .subscribe((data: any) => {
        this.cntryList = data;
      });
  }

  getCity() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCity", { headers: reqHeader })
      .subscribe((data: any) => {
        this.cityList = data;
      });
  }

  getAddressType() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getAddressType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.adrsTypeList = data;
      });
  }

  addAddress() {
    if (this.addressType == "") {
      this.toastr.errorToastr("Please select address type", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.address.trim() == "") {
      this.toastr.errorToastr("Please enter address", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.country == "") {
      this.toastr.errorToastr("Please select country", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.city == "") {
      this.toastr.errorToastr("Please select city", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.zipCode == "") {
      this.toastr.errorToastr("Please enter zip code", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      this.addressList.push({
        contactDetailCode: 0,
        addressId: 0,
        addressType: this.addressType,
        address: this.address,
        cityCode: this.city,
        districtCode: 0,
        provinceCode: 0,
        countryCode: this.country,
        zipCode: this.zipCode,
        status: 0
      });

      this.addressType = "";
      this.address = "";
      this.country = "";
      this.city = "";
      this.zipCode = "";
    }
  }

  //Deleting address row
  removeAddress(item) {
    this.addressList.splice(item, 1);
  }
}
