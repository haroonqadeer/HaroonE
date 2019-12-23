import { Component, OnInit } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Chart } from "angular-highcharts";
import { AppComponent } from "src/app/app.component";
import * as Highcharts from "highcharts";
import * as Variablepie from "highcharts/modules/variable-pie";

// initialize the module
Variablepie(Highcharts);

@Component({
  selector: "app-hrdashboard",
  templateUrl: "./hrdashboard.component.html",
  styleUrls: ["./hrdashboard.component.scss"]
})
export class HrdashboardComponent implements OnInit {
  //serverUrl = "http://localhost:9030/";
  // serverUrl = "http://52.163.189.189:9030/";
  serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9030/";

  Column_Chart: Chart;
  Off_Column_Chart: Chart;
  Dept_Column_Chart: Chart;
  Type_Bar_Chart: Chart;
  Gender_Bar_Chart: Chart;
  Vacancy_Bar_Chart: Chart;

  StackColumn_Chart: Chart;
  Variablepie_Chart: Chart;

  lblPermanent = 0;
  lblContractual = 0;
  lblEmployees = 0;
  lblJobProfile = 0;

  constructor(private app: AppComponent, private http: HttpClient) {}

  ngOnInit() {
    this.VariablePie_init();
    this.StackColumn_init();
    this.ColumnChart_init();
    // this.OffColumnChart_init();
    // this.DeptColumnChart_init();
    // this.TypeBarChart_init();
    // this.GenderBarChart_init();
    // this.VacBarChart_init();
    // this.getEmpAttendance();
  }

  VariablePie_init() {
    let chart = new Chart({
      chart: {
        type: "variablepie"
      },
      title: {
        text: "Number of contractual and permanent employees by branch",
        style: {
          fontSize: "15px",
          fontWeight: "bold"
        }
      },
      tooltip: {
        headerFormat: "",
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
          "Area (square km): <b>{point.y}</b><br/>" +
          "Population density (people per square km): <b>{point.z}</b><br/>"
      },
      series: [
        {
          innerSize: "20%",
          name: "branches",
          data: [
            {
              name: "Islamabad",
              y: 505370,
              z: 92.9
            },
            {
              name: "Head Office",
              y: 551500,
              z: 118.7
            },
            {
              name: "Regional",
              y: 312685,
              z: 124.6
            },
            {
              name: "Karachi",
              y: 78867,
              z: 137.5
            },
            {
              name: "Lahore",
              y: 301340,
              z: 201.8
            },
            {
              name: "Customer Support",
              y: 41277,
              z: 214.5
            }
          ]
        }
      ]
    });

    this.Variablepie_Chart = chart;
  }

  StackColumn_init() {
    let chart = new Chart({
      chart: {
        type: "column"
      },
      title: {
        text: "Number of employees by department and branch"
      },
      xAxis: {
        categories: [
          "BPO-Karachi",
          "Support-Lahore",
          "Sales-Islamabad",
          "Head office-ISB",
          "Regional-Karahi"
        ]
      },
      yAxis: {
        min: 0,
        title: {
          text: "Number of Employees"
        }
      },
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        column: {
          stacking: "percent"
        }
      },
      series: [
        {
          name: "Finance",
          data: [5, 3, 4, 7, 2]
        },
        {
          name: "IT",
          data: [2, 2, 3, 2, 1]
        },
        {
          name: "Customer Support",
          data: [3, 4, 4, 2, 5]
        },
        {
          name: "Admin",
          data: [3, 4, 4, 2, 5]
        }
      ]
    });

    this.StackColumn_Chart = chart;
  }

  getEmpAttendance() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getEmployee", { headers: reqHeader })
      .subscribe((data: any) => {
        this.lblEmployees = data[0].qty;

        this.app.hideSpinner();
      });

    this.http
      .get(this.serverUrl + "api/getPermanent", { headers: reqHeader })
      .subscribe((data: any) => {
        this.lblPermanent = data[0].qty;

        this.app.hideSpinner();
      });

    this.http
      .get(this.serverUrl + "api/getContractual", { headers: reqHeader })
      .subscribe((data: any) => {
        this.lblContractual = data[0].qty;

        this.app.hideSpinner();
      });

    this.http
      .get(this.serverUrl + "api/getJobProfile", { headers: reqHeader })
      .subscribe((data: any) => {
        this.lblJobProfile = data[0].qty;

        this.app.hideSpinner();
      });
  }

  ColumnChart_init() {
    let chart = new Chart({
      chart: {
        type: "column"
      },
      title: {
        text: "Number of employees in a department by payscale"
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
          text: "Number of Employees"
        }
      },
      xAxis: {
        categories: [
          "10000",
          "20000",
          "30000",
          "40000",
          "50000",
          "60000",
          "70000",
          "80000",
          "90000",
          "100000",
          "110000",
          "120000",
          "130000",
          "140000",
          "150000"
        ]
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: "Finance",
          data: [
            49.9,
            71.5,
            106.4,
            129.2,
            144.0,
            176.0,
            135.6,
            148.5,
            216.4,
            194.1,
            95.6,
            54.4
          ]
        },
        {
          name: "Admin",
          data: [
            83.6,
            78.8,
            98.5,
            93.4,
            106.0,
            84.5,
            105.0,
            104.3,
            91.2,
            83.5,
            106.6,
            92.3
          ]
        },
        {
          name: "IT",
          data: [
            48.9,
            38.8,
            39.3,
            41.4,
            47.0,
            48.3,
            59.0,
            59.6,
            52.4,
            65.2,
            59.3,
            51.2
          ]
        },
        {
          name: "Customer Support",
          data: [
            42.4,
            33.2,
            34.5,
            39.7,
            52.6,
            75.5,
            57.4,
            60.4,
            47.6,
            39.1,
            46.8,
            51.1
          ]
        }
      ]
    });
    this.Column_Chart = chart;
  }

  OffColumnChart_init() {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getEmployeeLocation", { headers: reqHeader })
      .subscribe((data: any) => {
        var mySeries = [];
        var myCategory = [];
        for (var i = 0; i < data.length; i++) {
          myCategory.push([data[i].empType]);
          mySeries.push([data[i].qty]);
        }

        let chart = new Chart({
          chart: {
            type: "column"
          },
          colors: ["#ff9800"],
          title: {
            text: "Offices"
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
              text: "Amount"
            }
          },
          xAxis: {
            categories: myCategory
          },
          credits: {
            enabled: false
          },
          series: [
            {
              name: "Quantity",
              data: mySeries
            }
          ]
        });
        this.Off_Column_Chart = chart;
      });
  }

  DeptColumnChart_init() {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getEmployeeDepartment", { headers: reqHeader })
      .subscribe((data: any) => {
        var mySeries = [];
        var myCategory = [];
        for (var i = 0; i < data.length; i++) {
          myCategory.push([data[i].empType]);
          mySeries.push([data[i].qty]);
        }

        let chart = new Chart({
          chart: {
            type: "column"
          },
          colors: ["#3f51b5"],
          title: {
            text: "Department"
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
              text: "Amount"
            }
          },
          xAxis: {
            categories: myCategory
          },
          credits: {
            enabled: false
          },
          series: [
            {
              name: "Quantity",
              data: mySeries
            }
          ]
        });
        this.Dept_Column_Chart = chart;
      });
  }

  TypeBarChart_init() {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getEmployeeType", { headers: reqHeader })
      .subscribe((data: any) => {
        var mySeries = [];
        for (var i = 0; i < data.length; i++) {
          mySeries.push({ name: data[i].empType, data: [data[i].qty] });
        }

        let chart = new Chart({
          chart: {
            type: "bar"
          },
          colors: ["#ff9800", "#00bcd4", "#3f51b5", "#ef0000"],
          title: {
            text: "Type"
          },
          legend: {
            reversed: true,
            itemStyle: {
              fontSize: "15px",
              fontWeight: "static"
            }
          },
          plotOptions: {
            series: {
              stacking: "normal"
            }
          },
          credits: {
            enabled: false
          },
          series: mySeries
        });

        this.Type_Bar_Chart = chart;
      });
  }

  GenderBarChart_init() {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getEmployeeGender", { headers: reqHeader })
      .subscribe((data: any) => {
        var mySeries = [];
        for (var i = 0; i < data.length; i++) {
          mySeries.push({ name: data[i].empType, data: [data[i].qty] });
        }

        let chart = new Chart({
          chart: {
            type: "bar"
          },
          colors: ["#b73377", "#2da9d9"],
          title: {
            text: "Gender"
          },
          legend: {
            reversed: true,
            itemStyle: {
              fontSize: "15px",
              fontWeight: "static"
            }
          },
          plotOptions: {
            series: {
              stacking: "normal"
            }
          },
          credits: {
            enabled: false
          },
          series: mySeries
        });
        this.Gender_Bar_Chart = chart;
      });
  }

  VacBarChart_init() {
    let chart = new Chart({
      chart: {
        type: "bar"
      },
      title: {
        text: "Vacancy"
      },
      legend: {
        reversed: true,
        itemStyle: {
          fontSize: "15px",
          fontWeight: "static"
        }
      },
      plotOptions: {
        series: {
          stacking: "normal"
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: "Filled",
          data: [20]
        },
        {
          name: "Vacancy",
          data: [8]
        }
      ]
    });
    this.Vacancy_Bar_Chart = chart;
  }
}
