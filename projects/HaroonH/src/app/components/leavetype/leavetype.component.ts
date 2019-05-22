import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OrderPipe } from 'ngx-order-pipe';

declare var $: any;

@Component({
  selector: 'app-leavetype',
  templateUrl: './leavetype.component.html',
  styleUrls: ['./leavetype.component.scss']
})
export class LeavetypeComponent implements OnInit {

  serverUrl = "http://localhost:25986/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  updateFlag = false;
  //* list for excel data
  excelDataList = [];

  leaveTypeList = [];
  leaveNatureList = [];


  //* variables for pagination and orderby pipe
  p = 1;
  order = 'info.name';
  reverse = false;
  sortedCollection: any[];
  itemPerPage = '10';


  //* Variables for NgModels
  tblSearchType;
  tblSearchNature;

  leaveTypeId = '';
  leaveType = '';
  leaveDescription = '';

  leaveNatureId = '';
  leaveNature = '';
  natureDescription = '';

  txtdPassword = '';
  txtdPin = '';


  constructor(private toastr: ToastrManager, private http: HttpClient, private orderPipe: OrderPipe) { }

  ngOnInit() {

    this.getLeaveTypes();
    this.getLeaveNature();

  }

  //function for get all saved leave types 
  getLeaveTypes() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getLeaveType', { headers: reqHeader }).subscribe((data: any) => {
      this.leaveTypeList = data
    });

  }


  //function for get all saved leave nature 
  getLeaveNature() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getLeaveNature', { headers: reqHeader }).subscribe((data: any) => {
      this.leaveNatureList = data
    });

  }


  //Function for save and update leave Type 
  saveLeaveType() {
    if (this.leaveType.trim() == '') {
      this.toastr.errorToastr('Please enter leave type', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.leaveDescription.trim() == '') {
      this.toastr.errorToastr('Please enter leave type description', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {
      // address type conditions for subsidiary


      if (this.leaveTypeId != '') {

        //this.app.showSpinner();
        // this.app.hideSpinner();
        //* ********************************************update data 
        var updateData = {
          "LeaveTypeCd": this.leaveTypeId,
          "LeaveTypeName": this.leaveType,
          "LeaveTypeDesc": this.leaveDescription,
          "ConnectedUser": "2",
          "DelFlag": 0,
          "DelStatus": "No"
        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.put(this.serverUrl + 'api/updateLeaveType', updateData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg != "Done") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          } else {
            this.toastr.successToastr('Record Saved Successfully', 'Success!', { toastTimeout: (2500) });
            $('#typeModal').modal('hide');
            this.getLeaveTypes();
            return false;
          }
        });

      }
      else {


        //* ********************************************save data 
        var saveData = {
          "LeaveTypeName": this.leaveType,
          "LeaveTypeDesc": this.leaveDescription,
          "ConnectedUser": "2",
          "DelFlag": 0,
          "DelStatus": "No"
        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveLeaveType', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg != "Done") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          } else {
            this.toastr.successToastr('Record Saved Successfully', 'Success!', { toastTimeout: (2500) });
            $('#typeModal').modal('hide');
            this.getLeaveTypes();
            return false;
          }
        });
      }
    }
  }


  //function for edit existing leave type 
  editLeaveType(item) {

    this.clear();
    this.updateFlag = true;

    this.leaveTypeId = item.leaveTypeCd;
    this.leaveType = item.leaveTypeName;
    this.leaveDescription = item.leaveTypeDesc;
  }


  //functions for delete leave type
  deleteLeaveTypeTemp(item) {
    this.clear();
    this.leaveTypeId = item.leaveTypeCd;
  }


  deleteLeaveType() {
    if (this.txtdPassword == '') {
      this.toastr.errorToastr('Please enter password', 'Error', { toastTimeout: (2500) });
      return false
    }
    else if (this.txtdPin == '') {
      this.toastr.errorToastr('Please enter PIN', 'Error', { toastTimeout: (2500) });
      return false
    }
    else if (this.leaveTypeId == '') {
      this.toastr.errorToastr('Invalid delete request', 'Error', { toastTimeout: (2500) });
      return false
    }
    else {

      //this.app.showSpinner();
      // this.app.hideSpinner();

      //* ********************************************update data 
      var updateData = {
        "LeaveTypeCd": this.leaveTypeId,
        "LeaveTypeName": null,
        "LeaveTypeDesc": null,
        "ConnectedUser": "3",
        "DelFlag": 1,
        "DelStatus": "Yes"
      };

      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.put(this.serverUrl + 'api/updateLeaveType', updateData, { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg != "Done") {
          this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
          return false;
        } else {
          this.toastr.successToastr('Record Saved Successfully', 'Success!', { toastTimeout: (2500) });
          $('#deleteModal').modal('hide');
          this.getLeaveTypes();
          return false;
        }
      });
    }
  }



  //Function for save and update leave nature 
  saveLeaveNature() {
    if (this.leaveNature.trim() == '') {
      this.toastr.errorToastr('Please enter leave nature', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else if (this.natureDescription.trim() == '') {
      this.toastr.errorToastr('Please enter leave nature description', 'Error', { toastTimeout: (2500) });
      return false;
    }
    else {

      if (this.leaveNatureId != '') {

        //this.app.showSpinner();
        // this.app.hideSpinner();
        //* ********************************************update data 
        var updateData = {
          "LeaveNatureCd": this.leaveNatureId,
          "LeaveNatureName": this.leaveNature,
          "LeaveNatureDesc": this.natureDescription,
          "ConnectedUser": "2",
          "DelFlag": 0,
          "DelStatus": "No"
        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.put(this.serverUrl + 'api/updateLeaveNature', updateData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg != "Done") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          } else {
            this.toastr.successToastr('Record Saved Successfully', 'Success!', { toastTimeout: (2500) });
            $('#leaveNatureModal').modal('hide');
            this.getLeaveNature();
            return false;
          }
        });

      }
      else {


        //* ********************************************save data 
        var saveData = {
          "LeaveNatureName": this.leaveNature,
          "LeaveNatureDesc": this.natureDescription,
          "ConnectedUser": "2",
          "DelFlag": 0,
          "DelStatus": "No"
        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post(this.serverUrl + 'api/saveLeaveNature', saveData, { headers: reqHeader }).subscribe((data: any) => {

          if (data.msg != "Done") {
            this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
            return false;
          } else {
            this.toastr.successToastr('Record Saved Successfully', 'Success!', { toastTimeout: (2500) });
            $('#leaveNatureModal').modal('hide');
            this.getLeaveNature();
            return false;
          }
        });
      }
    }
  }



  //function for edit existing leave type 
  editLeaveNature(item) {

    this.clear();
    this.updateFlag = true;

    this.leaveNatureId = item.leaveNatureCd;
    this.leaveNature = item.leaveNatureName;
    this.natureDescription = item.leaveNatureDesc;
  }



  //functions for delete leave type
  deleteNatureTypeTemp(item) {
    this.clear();
    this.leaveNatureId = item.leaveNatureCd;
  }


  deletLeaveNature() {
    if (this.txtdPassword == '') {
      this.toastr.errorToastr('Please enter password', 'Error', { toastTimeout: (2500) });
      return false
    }
    else if (this.txtdPin == '') {
      this.toastr.errorToastr('Please enter PIN', 'Error', { toastTimeout: (2500) });
      return false
    }
    else if (this.leaveNatureId == '') {
      this.toastr.errorToastr('Invalid delete request', 'Error', { toastTimeout: (2500) });
      return false
    }
    else {

      //this.app.showSpinner();
      // this.app.hideSpinner();

      //* ********************************************update data 
      var updateData = {
        "LeaveNatureCd": this.leaveNatureId,
        "LeaveNatureName": null,
        "LeaveNatureDesc": null,
        "ConnectedUser": "3",
        "DelFlag": 1,
        "DelStatus": "Yes"
      };

      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.put(this.serverUrl + 'api/updateLeaveNature', updateData, { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg != "Done") {
          this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
          return false;
        } else {
          this.toastr.successToastr('Record Saved Successfully', 'Success!', { toastTimeout: (2500) });
          $('#deleteNatureModal').modal('hide');
          this.getLeaveNature();
          return false;
        }
      });
    }
  }



  //function for empty all fields
  clear() {

    this.updateFlag = false;

    this.leaveTypeId = '';
    this.leaveType = '';
    this.leaveDescription = '';

    this.leaveNatureId = '';
    this.leaveNature = '';
    this.natureDescription = '';

    this.txtdPassword = '';
    this.txtdPin = '';

  }


  //function for sort table data 
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

}
