import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

    appLocation = "http://localhost:4200";
    //appLocation = "http://192.168.200.19:9010";
    //appLocation = "http://192.168.200.19:9010";
    // appLocation = "http://192.168.200.57:9010";

    public moduleHR = false;
    public moduleConfig = false;

    constructor(private router: Router) { }

    ngOnInit() {
    }

    //function for active/load module
    public activeModule(moduleName) {

        this.moduleHR = false;
        this.moduleConfig = false;

        if (moduleName == 'HR') {
            localStorage.setItem('myActModNam', 'HR');
        }
        else if (moduleName == 'Config') {
            localStorage.setItem('myActModNam', 'Config');
        }

    }

    //show animation
    showAnim(val) {
        //finance
        if (val == 1) {
            $('#finance').addClass('animated jello');
        }
        else if (val == 2) {
            $('#hr').addClass('animated jello');
        }
        else if (val == 3) {
            $('#user').addClass('animated jello');
        }
        else if (val == 4) {
            $('#payroll').addClass('animated jello');
        }
        else if (val == 5) {
            $('#company').addClass('animated jello');
        }
        else if (val == 6) {
            $('#disaster').addClass('animated jello');
        }
        else if (val == 7) {
            $('#procurement').addClass('animated jello');
        }
    }

    //open ERP Module
    openModule(val) {
        //finance
        if (val == 1) {
            this.activeModule("Config");
            //this.router.navigate(['']);
            window.location.replace(this.appLocation);
        }
        //hr
        else if (val == 2) {
            this.activeModule("HR");
            //this.router.navigate(['']);
            window.location.replace(this.appLocation);
        }
        //user
        else if (val == 3) {
            window.open('http://192.168.200.16:9001/')
        }
        //payroll
        else if (val == 4) {
            window.open('http://192.168.200.16:9005/')
        }
        //company
        else if (val == 5) {
            window.open('http://192.168.200.16:9002/')
        }
        //disaster
        else if (val == 6) {
            window.open('http://192.168.200.16:9006/')
        }
        //procurement
        else if (val == 7) {
            window.open('http://192.168.200.16:9007/')
        }
        //warehouse
        else if (val == 8) {
            window.open('http://192.168.200.16:9008/')
        }
        //audit
        else if (val == 9) {
            window.open('http://192.168.200.16:9009/')
        }
    }

}
