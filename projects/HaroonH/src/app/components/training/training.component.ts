import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

import { AppComponent } from '../../app.component';

import {
  IgxExcelExporterOptions,
  IgxExcelExporterService,
  IgxGridComponent,
  IgxCsvExporterService,
  IgxCsvExporterOptions,
  CsvFileTypes
} from "igniteui-angular";
import { HttpHeaders, HttpClient } from '@angular/common/http';

declare var $: any;


@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {

  serverUrl = "http://localhost:9019/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }


  tblSearch = '';
  tblSearchType = '';

  //Ng-Models for Add Training Model
  trainingId = ''; // for update/delete
  trainingType = '';
  trainingName = '';
  trainingDesc = '';
  trainingInstitute = '';
  trainingInstituteList = []; // vendor's list
  trainingDuration = '';
  trainingList = [];
  dTrainingId = '';

  //trainingList = [];

  // Ng-Models for Training Type Modal Window
  trainingTypeId = ''; // for update
  trainingTypeName = '';
  trainingTypeDesc = '';
  trainingTypeList = [];
  dTrainingTypeId = ''; // for delete purpose


  //Ng-models for delete modal window
  userPassword = '';
  userPINCode = '';

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


  constructor(public toastr: ToastrManager,
    private app: AppComponent,
    private excelExportService: IgxExcelExporterService,
    private csvExportService: IgxCsvExporterService,
    private http: HttpClient) { }

  ngOnInit() {
    this.getTraining();
    this.getTrainingType();
    this.getTrainingInstitute();
  }

  //*---------------------- Get Functions --------------------//

  // get training list
  getTraining() {
    //return false;
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getTraining', { headers: reqHeader }).subscribe((data: any) => {
      this.trainingList = data
    });
  }


  // get training type list
  getTrainingType() {

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getTrainingType', { headers: reqHeader }).subscribe((data: any) => {
      this.trainingTypeList = data
    });

  }

  // get training institute list
  getTrainingInstitute() {
    //return false;
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    this.http.get(this.serverUrl + 'api/getTrainingInstitute', { headers: reqHeader }).subscribe((data: any) => {
      this.trainingInstituteList = data
    });
  }


  //*..... Add Training Modal Window....//

  saveTraining() {
    if (this.trainingType == "") {
      this.toastr.errorToastr('Please Select Training Type', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.trainingName == "") {
      this.toastr.errorToastr('Please Enter Training Name', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.trainingInstitute == "") {
      this.toastr.errorToastr('Please Select Institute', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.trainingDuration == "") {
      this.toastr.errorToastr('Please Enter Training Duration', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {
      if (this.trainingId != "") {
        //return false;
        var updateData = {
          "trnngCd": this.trainingId,
          "trnngTypeCd": this.trainingType,
          "trnngName": this.trainingName,
          "trnngDesc": this.trainingDesc,
          "vndrId": this.trainingInstitute,
          "trnngDuration": this.trainingDuration,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.put(this.serverUrl + 'api/updateTraining', updateData, { headers: reqHeader }).subscribe((data: any) => {

          //alert(data.msg);

          if (data.msg == 'Record Updated Successfully!') {

            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });

            this.clear();
            $('#addTrainingTypeModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();

            return false;

          }
          else if (data.msg == "Update - Training Already Exist!") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();
            return false;
          }
          else if (data.msg == "Update - Vendor Training Already Exist!") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();
            return false;
          }
          else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();
            return false;
          }

        });
      }

      else {
        var saveData = {
          "trnngTypeCd": this.trainingType,
          "trnngName": this.trainingName,
          "trnngDesc": this.trainingDesc,
          "vndrId": this.trainingInstitute,
          "trnngDuration": this.trainingDuration,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
        //alert(reqHeader);
        this.http.post(this.serverUrl + 'api/saveTraining', saveData, { responseType: 'json' }).subscribe((data: any) => {
          // this.http.post(this.serverUrl + 'api/saveDepartment', saveData).subscribe((data: any) => {

          //alert(data.msg);
          //return false;

          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#addTrainingTypeModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();

            return false;
          }
          else if (data.msg == "Insert - Training Already Exists") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();
            return false;
          }
          else if (data.msg == "Insert - Vendor Training Already Exist!") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();
            return false;
          }
          else {
            this.toastr.errorToastr(data.msg, 'Error !', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTraining();
            //this.getCertificateCriteria();

            return false;
          }
        });
      }
    }
  }

  edit(item) {
    this.trainingId = item.trnngCd;
    this.trainingType = item.trnngTypeCd;
    this.trainingName = item.trnngName;
    this.trainingInstitute = item.vndrId;
    this.trainingDuration = item.trnngDuration;
  }

  deleteTraining(item) {
    this.clear();
    this.dTrainingId = item.trnngCd;
  }


  //*    Add Training Type Modal Window....//

  saveTrainingType() {
    if (this.trainingTypeName == "") {
      this.toastr.errorToastr('Please Enter Type Name', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.trainingTypeDesc == "") {
      this.toastr.errorToastr('Please Enter Type Description', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {
      if (this.trainingTypeId != "") {
        //return false;
        var updateData = {
          "trnngTypeCd": this.trainingTypeId,
          "trnngTypeName": this.trainingTypeName,
          "trnngTypeDesc": this.trainingTypeDesc,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.put(this.serverUrl + 'api/updateTrainingType', updateData, { headers: reqHeader }).subscribe((data: any) => {

          //alert(data.msg);

          if (data.msg == 'Record Updated Successfully!') {

            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });

            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTrainingType();
            //this.getCertificateCriteria();

            return false;

          }
          else if (data.msg == "Update - Record Already Exists!") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTrainingType();
            //this.getCertificateCriteria();
            return false;
          }
          else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTrainingType();
            //this.getCertificateCriteria();
            return false;
          }

        });
      }

      else {
        var saveData = {
          "trnngTypeName": this.trainingTypeName,
          "trnngTypeDesc": this.trainingTypeDesc,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
        //alert(reqHeader);
        this.http.post(this.serverUrl + 'api/saveTrainingType', saveData, { responseType: 'json' }).subscribe((data: any) => {
          // this.http.post(this.serverUrl + 'api/saveDepartment', saveData).subscribe((data: any) => {

          //alert(data.msg);
          //return false;

          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTrainingType();
            //this.getCertificateCriteria();

            return false;
          }
          else if (data.msg == "Insert - Record Already Exists!") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTrainingType();
            //this.getCertificateCriteria();

            return false;
          }
          else {
            this.toastr.errorToastr(data.msg, 'Error !', { toastTimeout: (2500) });
            this.clear();
            //$('#addTrainingTypeModal').modal('hide');
            this.getTrainingType();
            //this.getCertificateCriteria();

            return false;
          }
        });
      }
    }
  }

  editTrainingType(item) {
    this.trainingTypeId = item.trnngTypeCd;
    this.trainingTypeName = item.trnngTypeName;
    this.trainingTypeDesc = item.trnngTypeDesc;
  }

  clear() {
    //Ng-Models for Add Training Model
    this.trainingId = ''; // for update/delete
    this.trainingType = '';
    this.trainingName = '';
    this.trainingInstitute = '';
    this.trainingDuration = '';

    // Ng-Models for Training Type Modal Window
    this.trainingTypeId = ''; // for update/delete
    this.trainingTypeName = '';
    this.trainingTypeDesc = '';

    //Ng-models for delete modal window
    this.userPassword = '';
    this.userPINCode = '';
  }

  deleteTrainingType(item) {
    this.clear();
    this.dTrainingTypeId = item.trnngTypeCd;
  }


  delete() {

    //alert(this.dTrainingTypeId);

    if (this.userPassword == "") {
      this.toastr.errorToastr('Please Enter Password', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.userPINCode == "") {
      this.toastr.errorToastr('Please Enter PIN Code', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {
      if (this.dTrainingId != "") {

        var data = {
          "trnngCd": this.dTrainingId,
          // "qlfctnTypeCd": this.certificateId,
          // "qlfctnCd": this.certificateGroup,
          // "qlfctnCriteriaName": this.certificateTitle,
          // "qlfctnCriteriaDesc": this.certificateTitleDescription,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.put(this.serverUrl + 'api/deleteTraining', data, { headers: reqHeader }).subscribe((data: any) => {

          //alert(data.msg);

          if (data.msg == "Record Deleted Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#deleteModal').modal('hide');
            this.getTraining();
            return false;
          }
          else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          }
        });
      }
      else if (this.dTrainingTypeId != "") {
        var groupdata = {
          "trnngTypeCd": this.dTrainingTypeId,
          // "qlfctnName": this.certfctGroupName,
          // "qlfctnDesc": this.certfctGroupDesc,
          "connectedUser": 12000
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.put(this.serverUrl + 'api/deleteTrainingType', groupdata, { headers: reqHeader }).subscribe((data: any) => {

          //alert(data.msg);

          if (data.msg == "Record Deleted Successfully!") {
            this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
            this.clear();
            $('#deleteModal').modal('hide');
            this.getTrainingType();
            return false;
          }
          else {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          }
        });
      }// else if ends
    }//else ends
  }







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
