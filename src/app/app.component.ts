import { Component, ModuleWithProviders } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MatBottomSheet } from '@angular/material';
import { Event, Router, NavigationStart, NavigationEnd } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

import { NavComponent } from './components/nav/nav.component';
import { AttendanceComponent } from './components/attendance/attendance.component';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  //modules variable declaration
  moduleHR = false;
  moduleConfig = false;

  logedInUserName = '';

  public hideDiv = false;
  items: MenuItem[];

  constructor(
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private navApp: NavComponent,
    private spinner: NgxSpinnerService,
    // private attendApp: AttendanceComponent
  ) { }

  ngOnInit() {

    //this.moduleHR = this.navApp.moduleHR;

    this.checkLogin("No");

    this.activeModule("No");

    this.items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [{
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [
            { label: 'Project' },
            { label: 'Other' },
          ]
        },
        { label: 'Open' },
        { separator: true },
        { label: 'Quit' }
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: 'Delete', icon: 'pi pi-fw pi-trash' },
          { label: 'Refresh', icon: 'pi pi-fw pi-refresh' }
        ]
      },
      {
        label: 'Help',
        icon: 'pi pi-fw pi-question',
        items: [
          {
            label: 'Contents'
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-search',
            items: [
              {
                label: 'Text',
                items: [
                  {
                    label: 'Workspace'
                  }
                ]
              },
              {
                label: 'File'
              }
            ]
          }
        ]
      },
      {
        label: 'Actions',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
              { label: 'Save', icon: 'pi pi-fw pi-save' },
              { label: 'Update', icon: 'pi pi-fw pi-save' },
            ]
          },
          {
            label: 'Other',
            icon: 'pi pi-fw pi-tags',
            items: [
              { label: 'Delete', icon: 'pi pi-fw pi-minus' }
            ]
          }
        ]
      },
      { separator: true },
      {
        label: 'Quit', icon: 'pi pi-fw pi-times'
      }
    ];
  }

  //function for get active module 
  activeModule(showMenu) {

    this.moduleHR = false;
    this.moduleConfig = false;


    var myModuleName = localStorage.getItem('myActModNam');

    if (myModuleName == "HR") {
      this.moduleHR = true;
    }
    else if (myModuleName == "Config") {
      this.moduleConfig = true;
    }

  //*Functions for Show & Hide Spinner
  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
      setTimeout(() => {
          /** spinner ends after process done*/
          this.spinner.hide();
      }, 1000);
  }


    //method for show and hide manu bar with login and logout user
    showDiv() {
        this.hideDiv = true;
        // if (this.router.url != "/") {
        //   this.hideDiv = true;

        // } else {
        //   this.hideDiv = false;
        // }
        // if (localStorage.getItem('token') != null) {
        //     this.hideDiv = true;
        //     this.userName = localStorage.getItem('userName');
        // }
        // else {
        //     this.hideDiv = false;
        // }
    //show menu setting
    if (showMenu == "Yes") {
      document.getElementById("mySidenav").style.width = "248px";
      $(".sidenavContainer").fadeIn("slow", function () { });
    }
  }

  showAttendance() {
    this.bottomSheet.open(AttendanceComponent);
  }
  //show bottom sheet
  showBottom() {
    this.bottomSheet.open(NavComponent);
  }



  //method for show and hide manu bar with login and logout user
  showDiv() {
    this.hideDiv = true;
    // if (this.router.url != "/") {
    //   this.hideDiv = true;

    // } else {
    //   this.hideDiv = false;
    // }
    // if (localStorage.getItem('token') != null) {
    //     this.hideDiv = true;
    //     this.userName = localStorage.getItem('userName');
    // }
    // else {
    //     this.hideDiv = false;
    // }
  }

  //show bottom sheet
  // showBottom() {
  //   this.bottomSheet.open(ErpBottomSheetComponent);
  // }

  //mehtod for logout user
  Logout() {
    //this.stopWatching();
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['']);
    this.hideDiv = false;
    //this.showDiv();
  }

  public printCSS() {

    var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    var cssAddress = ".cssAddress {font-size: 16px; }";
    var cssContact = ".cssContact {font-size: 16px; }";

    var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

    var printCss = commonCss + cssHeading + cssAddress + cssContact + tableCss;

    return printCss;
  }



  // Set the width of the side navigation to 250px /
  public openNav() {

    this.activeModule("Yes");

  }

  // Set the width of the side navigation to 0 /
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";

    $(".sidenavContainer").fadeOut("slow", function () { });
  }


  //*function for checking login already logedin or not 
  checkLogin(loginChk) {

    if (localStorage.getItem('userName') != null) {


      // if (localStorage.getItem('token') != null) {
      //     this.router.navigate(['/dashboard']);
      // }

      this.logedInUserName = localStorage.getItem('userName');
      this.showDiv();
      if (loginChk == "Yes") {
        this.router.navigate(['home']);
      }

    } else {
      this.router.navigate(['']);
    }

  }

  public validateEmail(Email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(Email)) {
      return false;
    } else {
      return true;
    }
  }

} 