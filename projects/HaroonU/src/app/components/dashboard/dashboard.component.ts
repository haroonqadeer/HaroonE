import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { AppComponent } from 'src/app/app.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';


//*----------------------------------------------------------------------------//
//*-------------------Working of this typescript file are as follows-----------//
//*-------------------Get the list of all users -------------------------------//
//*-------------------Get the data of all event logs --------------------------//
//*-------------------Get the List of user roles ------------------------------//
//*-------------------Get the List of all user's request ----------------------//
//*-------------------Get the daily user trend  -------------------------------//
//*-------------------Get the weekly user trend -------------------------------//
//*-------------------Accepting the role request  -----------------------------//
//*-------------------Query send by user to the administrator -----------------//
//*-------------------For sorting the record-----------------------------------//
//*----------------------------------------------------------------------------//


declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  serverUrl = "http://localhost:55536/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  Line_chart: Chart;
  Pie_Chart: Chart;

  // page ngModel
  txtPassword = '';
  txtPin = '';
  txtMessage = '';
  txtdPin = '';
  txtSubject = '';
  tblSearch = '';

  //* variables for pagination and orderby pipe
  p = 1;
  order = 'info.name';
  reverse = false;
  sortedCollection: any[];
  itemPerPage = '10';

  // Data for users modal window table
  userList = [
    {
      userId: 1,
      userName: "Arham",
      userFullName: "Arham Khan",
      userEmail: "arham@gmail.com",
      userRole: "Admin"
    },
    {
      userId: 2,
      userName: "Behram",
      userFullName: "Behram Khan",
      userEmail: "behram@gmail.com",
      userRole: "Visitor"
    },
    {
      userId: 3,
      userName: "Arsal",
      userFullName: "Arsal Khan",
      userEmail: "arsal@gmail.com",
      userRole: "Admin"
    }
  ]

  // Data for event log modal window table
  eventLog = [
    {
      eId: 1,
      eAction: "Addition",
      eActionDateTime: "15-Jan-2019 2:15pm"
    },
    {
      eId: 2,
      eAction: "Edition",
      eActionDateTime: "25-Jan-2019 3:15pm"
    },
    {
      eId: 3,
      eAction: "Deletion",
      eActionDateTime: "15-Feb-2019 4:15pm"
    }
  ]

  // Data for user roles modal window table
  userRoles = [
    {
      roleId: 1,
      roleTitle: "Financial User",
      rolePermission: "Financial (10), HR (2)"
    },
    {
      roleId: 2,
      roleTitle: "Admin HR",
      rolePermission: "User (10), HR (2)"
    },
    {
      roleId: 3,
      roleTitle: "Manager Procurement",
      rolePermission: "Procurement (10), HR (2)"
    }
  ]

  // Data for user request modal window table
  userRequest = [
    {
      rId: 1,
      rSender: "Arham",
      rUserName: "Behram"
    },
    {
      rId: 2,
      rSender: "Behram",
      rUserName: "Arham"
    },
    {
      rId: 3,
      rSender: "Arsal",
      rUserName: "Sarang"
    }
  ]

  // Data for role request modal window table
  roleRequest = [
    {
      rId: 1,
      rSender: "Behram",
      rRoleName: "Financial Role"
    },
    {
      rId: 2,
      rSender: "Arsal",
      rRoleName: "HR Role"
    },
    {
      rId: 3,
      rSender: "Sarang",
      rRoleName: "Payroll"
    }
  ]

  pieData = [
    {
      chartName: "Banned User",
      Qty: 10
    },
    {
      chartName: "Active User",
      Qty: 20
    },
    {
      chartName: "InActive User",
      Qty: 6
    },
    {
      chartName: "Web User",
      Qty: 5
    },
    {
      chartName: "Mobile User",
      Qty: 9
    }];

  lineData = [
    {
      chartName: "Banned User",
      Qty: [10, 12, 23]
    },
    {
      chartName: "Active User",
      Qty: [8, 15, 10]
    },
    {
      chartName: "InActive User",
      Qty: [2, 8, 6]
    },
    {
      chartName: "Web User",
      Qty: [20, 16, 25]
    },
    {
      chartName: "Mobile User",
      Qty: [4, 17, 20]
    }];

  constructor(public toastr: ToastrManager,
    private appComponent: AppComponent,
    private http: HttpClient) { }

  ngOnInit() {

    this.appComponent.showDiv();
    this.LineChart_init();
    this.PieChart_init();

    // this.userService.getLocation().subscribe(data =>{
    //   this.cityDetail = data['m_Item1'];
    // });

    // this.userService.getLocation().subscribe(data =>{
    //   this.countryDetail = data['m_Item2'];
    // });
  }


  //Get the list of all users.
  getUserList() {
    return false;

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/usersDetail', { headers: reqHeader }).subscribe((data: any) => {
      this.userList = data
    });
  }


  //Get the data of all event logs.
  getEventLog() {
    return false;

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/usersDetail', { headers: reqHeader }).subscribe((data: any) => {
      this.eventLog = data
    });
  }


  //Get the List of user roles.
  getUserRoles() {
    return false;

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/usersDetail', { headers: reqHeader }).subscribe((data: any) => {
      this.userRoles = data
    });
  }


  //Get the List of all user's request.
  getUserRequest() {
    return false;

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/usersDetail', { headers: reqHeader }).subscribe((data: any) => {
      this.userRequest = data
    });
  }


  //Get the List of all role's request.
  getRoleRequest() {
    return false;

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/usersDetail', { headers: reqHeader }).subscribe((data: any) => {
      this.roleRequest = data
    });
  }


  //Get the daily user trend 
  PieChart_init() {

    var mySeries = [];
    for (var i = 0; i < this.pieData.length; i++) {
      mySeries.push([this.pieData[i].chartName, this.pieData[i].Qty]);
    }

    // var Token = localStorage.getItem(this.tokenKey);

    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    // this.http.get(this.serverUrl + 'api/usersPieChart', { headers: reqHeader }).subscribe((data: any) => {

    //   var mySeries = [];
    //   for (var i = 0; i < this.data.length; i++) {
    //     mySeries.push([this.data[i].chartName, this.data[i].Qty]);
    //   }

    //   let chart = new Chart({
    //     chart: {
    //       type: 'pie'
    //     },
    //     title: {
    //       text: 'Users pie chart'
    //     },
    //     credits: {
    //       enabled: false
    //     },
    //     plotOptions: {
    //       pie: {
    //         showInLegend: true
    //       }
    //     },
    //     series: [{
    //       name: 'Users',
    //       data: mySeries
    //     }]
    //   });
    //   this.Pie_Chart = chart;
    // });

    let chart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Users pie chart'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          showInLegend: true
        }
      },
      series: [{
        name: 'Users',
        data: mySeries
      }]
    });
    this.Pie_Chart = chart;
  }


  //Get the weekly user trend
  LineChart_init() {

    // var mySeries = [];

    // for (var i = 0; i < this.lineData.length; i++) {

    //   mySeries.push([this.lineData[i].chartName, [this.lineData[i].Qty]]);

    // }
    // alert(mySeries)
    //let chart;

    for (var i = 0; i < this.lineData.length; i++) {
      //alert(this.lineData[i].chartName)
      let chart = new Chart({
        chart: {
          type: 'line'
        },
        title: {
          text: 'User trend for last week'
        },
        credits: {
          enabled: false
        },
        series:
          [{
            name: this.lineData[i].chartName,
            data: this.lineData[i].Qty
          }]
      });

      this.Line_chart = chart;
    }

    //this.Line_chart = chart;
  }


  // accepting the role request 
  acceptData() {

    //checking if password is empty
    if (this.txtPassword.trim().length == 0) {

      this.toastr.errorToastr('Please Enter Password', 'Oops!', { toastTimeout: (2500) });
      return;
    }
    else if (this.txtPin.trim().length == 0) {

      this.toastr.errorToastr('Please Enter Pin', 'Oops!', { toastTimeout: (2500) });
      return;
    }

    this.appComponent.showSpinner();
    this.appComponent.hideSpinner();

    this.toastr.successToastr('Message Send Successfully!', 'Success', { toastTimeout: (2500) });

    $('#reqAcceptModal').modal('hide');

    this.clear();
    return;

    // var Token = localStorage.getItem(this.tokenKey);

    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    // var reqData = { pasword: this.txtPassword, pin: this.txtPin };

    // this.http.get(this.serverUrl + 'api/acceptReq', reqData, { headers: reqHeader }).subscribe((data: any) => {
    //   this.roleRequest = data
    // });

  }


  // query send by user to the administrator
  send() {

    //checking if password is empty
    if (this.txtSubject.trim().length == 0) {

      this.toastr.errorToastr('Please Enter Subject', 'Oops!', { toastTimeout: (2500) });
      return;
    }
    else if (this.txtMessage.trim().length == 0) {

      this.toastr.errorToastr('Please Enter Message', 'Oops!', { toastTimeout: (2500) });
      return;
    }
    else if (this.txtdPin.trim().length == 0) {

      this.toastr.errorToastr('Please Enter Pin', 'Oops!', { toastTimeout: (2500) });
      return;
    }

    this.appComponent.showSpinner();
    this.appComponent.hideSpinner();

    this.toastr.successToastr('Message Send Successfully!', 'Success', { toastTimeout: (2500) });

    $('#msgModal').modal('hide');

    this.clear();

  }


  //
  pie_data() {

  }


  // clear the fields
  clear() {

    this.txtPassword = "";
    this.txtPin = "";
    this.txtMessage = "";
    this.txtdPin = "";
    this.txtSubject = "";
  }


  //*function for sort table data 
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
}


