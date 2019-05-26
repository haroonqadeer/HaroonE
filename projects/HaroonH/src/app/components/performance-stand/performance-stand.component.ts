import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OrderPipe } from 'ngx-order-pipe';

declare var $: any;
@Component({
    selector: 'app-performance-stand',
    templateUrl: './performance-stand.component.html',
    styleUrls: ['./performance-stand.component.scss']
})
export class PerformanceStandComponent implements OnInit {

    serverUrl = "http://localhost:11664/";
    //serverUrl = "http://192.168.200.19:3006/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    //*Bolean variable 
    updateFlag = false;

    //* list for excel data
    excelDataList = [];

    pStandardList = [];

    //* variables for pagination and orderby pipe
    p = 1;
    order = 'info.name';
    reverse = false;
    sortedCollection: any[];
    itemPerPage = '10';
    

    //* Variables for NgModels
    tblSearch;

    pStandardId;

    pTitle;
    pDescription;
    lblMainGroup;
    lblSubGroup;

    txtdPassword = '';
    txtdPin = '';
    

    constructor(
        private toastr: ToastrManager, 
        private http: HttpClient
    ) {}

    ngOnInit() {
        
        this.getPStandard();
    }

    //function for get all saved performance standards 
    getPStandard() {
        //var Token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.get(this.serverUrl + 'api/getPStandard', { headers: reqHeader }).subscribe((data: any) => {
            this.pStandardList = data
        });

    }



    //Function for save and update performance standard 
    save() {

        if (this.pTitle == '') {
            this.toastr.errorToastr('Please enter performance title', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else if (this.pDescription == '') {
            this.toastr.errorToastr('Please enter performance description', 'Error', { toastTimeout: (2500) });
            return false;
        }
        else {

            if (this.pStandardId != '') {

                //this.app.showSpinner();
                // this.app.hideSpinner();
                //* ********************************************update data 
                var updateData = {
                    "PrcssStepID": this.pStandardId,
                    "ProcessStepTitle": this.pTitle,
                    "ProcessStepDesc": this.pDescription,
                    "PrcssID": 1,
                    "PrcssTypeCd": 1,
                    "ConnectedUser": "3",
                    "DelFlag": 0,
                    "DelStatus": "No"
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.put(this.serverUrl + 'api/updatePStandard', updateData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Done") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr('Record Updated Successfully', 'Success!', { toastTimeout: (2500) });
                        $('#standardModal').modal('hide');
                        this.getPStandard();
                        return false;
                    }
                });

            }
            else {


                //* ********************************************save data 
                var saveData = {
                    "ProcessStepTitle": this.pTitle,
                    "ProcessStepDesc": this.pDescription,
                    "PrcssID": 1,
                    "PrcssTypeCd": 1,
                    "ConnectedUser": "2",
                    "DelFlag": 0,
                    "DelStatus": "No"
                };

                //var token = localStorage.getItem(this.tokenKey);

                //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

                var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

                this.http.post(this.serverUrl + 'api/savePStandard', saveData, { headers: reqHeader }).subscribe((data: any) => {

                    if (data.msg != "Done") {
                        this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                        return false;
                    } else {
                        this.toastr.successToastr('Record Saved Successfully', 'Success!', { toastTimeout: (2500) });
                        $('#standardModal').modal('hide');
                        this.getPStandard();
                        return false;
                    }
                });
            }
        }
    }


    //function for edit existing performance standard 
    edit(item) {

        this.clear();
        this.updateFlag = true;

        this.pStandardId = item.prcssStepID;
        this.pTitle = item.processStepTitle;
        this.pDescription = item.processStepDesc;
        this.lblMainGroup = item.prcssTitle;
        this.lblSubGroup = item.prcssTypeName;

    }


    //functions for delete performance standard
    deleteTemp(item) {
        this.clear();
        this.pStandardId = item.prcssStepID
    }


    delete() {
        if (this.txtdPassword == '') {
            this.toastr.errorToastr('Please enter password', 'Error', { toastTimeout: (2500) });
            return false
        }
        else if (this.txtdPin == '') {
            this.toastr.errorToastr('Please enter PIN', 'Error', { toastTimeout: (2500) });
            return false
        }
        else if (this.pStandardId == '') {
            this.toastr.errorToastr('Invalid delete request', 'Error', { toastTimeout: (2500) });
            return false
        }
        else {

            //this.app.showSpinner();
            // this.app.hideSpinner();

            //* ********************************************update data 
            var updateData = {

                "PrcssStepID": this.pStandardId,
                "ConnectedUser": "4",
                "DelFlag": 1,
                "DelStatus": "Yes"
            };

            //var token = localStorage.getItem(this.tokenKey);

            //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

            this.http.put(this.serverUrl + 'api/updatePStandard', updateData, { headers: reqHeader }).subscribe((data: any) => {

                if (data.msg != "Done") {
                    this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
                    return false;
                } else {
                    this.toastr.successToastr('Record Deleted Successfully', 'Success!', { toastTimeout: (2500) });
                    $('#deleteModal').modal('hide');
                    this.getPStandard();
                    return false;
                }
            });
        }
    }


    //function for empty all fields
    clear() {

        this.updateFlag = false;

        this.pStandardId = '';
        this.pTitle = '';
        this.pDescription = '';
        this.lblMainGroup = '';
        this.lblSubGroup = '';

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
