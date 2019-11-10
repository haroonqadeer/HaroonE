import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';




@Component({
    selector: 'app-config-address',
    templateUrl: './config-address.component.html',
    styleUrls: ['./config-address.component.scss']
})
export class ConfigAddressComponent implements OnInit {

    addressType = [];
    
    addressDetail = [
        {
            id: 0,
            addressType: "",
            address: "",
            countryCode: "",
            provinceCode: "",
            districtCode: "",
            cityCode: ""
        }
    ];

    constructor() { }

    ngOnInit() {
    }

}
