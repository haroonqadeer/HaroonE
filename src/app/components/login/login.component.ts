// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }


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

var $: any;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService]
})
export class LoginComponent implements OnInit {

    serverUrl = "http://localhost:11664/";
    //serverUrl = "http://192.168.200.19:3006/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    txtUserName = '';
    txtPassword = '';

    constructor(private http: HttpClient, private formBuilder: FormBuilder, public toastr: ToastrManager, private router: Router, private app: AppComponent) { }


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

            //   localStorage.setItem('userName', this.txtUserName);
            //   localStorage.setItem('myActModNam', 'HR');
            //   this.app.checkLogin('Yes');
            localStorage.setItem('userName', this.txtUserName);
            localStorage.setItem('myActModNam', 'HR');
            this.app.checkLogin('Yes');
            return false;

            var loginData = { "IndvdlERPUsrID": this.txtUserName, "IndvdlERPPsswrd": this.txtPassword };

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.post(this.serverUrl + 'api/getUsers', loginData, { headers: reqHeader }).subscribe((data: any) => {


                if (data.msg == "Logedin Successfully!") {
                    this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                    localStorage.setItem('userName', this.txtUserName);
                    localStorage.setItem('myActModNam', 'HR');
                    this.app.checkLogin('Yes');
                } else {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                }

                // if (data.msg != "Record Saved Successfully!") {
                //     this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                //     return false;
                // } else {
                //     this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
                //     $('#typeModal').modal('hide');
                //     this.getLeaveTypes();
                //     return false;
                // }
            });

            // this.http.post(this.serverUrl + 'api/token', data, { headers: reqHeader }).subscribe((data: any) => {

            //     if (data.msg != undefined) {
            //         this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            //         return false;
            //     } else {
            //         //this.Idle.startWatching();
            //         //localStorage.setItem('token', data.token);
            //         localStorage.setItem('userName', data.userName);
            //         localStorage.setItem('myActModNam', 'HR');
            //         this.app.checkLogin('Yes');
            //         //this.router.navigate(['/introPage']);
            //     }
            // });

        }
    }

    getKeyPressed(e) {
        if (e.keyCode == 13) {
            this.onSubmit();
        }
    }
}
