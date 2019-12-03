import { Component, OnInit } from "@angular/core";
import { TreeNode } from "primeng/api";
import { AppComponent } from "../../../../../../src/app/app.component";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";

@Component({
  selector: "app-companydashboard",
  templateUrl: "./companydashboard.component.html",
  styleUrls: ["./companydashboard.component.scss"]
})
export class CompanydashboardComponent implements OnInit {
  serverUrl = "http://localhost:5000/";

  cmbCompany = "";
  company = [];
  //ngprime organization chart
  data1: TreeNode[];

  constructor(private app: AppComponent, private http: HttpClient) {}

  ngOnInit() {
    this.getOrgData();
  }

  getOrgData() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getOrgChartDept", { headers: reqHeader })
      .subscribe((data: any) => {
        this.data1 = data;
      });
  }

  showOrganoGram() {}
}
