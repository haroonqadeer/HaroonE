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
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

    //serverUrl = "http://52.163.49.124:9010/";
    serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9010/";
    //serverUrl = "http://52.163.189.189:9010/";
    //serverUrl = "http://localhost:9010/";
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
  }

  onSubmit(){
    $('#forgotModal').modal('show');
  }

  getKeyPressed(e) {
    if (e.keyCode == 13) {
      // this.onSubmit();
    }
  }
}

