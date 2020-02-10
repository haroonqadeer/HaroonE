import { Component, OnInit } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Chart } from "angular-highcharts";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-attendance-dashboard",
  templateUrl: "./attendance-dashboard.component.html",
  styleUrls: ["./attendance-dashboard.component.scss"]
})
export class AttendanceDashboardComponent implements OnInit {
  serverUrl = "http://localhost:3010/";
  // serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9031/";

  //* Variables Declaration for chart
  Area_chart: Chart;
  Column_Chart: Chart;
  Pie_Chart: Chart;

  curDate = "";
  lblDayName = "";
  lblPresentEmp = 0;
  lblAbsentEmp = 0;
  lblremoteEmp = 0;
  lblLateComers = 0;

  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  recentEmpEntry = [];

  evenHolidays = [];
  oddHolidays = [];

  constructor(private http: HttpClient, private app: AppComponent) {}

  ngOnInit() {
    // this.ColumnChart_init();
    // this.PieChart_init();
    this.getRecentEntries();
    this.getEmpAttendance();
    this.AreaChart_init();

    var date = new Date();
    this.lblDayName = this.days[date.getDay()];

    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();

    this.curDate = d + "/" + m + "/" + y;
  }

  //Get the weekly user trend
  AreaChart_init() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    var lblWeek = [];
    var lblOffice = [];
    var lblRemote = [];
    var lblLeave = [];
    var lblAbsent = [];

    this.http
      .get(this.serverUrl + "api/getWeeklyEmpAttendance", {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          lblWeek.push(data[i].dyName);
          lblOffice.push(data[i].inOffice);
          lblRemote.push(data[i].remote);
          lblLeave.push(data[i].onLeave);
          lblAbsent.push(data[i].absent);
        }

        let chart = new Chart({
          chart: {
            type: "areaspline"
          },
          title: {
            text: "Employee attendance for last week"
          },
          xAxis: {
            categories: lblWeek
          },
          yAxis: {
            title: {
              text: "Number of Employees"
            }
          },
          credits: {
            enabled: false
          },
          series: [
            {
              name: "In Office",
              data: lblOffice
            },
            {
              name: "Remote",
              data: lblRemote
            },
            {
              name: "On Leave",
              data: lblLeave
            },
            {
              name: "Absent",
              data: lblAbsent
            }
          ]
        });

        this.Area_chart = chart;

        this.app.hideSpinner();
      });
  }

  //Get the daily user trend
  PieChart_init() {
    this.app.showSpinner();

    // var Token = localStorage.getItem(this.tokenKey);

    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getWeeklyAbsentEmployee", {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        var mySeries = [];
        for (var i = 0; i < data.length; i++) {
          mySeries.push([data[i].dyName, data[i].qty]);
        }

        let chart = new Chart({
          chart: {
            type: "pie"
          },
          title: {
            text: "Absent Last 7 Days"
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            pie: {
              showInLegend: true
            }
          },
          series: [
            {
              name: "Employees",
              data: mySeries
            }
          ]
        });
        this.Pie_Chart = chart;
        this.app.hideSpinner();
      });
  }

  ColumnChart_init() {
    this.app.showSpinner();

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getWeeklyLateEmployee", { headers: reqHeader })
      .subscribe((data: any) => {
        var mySeries = [];
        var myCategory = [];
        for (var i = 0; i < data.length; i++) {
          myCategory.push([data[i].dyName]);
          mySeries.push([data[i].qty]);
        }

        let chart = new Chart({
          chart: {
            type: "column"
          },
          title: {
            text: "Late Comers Last 7 Days"
          },
          legend: {
            reversed: true,
            itemStyle: {
              fontSize: "15px",
              fontWeight: "static"
            }
          },
          yAxis: {
            title: {
              text: "No. of Employees"
            }
          },
          xAxis: {
            categories: myCategory //['Saturday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          },
          credits: {
            enabled: false
          },
          series: [
            {
              name: "Employees",
              data: mySeries //[5, 3, 4, 7, 2, 5]
            }
          ]
        });

        this.Column_Chart = chart;

        this.app.hideSpinner();
      });
  }

  getEmpAttendance() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getHolidays", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          if (i % 2 == 0) {
            var e0found = false;
            var o0found = false;
            for (var j = 0; j < this.evenHolidays.length; j++) {
              if (this.evenHolidays[j].holidayName == data[i].holidayName)
                e0found = true;
            }
            for (var j = 0; j < this.oddHolidays.length; j++) {
              if (this.oddHolidays[j].holidayName == data[i].holidayName)
                o0found = true;
            }
            if (e0found == false && o0found == false) {
              this.evenHolidays.push({
                dyofMon: data[i].dyofMon,
                yr: data[i].yr,
                month: data[i].month,
                dyName: data[i].dyName,
                holidayName: data[i].holidayName
              });
            }
          } else if (i % 2 != 0) {
            var e1found = false;
            var o1found = false;
            for (var j = 0; j < this.evenHolidays.length; j++) {
              if (this.evenHolidays[j].holidayName == data[i].holidayName)
                e1found = true;
            }
            for (var j = 0; j < this.oddHolidays.length; j++) {
              if (this.oddHolidays[j].holidayName == data[i].holidayName)
                o1found = true;
            }
            if (e1found == false && o1found == false) {
              this.oddHolidays.push({
                dyofMon: data[i].dyofMon,
                yr: data[i].yr,
                month: data[i].month,
                dyName: data[i].dyName,
                holidayName: data[i].holidayName
              });
            }
          }
        }

        this.app.hideSpinner();
      });

    this.http
      .get(this.serverUrl + "api/getAbsentEmployee", { headers: reqHeader })
      .subscribe((data: any) => {
        this.lblAbsentEmp = data[0].empAttendance;

        this.app.hideSpinner();
      });

    this.http
      .get(this.serverUrl + "api/getEmployeeInOffice", { headers: reqHeader })
      .subscribe((data: any) => {
        this.lblPresentEmp = data[0].empAttendance;

        this.app.hideSpinner();
      });

    this.http
      .get(this.serverUrl + "api/getEmployeeOnRemote", { headers: reqHeader })
      .subscribe((data: any) => {
        this.lblremoteEmp = data[0].empAttendance;

        this.app.hideSpinner();
      });
  }

  getRecentEntries() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getRecentEntries", { headers: reqHeader })
      .subscribe((data: any) => {
        var newDate = 0;
        var oldDate = 0;
        var dif = 0;
        var diff = 0;

        for (var i = 0; i < data.length; i++) {
          newDate = 0;
          oldDate = 0;
          dif = 0;
          diff = 0;

          newDate = new Date().getTime();
          oldDate = new Date(data[i].timeIn).getTime();
          dif = (newDate - oldDate) / 1000;
          dif /= 60;
          diff = Math.abs(Math.round(dif));

          // alert(diff);
          this.recentEmpEntry.push({
            empName: data[i].indvdlFirstName,
            curTime: data[i].currentTime,
            noOfMin: diff
          });
        }
        this.app.hideSpinner();
      });
  }
}
