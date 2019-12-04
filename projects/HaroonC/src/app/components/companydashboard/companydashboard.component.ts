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

  public orgList = [];
  public compChild = [];
  public branchChild = [];
  public deptChild = [];

  public orgData = [];

  constructor(private app: AppComponent, private http: HttpClient) {}

  ngOnInit() {
    this.getCompany();
  }

  getCompany() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCompany", { headers: reqHeader })
      .subscribe((data: any) => {
        this.company = data;
      });
  }

  //getting organizational chart Data
  getChartData(item) {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getOrgData?cmpnyID=" + item, {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        this.orgData = data;

        for (var i = 0; i < this.orgData.length; i++) {
          if (this.orgData[i].companyName != null) {
            for (var j = 0; j < this.orgData.length; j++) {
              if (
                this.orgData[j].branchName != null &&
                this.orgData[j].deptName == null
              ) {
                this.branchChild = [];

                for (var k = 0; k < this.orgData.length; k++) {
                  if (
                    this.orgData[k].deptLevelNo == 1 &&
                    this.orgData[j].branchId == this.orgData[k].branchId
                  ) {
                    this.deptChild = [];

                    for (var l = 0; l < this.orgData.length; l++) {
                      if (
                        this.orgData[l].deptLevelNo == 2 &&
                        this.orgData[l].parentDeptId == this.orgData[k].deptId
                      ) {
                        this.deptChild.push({
                          label: this.orgData[l].deptName,
                          styleClass: "department-cfo"
                        });
                      }
                    }
                    this.branchChild.push({
                      label: this.orgData[k].deptName,
                      styleClass: "department-cto",
                      children: this.deptChild
                    });
                  }
                }
                this.compChild.push({
                  label: this.orgData[j].branchName,
                  styleClass: "ui-person",
                  type: "person",
                  expanded: true,
                  data: { name: "" },
                  children: this.branchChild
                });
              }
            }
          }

          this.orgList.push({
            label: this.orgData[i].companyName,
            styleClass: "ui-person",
            type: "person",
            expanded: true,
            data: { name: "" },
            children: this.compChild
          });
          i = this.orgData.length + 1;
        }
        this.data1 = this.orgList;
      });
  }
}
