import {
  Component,
  ViewChild,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
  Output
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpHeaders,
  HttpClient,
  HttpEventType,
  HttpRequest
} from "@angular/common/http";

import { AppComponent } from "src/app/app.component";

declare var $: any;

@Component({
  selector: "app-communication",
  templateUrl: "./communication.component.html",
  styleUrls: ["./communication.component.scss"],

  encapsulation: ViewEncapsulation.None
})
export class CommunicationComponent implements OnInit {
  // serverUrl = "http://localhost:9050/";
  serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9045/";
  filePath =
    "I:/VU Projects/Visual_Code_Proj/ERP_Module/HaroonE/src/assets/images/OrgDocuments";

  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  //* variables for pagination and orderby pipe
  p = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  //* Variables for NgModels
  tblSearch = "";
  documentTitle;

  documentList = [];

  selectedFile: File = null;
  file;
  docFile;

  constructor(
    public toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getDocument();
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let reader = new FileReader();

    reader.onloadend = e => {
      this.file = reader.result;

      var splitFile = this.file.split(",")[1];
      this.file = splitFile;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  getDocument() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getDocument", { headers: reqHeader })
      .subscribe((data: any) => {
        this.documentList = data;

        this.app.hideSpinner();
      });
  }

  clear() {
    this.documentTitle = "";
    this.docFile = "";
    this.docFile = undefined;
    this.file = undefined;
    this.selectedFile = null;
    this.app.pin = "";
  }

  //Function for save document
  save() {
    if (this.documentTitle == undefined || this.documentTitle.trim() == "") {
      this.toastr.errorToastr("Please enter document title", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.docFile == undefined) {
      this.toastr.errorToastr("Please select document", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      var filePath = null;
      if (this.file != undefined) {
        filePath = this.filePath;
      }

      var fileNameExt = this.docFile.substr(this.docFile.lastIndexOf(".") + 1);

      this.app.showSpinner();
      //* ********************************************save data
      var saveData = {
        DocID: 0,
        DocName: this.documentTitle.trim(),
        DocExtension: fileNameExt,
        file: this.file,
        DocURL: filePath,
        ConnectedUser: "12000",
        DelFlag: 0
      };

      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/uploadDocument", saveData, {
          headers: reqHeader
        })
        .subscribe((data: any) => {
          if (data.msg == "Record Saved Successfully!") {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500
            });
            this.clear();
            this.getDocument();
            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          }
        });
    }
  }

  delete(item) {
    if (this.app.pin != "") {
      this.app.showSpinner();
      //* ********************************************save data
      var delData = {
        DocID: item.docID,
        ConnectedUser: "12000",
        DelFlag: 1
      };

      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/uploadDocument", delData, {
          headers: reqHeader
        })
        .subscribe((data: any) => {
          if (data.msg == "Record Deleted Successfully!") {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500
            });
            this.clear();
            this.getDocument();
            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          }
        });
    } else {
      this.app.genPin();
    }
  }

  //function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
}
