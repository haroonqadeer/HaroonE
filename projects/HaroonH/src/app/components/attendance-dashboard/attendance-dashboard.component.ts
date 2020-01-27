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
  //serverUrl = "http://localhost:9031/";
  serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9031/";

  //* Variables Declaration for chart
  Area_chart: Chart;
  Column_Chart: Chart;
  Pie_Chart: Chart;

  lblPresentEmp = 0;
  lblAbsentEmp = 0;
  lblTotalEmp = 0;
  lblLateComers = 0;

  shiftList = [];

  constructor(private http: HttpClient, private app: AppComponent) {}

  ngOnInit() {
    // this.ColumnChart_init();
    // this.PieChart_init();
    // this.getShift();
    // this.getEmpAttendance();
    this.AreaChart_init();
  }

  //Get the weekly user trend
  AreaChart_init() {
    let chart = new Chart({
      chart: {
        type: "areaspline"
      },
      title: {
        text: "Employee attendance for last week"
      },
      xAxis: {
        categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
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
          data: [2, 5, 3, 9, 4]
        },
        {
          name: "Remote",
          data: [8, 1, 5, 3, 7]
        },
        {
          name: "On Leave",
          data: [1, 4, 5, 7, 2]
        },
        {
          name: "Absent",
          data: [6, 0, 2, 8, 3]
        }
      ]
    });

    this.Area_chart = chart;
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
      .get(this.serverUrl + "api/getAbsentEmployee", { headers: reqHeader })
      .subscribe((data: any) => {
        this.lblAbsentEmp = data[0].empAttendance;

        this.app.hideSpinner();
      });

    this.http
      .get(this.serverUrl + "api/getPresentEmployee", { headers: reqHeader })
      .subscribe((data: any) => {
        this.lblPresentEmp = data[0].empAttendance;

        this.app.hideSpinner();
      });

    this.http
      .get(this.serverUrl + "api/getTotalEmployee", { headers: reqHeader })
      .subscribe((data: any) => {
        this.lblTotalEmp = data[0].empAttendance;

        this.app.hideSpinner();
      });

    this.http
      .get(this.serverUrl + "api/getLateEmployee", { headers: reqHeader })
      .subscribe((data: any) => {
        this.lblLateComers = data[0].empAttendance;

        this.app.hideSpinner();
      });
  }

  getShift() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getShift", { headers: reqHeader })
      .subscribe((data: any) => {
        this.shiftList = data;

        this.app.hideSpinner();
      });
  }
}
