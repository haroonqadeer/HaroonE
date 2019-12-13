import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { TreeNode } from "primeng/api";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";

import {
  IgxExcelExporterOptions,
  IgxExcelExporterService,
  IgxGridComponent,
  IgxCsvExporterService,
  IgxCsvExporterOptions,
  CsvFileTypes
} from "igniteui-angular";

import { AppComponent } from "src/app/app.component";

declare var $: any;

@Component({
  selector: "app-communication",
  templateUrl: "./communication.component.html",
  styleUrls: ["./communication.component.scss"],

  encapsulation: ViewEncapsulation.None
})
export class CommunicationComponent implements OnInit {
  //serverUrl = "http://localhost:9013/";
  serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9013/";
  // serverUrl = "http://52.163.189.189:9013/";

  tblSearch = "";

  document = [];

  //* variables for pagination and orderby pipe
  p = 1;
  //pGroup = 1;
  order = "info.name";
  reverse = false;
  // orderGroup = 'info.name';
  // reverseGroup = false;
  sortedCollection: any[];
  itemPerPage = "10";
  //itemPerPageGroup = '5';

  constructor(
    public toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  //function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
}
