import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';


@Component({
  selector: 'app-trainingemployee',
  templateUrl: './trainingemployee.component.html',
  styleUrls: ['./trainingemployee.component.scss']
})
export class TrainingemployeeComponent implements OnInit {

  serverUrl = "https://localhost:8004/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  tblSearch = '';


  chkEmpBox = false;
  status = 'Pending';

  //* variables for pagination and orderby pipe
  p = 1;
  pType = 1;
  order = 'info.name';
  reverse = false;
  // orderGroup = 'info.name';
  // reverseGroup = false;
  sortedCollection: any[];
  itemPerPage = '10';
  itemPerPageType = '5';

  empJobTrainingList: [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEmployeeJobTraining();
  }

  // get training requirements list
  getEmployeeJobTraining() {
    //return false;
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getEmployeeJobTraining', { headers: reqHeader }).subscribe((data: any) => {
      this.empJobTrainingList = data
    });
  }

  clear() { }

  //function for sorting/orderBy table data 
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  printDiv() { }
  downloadPDF() { }
  downloadCSV() { }
  downloadExcel() { }

}
