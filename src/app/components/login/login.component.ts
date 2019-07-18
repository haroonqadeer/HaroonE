import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppComponent } from 'src/app/app.component';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

declare var $: any;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService]
})
export class LoginComponent implements OnInit {

// <<<<<<< HEAD
    // serverUrl = "http://125.1.1.252:9011/";
    serverUrl = "http://192.168.200.19:9010/";
// =======
    //<<<<<<< HEAD
    // serverUrl = "https://localhost:5001/";

    //serverUrl = "https://localhost:8008/";
    //serverUrl = "http://localhost:11664/";
    //=======
    //serverUrl = "http://192.168.200.52:1001/";
// >>>>>>> 6baa61dccfa396920caf44af3017542ec596dd83
    //serverUrl = "http://localhost:23145/";
    //>>>>>>> 3989d7fefbd36ef29be1f3d121ba076c14d8cbf9
    //serverUrl = "http://192.168.200.19:3006/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    txtUserName = '';
    txtPassword = '';

    constructor(private http: HttpClient,
        private formBuilder: FormBuilder,
        public toastr: ToastrManager,
        private router: Router,
        private app: AppComponent) { }


    ngOnInit() {
        this.app.checkLogin('Yes');
    }

    onSubmit() {


        if (this.txtUserName.trim().length == 0) {
            this.toastr.errorToastr('Please Enter User Name', 'Oops!', { toastTimeout: (2500) });
            return false;
        }
        else if (this.txtPassword == "") {
            this.toastr.errorToastr('Please Enter Password', 'Oops!', { toastTimeout: (2500) });
            return false;
        }
        else {

            //localStorage.setItem('userName', this.txtUserName);
            //localStorage.setItem('myActModNam', 'HR');
            //this.app.checkLogin('Yes');
            //return false;

            this.app.showSpinner();

            var loginData = { "IndvdlERPUsrID": this.txtUserName, "IndvdlERPPsswrd": this.txtPassword };

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/chkLogin', loginData, { headers: reqHeader }).subscribe((data: any) => {


                if (data.msg == "Login Successfully!") {
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });

                    localStorage.setItem('userName', this.txtUserName);
                    localStorage.setItem('myActModNam', 'HR');
                    this.app.checkLogin('Yes');
                    this.app.branchList = data.userDetail;
                    this.app.locationId = data.userDetail[0].locationCd;
                    this.app.cmpnyId = data.userDetail[0].cmpnyId;
                    this.app.cmpnyName = data.userDetail[0].locationName;
                    
                    this.app.hideSpinner();

                } else {
                    // alert(data.msg);
                    this.app.hideSpinner();
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    $(".mat-form-field-underline").css("background-color", "red");
                    $(".mat-form-field-label").css("color", "red");
                }
            });
        }
    }

    getUserDetail(item) {

        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getUserDept?empID=' + item, { headers: reqHeader }).subscribe((data: any) => {

            //this.posts = data;
            localStorage.setItem('deptCd', data[0].jobPostDeptCd);

        });

    }

    getKeyPressed(e) {
        if (e.keyCode == 13) {
            this.onSubmit();
        }
    }
}
