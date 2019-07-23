import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Chart } from 'angular-highcharts';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-hrdashboard',
  templateUrl: './hrdashboard.component.html',
  styleUrls: ['./hrdashboard.component.scss']
})
export class HrdashboardComponent implements OnInit {
  
  //serverUrl = "http://localhost:9030/";
  serverUrl = "http://52.163.189.189:9030/";
  
  Column_Chart: Chart;
  Off_Column_Chart: Chart;
  Dept_Column_Chart: Chart;
  Type_Bar_Chart: Chart;
  Gender_Bar_Chart: Chart;
  Vacancy_Bar_Chart: Chart;

  lblPermanent = 0;
  lblContractual = 0;
  lblEmployees = 0;
  lblJobProfile = 0;

  constructor(
    private app: AppComponent,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.ColumnChart_init();
    this.OffColumnChart_init();
    this.DeptColumnChart_init();
    this.TypeBarChart_init();
    this.GenderBarChart_init();
    this.VacBarChart_init();
    this.getEmpAttendance();

  }

  getEmpAttendance() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getEmployee', { headers: reqHeader }).subscribe((data: any) => {
        
        this.lblEmployees = data[0].qty;
  
        this.app.hideSpinner();

    });

    this.http.get(this.serverUrl + 'api/getPermanent', { headers: reqHeader }).subscribe((data: any) => {
        
      this.lblPermanent = data[0].qty;
      
      this.app.hideSpinner();

    });

    this.http.get(this.serverUrl + 'api/getContractual', { headers: reqHeader }).subscribe((data: any) => {
        
      this.lblContractual = data[0].qty;
      
      this.app.hideSpinner();

    });
    
    this.http.get(this.serverUrl + 'api/getJobProfile', { headers: reqHeader }).subscribe((data: any) => {
        
      this.lblJobProfile = data[0].qty;
      
      this.app.hideSpinner();

    });
  }

  ColumnChart_init() {
    let chart = new Chart({
      chart: {
        type: 'column'
      },
      colors: [
        '#8bc34a'
      ],
      title: {
        text: 'Active Employee'
      },
      legend: {
        reversed: true,
        itemStyle: {
          fontSize:'15px',
          fontWeight: 'static'
        }
      },
      yAxis: {
        title: {
            text: 'No. of Employees'
        }
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Employees',
        data: [5, 3, 4, 7, 2, 5, 3, 7, 9, 6, 1, 7]
      }]
    });
    this.Column_Chart = chart;
  }

  OffColumnChart_init() {

    
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getEmployeeLocation', { headers: reqHeader }).subscribe((data: any) => {

      var mySeries = [];
      var myCategory = [];
      for (var i = 0; i < data.length; i++) {
        myCategory.push([data[i].empType])
        mySeries.push([data[i].qty])
      }

    let chart = new Chart({
      chart: {
        type: 'column'
      },
      colors:[
        '#ff9800'
      ],
      title: {
        text: 'Offices'
      },
      legend: {
        reversed: true,
        itemStyle: {
          fontSize:'15px',
          fontWeight: 'static'
        }
      },
      yAxis: {
        title: {
            text: 'Amount'
        }
      },
      xAxis: {
        categories: myCategory
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Quantity',
        data: mySeries
      }]
    });
    this.Off_Column_Chart = chart;
  });
}

  DeptColumnChart_init() {
    
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getEmployeeDepartment', { headers: reqHeader }).subscribe((data: any) => {

      var mySeries = [];
      var myCategory = [];
      for (var i = 0; i < data.length; i++) {
        myCategory.push([data[i].empType])
        mySeries.push([data[i].qty])
      }

    let chart = new Chart({
      chart: {
        type: 'column'
      },
      colors:[
        '#3f51b5'
      ],
      title: {
        text: 'Department'
      },
      legend: {
        reversed: true,
        itemStyle: {
          fontSize:'15px',
          fontWeight: 'static'
        }
      },
      yAxis: {
        title: {
            text: 'Amount'
        }
      },
      xAxis: {
        categories: myCategory
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Quantity',
        data: mySeries
      }]
    });
    this.Dept_Column_Chart = chart;
  });
}

  TypeBarChart_init() {
    
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getEmployeeType', { headers: reqHeader }).subscribe((data: any) => {

      var mySeries = [];
      for (var i = 0; i < data.length; i++) {
        mySeries.push({name: data[i].empType, data: [data[i].qty]})
      }

      let chart = new Chart({
        chart: {
          type: 'bar'
        },
        colors:[
          '#ff9800','#00bcd4','#3f51b5','#ef0000'
        ],
        title: {
          text: 'Type'
        },
        legend: {
          reversed: true,
          itemStyle: {
            fontSize:'15px',
            fontWeight: 'static'
          }
        },
        plotOptions: {
          series: {
            stacking: 'normal'
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
    
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getEmployeeGender', { headers: reqHeader }).subscribe((data: any) => {

      var mySeries = [];
      for (var i = 0; i < data.length; i++) {
        mySeries.push({name: data[i].empType, data: [data[i].qty]})
      }

    let chart = new Chart({
      chart: {
        type: 'bar'
      },
      colors:['#b73377', '#2da9d9'],
      title: {
        text: 'Gender'
      },
      legend: {
        reversed: true,
        itemStyle: {
          fontSize:'15px',
          fontWeight: 'static'
        }
      },
      plotOptions: {
        series: {
          stacking: 'normal'
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
        type: 'bar'
      },
      title: {
        text: 'Vacancy'
      },
      legend: {
        reversed: true,
        itemStyle: {
          fontSize:'15px',
          fontWeight: 'static'
        }
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Filled',
        data: [20]
      },
      {
        name: 'Vacancy',
        data: [8]
      }]
    });
    this.Vacancy_Bar_Chart = chart;
  }
}
