import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TreeNode } from '../../nodeTree/TreeNode';
import { NodeService } from '../../nodeTree/node.service';

import { HttpClient } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';
import {
    IgxExcelExporterOptions,
    IgxExcelExporterService,
    IgxGridComponent,
    IgxCsvExporterService,
    IgxCsvExporterOptions,
    CsvFileTypes
} from "igniteui-angular";
import * as jsPDF from 'jspdf';

//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting role data into main table------------------------// 
//-------------------Getting modules and menu data in menuTree----------------//
//-------------------Getting specific role data in drop down box--------------//
//-------------------Getting specific module data in table--------------------//
//-------------------Add menuTree data into roleTree--------------------------// 
//-------------------Save permissions into database---------------------------//
//-------------------Add permissions of roles---------------------------------//
//-------------------Creation of roles, modules and menu in database----------//
//-------------------Update roles, modules and menu into database-------------//
//-------------------Delete roles, modules and menu into database-------------//
//-------------------Remove roleTree data-------------------------------------// 
//-------------------Export into PDF, CSV, Excel -----------------------------//
//-------------------For sorting the record-----------------------------//
//----------------------------------------------------------------------------//


declare var $: any;

//For Push Data in the Object array
export interface erpObject {
  erpObjctCd: string;
  erpObjctTypeCd: string;
}

@Component({
  selector: 'app-userroles',
  templateUrl: './userroles.component.html',
  styleUrls: ['./userroles.component.scss']
})
export class UserrolesComponent implements OnInit {


  // list for excel data
  excelDataList = [];

  // order: string = "uId";
  // reverse: boolean = false;
  //selectedEntry = "5";

    //Page Models
    erpRoleCd = '';
    txtdPassword = '';
    txtdPin = '';
    erpRoleName = '';
    cmbModule = '';
    roleSearch = '';
    tblSearch;
    removeNodeFlag = false;
  //* variables for pagination and orderby pipe
  p = 1;
  order = 'info.name';
  reverse = false;
  sortedCollection: any[];
  itemPerPage = '10';


  rolesData = [
    {
      uId: 1,
      uRoleName: "Admin",
      uNoModule: 3,
      uNoPage: 4
    },
    {
      uId: 2,
      uRoleName: "Super Admin",
      uNoModule: 5,
      uNoPage: 5
    },
    {
      uId: 3,
      uRoleName: "Admin SCM",
      uNoModule: 3,
      uNoPage: 4
    },
    {
      uId: 4,
      uRoleName: "Admin Health",
      uNoModule: 3,
      uNoPage: 4
    },
    {
      uId: 5,
      uRoleName: "Auditor",
      uNoModule: 9,
      uNoPage: 15
    },
    {
      uId: 6,
      uRoleName: "Admin Housing",
      uNoModule: 3,
      uNoPage: 4
    },
    {
      uId: 7,
      uRoleName: "Procurement Manager",
      uNoModule: 4,
      uNoPage: 3
    },
    {
      uId: 8,
      uRoleName: "Accountant",
      uNoModule: 3,
      uNoPage: 12
    },
    {
      uId: 9,
      uRoleName: "Finance Admin",
      uNoModule: 3,
      uNoPage: 4
    },
    {
      uId: 10,
      uRoleName: "Admin",
      uNoModule: 3,
      uNoPage: 4
    },
    {
      uId: 12,
      uRoleName: "Admin",
      uNoModule: 3,
      uNoPage: 6
    },
    {
      uId: 13,
      uRoleName: "Finance Manager",
      uNoModule: 7,
      uNoPage: 7
    },
    {
      uId: 14,
      uRoleName: "HR Admin",
      uNoModule: 6,
      uNoPage: 4
    },
    {
      uId: 15,
      uRoleName: "SCM",
      uNoModule: 3,
      uNoPage: 4
    },
    {
      uId: 16,
      uRoleName: "HR",
      uNoModule: 3,
      uNoPage: 4
    }
  ]


  //list for tree
  menuTree: TreeNode[];

  selectedMenu: TreeNode[];

  roleTree: TreeNode[];

  selectedRole: TreeNode[];



  serverUrl = "http://localhost:2000/";

  //constructor(private http: HttpClient, public toastr: ToastrManager, private nodeService: NodeService) { }

    constructor(private http: HttpClient,
        private excelExportService: IgxExcelExporterService,
        private csvExportService: IgxCsvExporterService,
        private app: AppComponent,
        public toastr: ToastrManager) { }

    //list variables
    public employees = [];
    public tempRoleList = [];
    public modules;
    public menus;
    public roles;
    public menuList = [];
    public children = [];
    public roleList = [];
    public roleChildren = [];
    public erpObjct: Array<erpObject> = [];
    myTempList = [];

    ngOnInit() {

        this.getMenu();
        this.getRole();
    }

    @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent;//For excel
    @ViewChild("exportPDF") public exportPDF: ElementRef;// for pdf


    //setting ascending or descending order of table
    // setOrder(value: any) {
    //   if (this.order === value) {
    //     this.reverse = !this.reverse;
    //   }
    //   this.order = value;
    // }


    //getting roles data from database and show in role table 
    getRole() {
        this.http.get(this.serverUrl + 'api/getUserRoles').subscribe((data: any) => {
            this.roles = data;
        });
    }


    //getting specific role data and assign it to role tree
    getRoleTree(item) {

        this.roleTree = [];
        this.roleList = [];

        this.http.get(this.serverUrl + 'api/getRoleTree?erpRoleCd=' + item).subscribe((data: any) => {

        this.tempRoleList = data;
        this.employees = data;

        for (var i = 0; i < this.employees.length; i++) {

            //checking if type is module
            if (this.employees[i].erpObjctTypeCd == 1) {

            this.roleChildren = [];

            for (var j = 0; j < this.employees.length; j++) {

                if (this.employees[j].erpObjctTypeCd == 2
                && this.employees[j].parentErpObjctCd == this.employees[i].erpObjctCd) {

                this.roleChildren.push({
                    label: this.employees[j].erpObjctName,
                    data: [{
                    objName: this.employees[j].erpObjctName,
                    typeCode: this.employees[j].erpObjctTypeCd,
                    objCode: this.employees[j].erpObjctCd,
                    parentErpObjCd: this.employees[i].erpObjctCd,
                    parentErpObjTypeCd: this.employees[i].erpObjctTypeCd,
                    parentErpObjName: this.employees[i].erpObjctName
                    }]
                });
                }
            }

            this.roleList.push({
                label: this.employees[i].erpObjctName,
                data: [{
                objName: this.employees[i].erpObjctName,
                typeCode: this.employees[i].erpObjctTypeCd,
                objCode: this.employees[i].erpObjctCd
                }],
                children: this.roleChildren
            });
            }
        }

        this.roleTree = this.roleList;

        });
    }


    //Menu list filter method 
    getFilterMenu(item) {
        return this.tempRoleList.filter(x => x.parentErpObjctCd == item && x.erpObjctTypeCd == 2);
    }


    //Module list filter method 
    getFilterModule() {
        //alert(roleId);
        return this.tempRoleList.filter(x => x.erpObjctTypeCd == 1);
    }


    //getting all modules including with menu and assign all data to menu tree 
    getMenu() {

        this.app.showSpinner();

        this.http.get(this.serverUrl + 'api/getUserMenu').subscribe((data: any) => {
            this.employees = data;

            for (var i = 0; i < this.employees.length; i++) {
                //checking if type is module
                if (this.employees[i].erpobjctTypeCd == 1) {

                this.children = [];

                for (var j = 0; j < this.employees.length; j++) {
                    //checking if type is menu and current menu parent id and module id are same 
                    if (this.employees[j].erpobjctTypeCd == 2
                    && this.employees[j].parentErpobjctCd == this.employees[i].erpobjctCd) {

                    this.children.push({
                        label: this.employees[j].erpobjctName,
                        data: [{
                            objName: this.employees[j].erpobjctName,
                            typeCode: this.employees[j].erpobjctTypeCd,
                            objCode: this.employees[j].erpobjctCd,
                            parentErpObjCd: this.employees[i].erpobjctCd,
                            parentErpObjTypeCd: this.employees[i].erpobjctTypeCd,
                            parentErpObjName: this.employees[i].erpobjctName
                        }]
                    });
                    }
                }

                this.menuList.push({
                    label: this.employees[i].erpobjctName,
                    data: [{
                        objName: this.employees[i].erpobjctName,
                        typeCode: this.employees[i].erpobjctTypeCd,
                        objCode: this.employees[i].erpobjctCd
                    }],
                    children: this.children
                });
                }
            }
        
            this.menuTree = this.menuList;
            
            if (this.removeNodeFlag == false && (this.roleTree == undefined || this.roleTree.length == 0)){

                this.roleTree = [];

            }
            if (this.removeNodeFlag == true){

                this.compareRoleList(this.menuTree, this.roleTree);

            }

            this.app.hideSpinner();
            
        });
    }


    //save role data in database
    save() {

    //checking if role name is empty
    if (this.erpRoleName.trim().length == 0) {
        this.toastr.errorToastr('Please Enter Role Name', 'Oops!', { toastTimeout: (2500) });
        return;
    }
    else if (this.roleTree == undefined) {
        this.toastr.errorToastr('Please Push Data in Role Tree', 'Error', { toastTimeout: (2500) }); return
    }

    //Adding role tree data to another list
        for (var i = 0; i < this.roleTree.length; i++) {

            this.erpObjct.push({
                erpObjctCd: this.roleTree[i].data[0].objCode,
                erpObjctTypeCd: this.roleTree[i].data[0].typeCode
            });
            for (var j = 0; j < this.roleTree[i].children.length; j++)
                this.erpObjct.push({
                    erpObjctCd: this.roleTree[i].children[j].data[0].objCode,
                    erpObjctTypeCd: this.roleTree[i].children[j].data[0].typeCode
                });
        }

        if (this.erpRoleCd == "") {
        //Save roles in database

            this.app.showSpinner();
            this.app.hideSpinner();

            var roleData = { erpObjct: JSON.stringify(this.erpObjct), erpRoleName: this.erpRoleName };

            this.http.post(this.serverUrl + 'api/saveUserRole', roleData).subscribe((data: any) => {
                this.toastr.successToastr(data, 'Success', { toastTimeout: (2500) }); return;
            });
        } else {
            //Update roles in database
            this.app.showSpinner();
            this.app.hideSpinner();
            var rolesData = { erpObjct: JSON.stringify(this.erpObjct), erpRoleCd: this.erpRoleCd, erpRoleName: this.erpRoleName };
            this.http.put(this.serverUrl + 'api/updateUserRole', rolesData).subscribe((data: any) => {
                this.toastr.successToastr(data, 'Success', { toastTimeout: (2500) }); return;
            });
        }

    }


    //save each role permissions in database
    savePermission() {
        this.app.showSpinner();
        this.app.hideSpinner();
        for (var i = 0; i < this.tempRoleList.length; i++) {
        if (this.tempRoleList[i].Addition == undefined)
            this.tempRoleList[i].Addition = false;
        }

        var rolesData = { tempRoleList: JSON.stringify(this.tempRoleList), erpRoleCd: this.erpRoleCd };
        this.http.put(this.serverUrl + 'api/savePermission', rolesData).subscribe((data: any) => {
        this.toastr.successToastr(data, 'Success', { toastTimeout: (2500) }); return;
        });
    }


    //add permissions of each menu
    addPermission(item) {
        this.app.showSpinner();
        this.app.hideSpinner();
        this.erpRoleName = item.erpRoleName;
        this.erpRoleCd = item.erpRoleCd;
        //getting specific role data and assign it to role tree
        this.getRoleTree(this.erpRoleCd);
    }


    //Adding modules and menu in role tree 
    addRoles() {
    
        this.app.showSpinner();       

        //checking if menuTree data not selected
        if (this.selectedMenu == undefined) {
            this.toastr.errorToastr('Please Select Nodes!', 'Error', { toastTimeout: (2500) });
            this.app.hideSpinner();
            return false;
        }else if (this.selectedMenu.length == 0){
            this.toastr.errorToastr('Please Select Nodes!', 'Error', { toastTimeout: (2500) });
            this.app.hideSpinner();
            return false;
        }

        this.roleChildren = [];
        this.myTempList = this.roleTree;
        this.roleList = [];
        this.roleTree = [];

        //this.roleList = this.roleTree;
        //this.roleList = this.myTempList;
        //alert(this.roleList.length);

        for (var i = 0; i < this.selectedMenu.length; i++){

            if (this.selectedMenu[i].data[0].typeCode == 2){                

                var tempRoleList = this.filterRoleList(this.selectedMenu[i].data[0].parentErpObjName, 2);
                
                var newRoleList = this.filterNewRoleList(this.selectedMenu[i].data[0].parentErpObjName, 1);

                if(newRoleList.length <= 0){

                    // if (this.myTempList.length > 0 ){
                        
                    //     var oldRoleList = this.oldRoleList(this.selectedMenu[i].data[0].parentErpObjName, 2);
                        
                    //     for (var j = 0; j < oldRoleList.length; j++) {

                    //         //alert(oldRoleList[j].data[0].objName);

                    //         this.roleChildren.push({
                    //             label: oldRoleList[j].data[0].objName,
                    //             data: [{
                    //                 objName: oldRoleList[j].data[0].objName,
                    //                 typeCode: oldRoleList[j].data[0].typeCode,
                    //                 objCode: oldRoleList[j].data[0].objCode,
                    //                 parentErpoObjCd: this.selectedMenu[i].data[0].objCode
                    //             }]
                    //         });
    
                    //     }

                    // }

                    for (var j = 0; j < tempRoleList.length; j++) {

                        this.roleChildren.push({
                            label: tempRoleList[j].data[0].objName,
                            data: [{
                                objName: tempRoleList[j].data[0].objName,
                                typeCode: tempRoleList[j].data[0].typeCode,
                                objCode: tempRoleList[j].data[0].objCode,
                                parentErpoObjCd: this.selectedMenu[i].data[0].objCode
                            }]
                        });

                    }
                

                    

                    this.roleList.push({
                        label: this.selectedMenu[i].data[0].parentErpObjName,
                        data: [{
                            objName: this.selectedMenu[i].data[0].parentErpObjName,
                            typeCode: this.selectedMenu[i].data[0].parentErpObjTypeCd,
                            objCode: this.selectedMenu[i].data[0].parentErpObjCd
                        }],
                        children: this.roleChildren
                    });

                }else{

                }

                this.roleChildren = [];

                
            }
        




            if (this.selectedMenu[i].data[0].typeCode == 2){

                for (var j = 0; j < this.tempRoleList.length; j++){

                    if(this.selectedMenu[i].data[0].parentErpObjCd == this.tempRoleList[j].data[0].objCode){
                        alert(this.selectedMenu[i].data[0].parentErpObjName +" - "+ this.tempRoleList[i].data[0].objName +" - "+ this.tempRoleList[j].data[0].objCode);

                        // this.roleChildren.push({
                        //     label: tempRoleList[j].data[0].objName,
                        //     data: [{
                        //         objName: tempRoleList[j].data[0].objName,
                        //         typeCode: tempRoleList[j].data[0].typeCode,
                        //         objCode: tempRoleList[j].data[0].objCode,
                        //         parentErpoObjCd: this.selectedMenu[i].data[0].objCode
                        //     }]
                        // });

                        // this.roleTree[i].push({
                        //     children: this.roleChildren
                        // });
                    }

                    // for (var k = 0; k < this.roleTree[j].children.length; k++){
                    
                    //     if (this.roleTree[j].children[k].data[0].objName == this.selectedMenu[i].data[0].objName){
                    //         alert(this.selectedMenu[i].data[0].objName);
                    //         //this.roleTree[j].children.splice(k, 1);
                    //     }
                    // }
                }
            }
        }

        
        this.roleTree = this.roleList;
        this.compareRoleList(this.menuTree, this.roleTree);
        this.selectedMenu = [];
        this.app.hideSpinner();

    }


    //filter array
    filterRoleList(name, code) {
        return this.selectedMenu.filter(x => x.data[0].parentErpObjName == name && x.data[0].typeCode == code);
        //x => x.data.typeCode == code && x.data.parentErpObjName == name
    }

    //filter array 
    oldRoleList(name, code) {
        return this.myTempList.filter(x => x.label == name);
        //x => x.data.typeCode == code && x.data.parentErpObjName == name
    }

    //filter array
    filterNewRoleList(name, code) {
        return this.roleList.filter(x => x.data[0].objName == name && x.data[0].typeCode == code);
    }

    //compare note tree 
    compareRoleList(MainRoleList, UserRoleList){

        //loop for remove children nodes 
        for (var i = 0; i < MainRoleList.length; i++){

            //loop for User role list parent node
            for (var j = 0; j < UserRoleList.length; j++){

                //checking roll exist in user list or not if exist then remove from main list 
                if (MainRoleList[i].label ==  UserRoleList[j].label){

                    //chicking children esixt or not of main list
                    if (MainRoleList[i].children.length > 0){
                        //Loop for main list children node
                        for (var k = 0; k < MainRoleList[i].children.length; k++){

                            //chicking children esixt or not of user list
                            if (UserRoleList[j].children.length > 0){

                                //loop for user list children node
                                for (var m = 0; m < UserRoleList[j].children.length; m++){

                                    //chicking node is exist in both list or not if exist then remove from main list
                                    if (MainRoleList[i].children[k].label ==  UserRoleList[j].children[m].label){
                                        MainRoleList[i].children.splice(k, 1);
                                    }

                                    //if all children nodes exist in user list then remove from main list
                                    if (MainRoleList[i].children.length == 0){

                                        //MainRoleList.splice(i, 1);

                                    }

                                }
                            }
                        }

                    }else{
                        
                        //if children not exist remove parent node 
                        MainRoleList.splice(i, 1);

                    }
                    //alert(MainRoleList[i].children[0].data[0].objName);
                    //MainRoleList.splice(i, 1);

                }

            }

        }


        //loop for remove children nodes
        for (var i = 0; i < MainRoleList.length; i++){

            //loop for User role list parent node
            for (var j = 0; j < UserRoleList.length; j++){

                //checking roll exist in user list or not if exist then remove from main list 
                if (MainRoleList[i].label ==  UserRoleList[j].label && MainRoleList[i].children.length == 0){
                    MainRoleList.splice(i, 1);
                }
            }

        }

        this.removeNodeFlag = false;
    }

    //clear all data
    clear() {

        this.roleTree = [];
        this.roleList = [];
        this.erpRoleName = "";
        this.erpRoleCd = "";
        this.txtdPassword = "";
        this.txtdPin = "";
    }


    //edit role data
    edit(item) {

        this.erpRoleName = item.erpRoleName;
        this.erpRoleCd = item.erpRoleCd;
        //getting specific role data and assign it to role tree
        this.getRoleTree(this.erpRoleCd);
        return false;
    }


    //Assign id and name to hidden labels
    delete(item) {
        this.clear();

        this.erpRoleName = item.erpRoleName;
        this.erpRoleCd = item.erpRoleCd;
    }


    //delete user role data from database
    deleteRole() {

        this.app.showSpinner();
        this.app.hideSpinner();
        //checking if password is empty
        if (this.txtdPassword.trim().length == 0) {
        this.toastr.errorToastr('Please Enter Password', 'Oops!', { toastTimeout: (2500) });
        return;
        }
        else if (this.txtdPin.trim().length == 0) {
        this.toastr.errorToastr('Please Enter Pin', 'Oops!', { toastTimeout: (2500) });
        return;
        }
        //deleting roles from database
        var roleData = {erpObjct: JSON.stringify(this.erpObjct), erpRoleCd: this.erpRoleCd };

        this.http.put(this.serverUrl + 'api/deleteUserRole', roleData).subscribe((data: any) => {
        this.toastr.successToastr(data, 'Success', { toastTimeout: (2500) }); return;
        });
    }


    //removing selected menu or module from role tree
    removeRoles() {
        //this.app.showSpinner();
        //this.app.hideSpinner();

        //checking if roleTree data not selected
        if (this.selectedRole == undefined) {
            this.toastr.errorToastr('Please Select Nodes to Remove!', 'Error', { toastTimeout: (2500) }); return;
        }else if (this.selectedRole.length == 0){
            this.toastr.errorToastr('Please Select Nodes to Remove!', 'Error', { toastTimeout: (2500) }); return;
        }


        //deleting children nodes ------loop for selected role 
        for (var i = 0; i < this.selectedRole.length; i++){

            if (this.selectedRole[i].data[0].typeCode == 2){

                for (var j = 0; j < this.roleTree.length; j++){

                    for (var k = 0; k < this.roleTree[j].children.length; k++){
                    
                        if (this.selectedRole[i].data[0].objCode == this.roleTree[j].children[k].data[0].objCode){
                            //alert(this.roleTree[j].children[k].data[0].objName);
                            this.roleTree[j].children.splice(k, 1);
                        }
                    }
                }
            }
        }


        //deleting parent nodes ------loop for selected role 
        for (var i = 0; i < this.selectedRole.length; i++){

            if (this.selectedRole[i].data[0].typeCode == 1){

                for (var j = 0; j < this.roleTree.length; j++){
                    
                    if (this.roleTree[j].children.length == 0){
                        this.roleTree.splice(j, 1);
                    }
                }
            }
        }

        this.selectedRole = [];
        this.removeNodeFlag = true;
        this.menuTree = [];
        this.menuList = [];
        this.getMenu();

    }


    // For Print Purpose 
    printDiv() {

        // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

        // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
        // var cssAddress = ".cssAddress {font-size: 16px; }";
        // var cssContact = ".cssContact {font-size: 16px; }";

        // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

        // var printCss = commonCss + cssHeading + cssAddress + cssContact + tableCss;

        var printCss = this.app.printCSS();


        //printCss = printCss + "";

        var contents = $("#printArea").html();

        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();

        //Create a new HTML document.
        frameDoc.document.write('<html><head><title>DIV Contents</title>' + "<style>" + printCss + "</style>");


        //Append the external CSS file.  <link rel="stylesheet" href="../../../styles.scss" />  <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
        frameDoc.document.write('<style type="text/css" media="print">/*@page { size: landscape; }*/</style>');

        frameDoc.document.write('</head><body>');

        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');

        frameDoc.document.close();


        //alert(frameDoc.document.head.innerHTML);
        // alert(frameDoc.document.body.innerHTML);

        setTimeout(function () {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        frame1.remove();
        }, 500);
    }


    // For PDF Download
    downloadPDF() {

        var doc = new jsPDF("p", "pt", "A4"),
        source = $("#printArea")[0],
        margins = {
            top: 75,
            right: 30,
            bottom: 50,
            left: 30,
            width: 50
        };
        doc.fromHTML(
        source, // HTML string or DOM elem ref.
        margins.left, // x coord
        margins.top,
        {
            // y coord
            width: margins.width // max width of content on PDF
        },
        function (dispose) {
            // dispose: object with X, Y of the last line add to the PDF
            //          this allow the insertion of new lines after html
            doc.save("Test.pdf");
        },
        margins
        );
    }


    //For CSV File 
    public downloadCSV() {

        // case 1: When tblSearch is empty then assign full data list
        if (this.roleSearch == "") {
        var completeDataList = [];
        for (var i = 0; i < this.rolesData.length; i++) {
            //alert(this.tblSearch + " - " + this.departmentsData[i].departmentName)
            completeDataList.push({
            roleName: this.rolesData[i].uRoleName,
            noOfModule: this.rolesData[i].uNoModule,
            noOfPages: this.rolesData[i].uNoPage
            });
        }
        this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("UserRoleCompleteCSV", CsvFileTypes.CSV));
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.roleSearch != "") {
        var filteredDataList = [];
        for (var i = 0; i < this.rolesData.length; i++) {
            if (this.rolesData[i].uRoleName.toUpperCase().includes(this.roleSearch.toUpperCase()) ||
            this.rolesData[i].uNoModule.toString().toUpperCase().includes(this.roleSearch.toUpperCase()) ||
            this.rolesData[i].uNoPage.toString().toUpperCase().includes(this.roleSearch.toUpperCase())) {
            filteredDataList.push({
                roleName: this.rolesData[i].uRoleName,
                noOfModule: this.rolesData[i].uNoModule,
                noOfPages: this.rolesData[i].uNoPage
            });
            }
        }

        if (filteredDataList.length > 0) {
            this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("UserRoleFilterCSV", CsvFileTypes.CSV));
        } else {
            this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
        }
        }
    }


    //For Exce File
    public downloadExcel() {

        // case 1: When roleSearch is empty then assign full data list
        if (this.roleSearch == "") {
        for (var i = 0; i < this.rolesData.length; i++) {
            this.excelDataList.push({
            roleName: this.rolesData[i].uRoleName,
            noOfModule: this.rolesData[i].uNoModule,
            noOfPages: this.rolesData[i].uNoPage
            });
        }
        this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("UserRoleCompleteExcel"));
        this.excelDataList = [];
        }
        // case 2: When tblSearch is not empty then assign new data list
        else if (this.roleSearch != "") {
        for (var i = 0; i < this.rolesData.length; i++) {
            if (this.rolesData[i].uRoleName.toUpperCase().includes(this.roleSearch.toUpperCase()) ||
            this.rolesData[i].uNoModule.toString().toUpperCase().includes(this.roleSearch.toUpperCase()) ||
            this.rolesData[i].uNoPage.toString().toUpperCase().includes(this.roleSearch.toUpperCase())) {
            this.excelDataList.push({
                roleName: this.rolesData[i].uRoleName,
                noOfModule: this.rolesData[i].uNoModule,
                noOfPages: this.rolesData[i].uNoPage
            });
            }
        }

        if (this.excelDataList.length > 0) {
            this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("UserRoleFilterExcel"));
            this.excelDataList = [];
        }
        else {
            this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
        }
        }
    }


    //*function for sort table data 
    setOrder(value: string) {
        if (this.order === value) {
        this.reverse = !this.reverse;
        }
        this.order = value;
    }
}
