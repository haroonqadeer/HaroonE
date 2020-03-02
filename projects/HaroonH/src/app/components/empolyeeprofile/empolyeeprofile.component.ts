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
import { jsonpCallbackContext } from "@angular/common/http/src/module";
import { TTBody } from "primeng/treetable";

import { ConfigAddressComponent } from "src/app/components/config-address/config-address.component";
import { ConfigContactComponent } from "src/app/components/config-contact/config-contact.component";

declare var $: any;

@Component({
  selector: "app-empolyeeprofile",
  templateUrl: "./empolyeeprofile.component.html",
  styleUrls: ["./empolyeeprofile.component.scss"]
})
export class EmpolyeeprofileComponent implements OnInit {
  @ViewChild(ConfigAddressComponent) shrd_adrs: ConfigAddressComponent;
  @ViewChild(ConfigContactComponent) shrd_cntct: ConfigContactComponent;

  @Output() myEvent = new EventEmitter();
  // serverUrl = "http://localhost:9043/";
  // imgPath = "I:/VU Projects/Visual_Code_Proj/ERP_Module/HaroonE/src/assets/images/EmpImages";

  serverUrl = "http://ambit.southeastasia.cloudapp.azure.com:9026/";
  imgPath = "C:/inetpub/wwwroot/EMIS/assets/images/EmpImages";

  imageUrl: string = "../assets/images/EmpImages/dropHereImg1.jpg";

  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  //*Bolean variable
  updateFlag = false;
  editMod = false;
  //* variables for pagination and orderby pipe
  p = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  //* list variables
  excelDataList = [];
  employeeListMain = [];
  jobProfileList = [];
  orgList = [];
  empOrgList = [];
  skillGroupList = [];
  skillList = [];
  empSkillList = [];
  allFacilityList = [];
  empFacilityList = [];
  degreeList = [];
  empDegreeList = [];
  experienceList = [];

  tempQualificationCriteriaList = [];
  gradeList = [
    { label: "A+", value: "A+" },
    { label: "A", value: "A" },
    { label: "B+", value: "B+" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "E", value: "E" },
    { label: "F", value: "F" }
  ];

  divisionList = [
    { label: "First Division", value: "First Division" },
    { label: "Second Division", value: "Second Division" },
    { label: "Third Division", value: "Third Division" }
  ];

  contactType = [];
  countryList = [];
  addressType = [];
  emailType = [];
  countryListForAddress = [];
  provinceList = [];
  districtList = [];
  cityList = [];

  branchList = [];
  departmentList = [];
  sectionList = [];
  tempJobList = [];

  //*hidden variables
  empId;
  desigId;
  deptId;
  locationId;
  cmpnyId;
  disabled = true;

  //* Variables for NgModels
  tblSearch = "";

  //* tab 1 ngModels
  firstName;
  midName;
  lastName;
  fullName;
  fhName;
  CNIC;
  religion;

  branch = "";
  department = "";
  section = "";
  jobPost = "";
  jobType = "";
  empHeading = "Add";

  postList = [];
  jobTypeList = [];
  //* tab 2 ngModels
  lblJobTitle;
  lblBPS;
  lblOffice;
  lblDepartment;
  lblAppointmentDate;
  lblJoiningDate;
  lblJobType;
  lblRetirementDate;
  lblContract;
  chkJobType = true;

  startDate;
  ddlJobProfile;

  //* tab 3 ngModels
  ddlDegree;
  empInstitute;
  empDegreeYear;
  ddlGrade;
  ddlDivision;

  //* tab 4 ngModels
  ddlSkillGroup;
  ddlSkill;
  empSkillLevel;
  empSkillRemarks;

  sklGrpTypeId;
  sklGrpQlfId;

  //* tab 5 ngModels
  empPost;
  ddlOrg;
  orgStartDate;
  orgEndDate;
  ddlExperience;
  appliedDate;
  joiningDate;
  contractFrom;
  contractEnd;

  txtdPassword = "";
  txtdPin = "";

  selectedFile: File = null;
  image;
  imgFile;
  progress;

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private fb: FormBuilder,
    private app: AppComponent
  ) {}

  ngOnInit() {
    this.getNewEmployee();
    this.getJobProfile();
    // this.getOrganitzion();
    this.getQualificationCriteria();
    // this.getEmpApprovedFacility();
    this.getJobType();
    this.getBranch();
    // this.getAddressTypes();
    // this.getCountry();
    // this.getProvince();
    // this.getDistrict();

    //this.getContactTypes();
    // this.getEmailTypes();

    this.midName = "";
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let reader = new FileReader();

    reader.onloadend = (e: any) => {
      this.image = reader.result;

      var splitImg = this.image.split(",")[1];
      this.image = splitImg;
      this.imageUrl = e.target.result;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  //function for get brnaches
  getBranch() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getBranches?cmpnyID=" + this.app.cmpnyId, {headers: reqHeader}).subscribe((data: any) => {

        this.branchList = data;
        this.app.hideSpinner();

      });
  }

  //function for get departments
  getDepartment(BranchCode) {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(
        this.serverUrl +
          "api/getDepartments?cmpnyID=" +
          this.app.cmpnyId +
          "&locationCd=" +
          BranchCode +
          "",
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.departmentList = data;

        if (this.editMod == true) {
          this.editMod = false;
        } else {
          this.department = "";
          this.section = "";
        }

        if (this.sectionList.length > 0) {
          this.sectionList = [];
        }

        this.app.hideSpinner();
      });
  }

  //function for get section
  getSection(DepartmentId) {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(
        this.serverUrl +
          "api/getSection?cmpnyID=" +
          this.app.cmpnyId +
          "&deptId=" +
          DepartmentId +
          "",
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        if (this.editMod == true) {
          this.editMod = false;
        } else {
          this.section = "";
        }
        this.sectionList = data;

        this.app.hideSpinner();
      });
  }

  //function for get all saved employee
  getNewEmployee() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getNewEmployee", { headers: reqHeader })
      .subscribe((data: any) => {
        this.employeeListMain = [];
        this.employeeListMain = data;

        this.getEmployee();
      });
  }

  getEmployee() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getEmployee", { headers: reqHeader })
      .subscribe((data: any) => {
        //this.employeeListMain = data;
        for (var i = 0; i < data.length; i++) {
          this.employeeListMain.push(data[i]);
        }

        this.app.hideSpinner();
      });
  }

  //function for get all saved job profile
  getJobProfile() {
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getJobProfile", { headers: reqHeader })
      .subscribe((data: any) => {
        this.postList = data;
        this.tempJobList = data;
        // for (var i = 0; i < data.length; i++) {
        //     this.jobProfileList.push({
        //         label: data[i].jobDesigName,
        //         value: data[i].jobDesigID,
        //         jobDesigID: data[i].jobDesigID,
        //         jobPostDeptCd: data[i].jobPostDeptCd,
        //         jobPostLocationCd: data[i].jobPostLocationCd,
        //         payGradeName: data[i].payGradeName
        //     });
        // }
      });
  }

  //function for get all saved organizations
  getOrganitzion() {
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getOrganization", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.orgList.push({
            label: data[i].orgName,
            value: data[i].orgID,
            orgTypeCd: data[i].orgTypeCd
          });
        }
      });
  }

  //function for get all saved degrees, certificate and skills
  getQualificationCriteria() {
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getQualificationCriteria", {
        headers: reqHeader
      })
      .subscribe((data: any) => {
        this.tempQualificationCriteriaList = data;

        for (var i = 0; i < data.length; i++) {
          //geting degree
          if (data[i].qlfctnTypeName == "Degree") {
            this.degreeList.push({
              label: data[i].qlfctnCriteriaName,
              value: data[i].qlfctnCriteriaCd,
              qlfctnCd: data[i].qlfctnCd,
              qlfctnTypeCd: data[i].qlfctnTypeCd
            });
          }

          //getting certificate
          if (data[i].qlfctnTypeName == "Experience") {
            this.experienceList.push({
              //label: data[i].qlfctnName + " - " + data[i].qlfctnCriteriaName,
              label: data[i].qlfctnCriteriaName,
              value: data[i].qlfctnCriteriaCd,
              qlfctnCd: data[i].qlfctnCd,
              qlfctnTypeCd: data[i].qlfctnTypeCd
            });
          }

          //getting skills
          if (data[i].qlfctnTypeName == "Skills") {
            var duplicateChk = false;
            for (var j = 0; j < this.skillGroupList.length; j++) {
              if (data[i].qlfctnCd == this.skillGroupList[j].value) {
                duplicateChk = true;
              }
            }

            if (duplicateChk == false) {
              this.skillGroupList.push({
                label: data[i].qlfctnName,
                value: data[i].qlfctnCd,
                qlfctnTypeCd: data[i].qlfctnTypeCd
              });
            }
          }
        }
      });
  }

  //Function for employee aproved facility
  getEmpApprovedFacility() {
    //var Token = localStorage.getItem(this.tokenKey);
    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getFacility", { headers: reqHeader })
      .subscribe((data: any) => {
        this.allFacilityList = data;
      });
  }

  //Function for get specific employee data
  getSpecificEmployeeData() {
    if (this.empId == 0) {
      this.toastr.errorToastr("Invalid Request", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      this.app.showSpinner();
      //* ********************************************save data
      var reqData = {
        EmpID: this.empId
      };

      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/getSpecificEmployeeData", reqData, {
          headers: reqHeader
        })
        .subscribe((data: any) => {
          if (data.msg != "Done") {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          } else {
            //getng emp adrs detl
            if (data.adrsList.length >= 1) {
              for (var i = 0; i < data.adrsList.length; i++) {
                this.shrd_adrs.addressList.push({
                  contactDetailCode: 0,
                  id: 0,
                  addressType: data.adrsList[i].addressTypeCd,
                  address: data.adrsList[i].addressLine1,
                  cityCode: data.adrsList[i].thslCd,
                  districtCode: data.adrsList[i].districtCd,
                  provinceCode: data.adrsList[i].prvncCd,
                  countryCode: data.adrsList[i].cntryCd,
                  zipCode: data.adrsList[i].zipCode,

                  addressTypeName: data.adrsList[i].addressTypeName,
                  cntryName: data.adrsList[i].cntryName,
                  districtName: data.adrsList[i].districtName,

                  status: 0,
                  IDelFlag: 0
                });
              }
            }

            // alert(data.cntctList.length)
            if (data.cntctList.length > 0) {
              //getng emp cntct detl
              for (var i = 0; i < data.cntctList.length; i++) {
                this.shrd_cntct.contactList.push({
                  id: 0,
                  contactType: data.cntctList[i].teleTypeCd,
                  countryCode: data.cntctList[i].cntryCd,
                  contactNumber: data.cntctList[i].teleNo,
                  mobileNumber: "",
                  contactDetailCode: 0,
                  status: 0,
                  IDelFlag: 0
                });
              }
            }

            //geting emp eml detl
            for (var i = 0; i < data.emlList.length; i++) {
              this.shrd_cntct.emailList.push({
                contactDetailCode: 0,
                id: 0,
                type: data.emlList[i].emailTypeCd,
                status: 0,
                email: data.emlList[i].emailAddrss,
                IDelFlag: 0
              });
            }

            //geting skil list
            this.empSkillList = data.skilList;
            //getng qualification list
            this.empDegreeList = data.qlfctnList;
            //getng psd list
            this.empOrgList = data.psdList;

            this.app.hideSpinner();
          }
        });
    }
  }

  //function for get all saved job types
  getJobType() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getJobType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.jobTypeList = data;
      });
  }

  //function for get all saved district
  getDistrict() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getDistrict", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.districtList.push({
            label: data[i].districtName,
            value: data[i].districtCd
          });
        }
      });
  }

  //function for get all saved province
  getProvince() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getProvince", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.provinceList.push({
            label: data[i].prvinceName,
            value: data[i].prvncCd
          });
        }
      });
  }

  //function for get all saved countrys
  getCountry() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCountry", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.countryListForAddress.push({
            label: data[i].cntryName,
            value: data[i].cntryCd.trim()
          });

          this.countryList.push({
            label: data[i].cntryName + " " + data[i].cntryCallingCd,
            value: data[i].cntryCallingCd
          });
        }
      });
  }

  //function for get all saved address types
  getAddressTypes() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getAddressType", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.addressType.push({
            label: data[i].addressTypeName,
            value: data[i].addressTypeCd
          });
        }
      });
  }

  //function for get all saved telephone types
  getContactTypes() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getTelephoneType", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.contactType.push({
            label: data[i].teleTypeName,
            value: data[i].teleTypeCd
          });
        }
      });
  }

  //function for get all saved email types
  getEmailTypes() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getEmailType", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.emailType.push({
            label: data[i].emailTypeName,
            value: data[i].emailTypeCd
          });
        }
      });
  }

  //Function for add previous service detail
  addPSD() {
    var myDate = new Date();

    if (this.empPost == undefined || this.empPost.trim() == "") {
      this.toastr.errorToastr("Please enter post", "Error", {
        toastTimeout: 2500
      });
      return false;
    }
    // else if (this.ddlOrg == undefined || this.ddlOrg == "" ) {
    //     this.toastr.errorToastr('Please select organization', 'Error', { toastTimeout: (2500) });
    //     return false;
    // }
    else if (this.ddlExperience == undefined || this.ddlExperience == "") {
      this.toastr.errorToastr("Please select experience", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (
      this.orgStartDate == undefined ||
      this.orgStartDate == "" ||
      this.orgStartDate == null
    ) {
      this.toastr.errorToastr("Please enter job start date", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (
      this.orgEndDate == undefined ||
      this.orgEndDate == "" ||
      this.orgEndDate == null
    ) {
      this.toastr.errorToastr("please enter job end date", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.orgStartDate >= this.orgEndDate) {
      this.toastr.errorToastr("Invalid job start date", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.orgEndDate > myDate) {
      this.toastr.errorToastr("Invalid job end date", "Error", {
        toastTimeout: 2500
      });
      return false;
    }
    if (this.desigId == undefined || this.desigId == "" || this.desigId == 0) {
      this.toastr.errorToastr("Invalid Job Designation", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      var duplicateChk = false;

      for (var i = 0; i < this.empOrgList.length; i++) {
        if (
          this.empOrgList[i].desigRmrks.toUpperCase() ==
          this.empPost.trim().toUpperCase()
        ) {
          duplicateChk = true;
        }
      }

      if (duplicateChk == true) {
        this.toastr.errorToastr("Post already added", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else {
        var dataList = [];
        dataList = this.experienceList.filter(
          x => x.value == this.ddlExperience
        );

        this.empOrgList.push({
          indvdlID: this.empId,
          cmpnyID: this.cmpnyId, //-------this.ddlOrg,
          jobDesigID: this.desigId,
          startDt: this.orgStartDate,
          leavingDt: this.orgEndDate,
          desigRmrks: this.empPost.trim(),
          experienceTypeCd: dataList[0].qlfctnTypeCd,
          experienceCd: dataList[0].qlfctnCd,
          experienceCriteriaCd: this.ddlExperience,
          qlfctnCriteriaName: dataList[0].label
        });

        this.empPost = "";
        this.ddlExperience = "";
        this.orgStartDate = "";
        this.orgEndDate = "";
      }
    }
  }

  //Deleting previous service detail row
  removePSD(item) {
    this.empOrgList.splice(item, 1);
  }

  //Function for update employee previous service detail
  updatePSD() {
    if (this.empOrgList.length == 0) {
      this.toastr.errorToastr(
        "Please enter employee previous service detail",
        "Error",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.empId == undefined || this.empId == "") {
      this.toastr.errorToastr("Invalid Employee Information", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      this.app.showSpinner();
      //* ********************************************save data
      var updateData = {
        EmpID: this.empId,
        EmpPSDList: JSON.stringify(this.empOrgList),
        ConnectedUser: this.app.empId,
        DelFlag: 0
      };
      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/updatePSD", updateData, {
          headers: reqHeader
        })
        .subscribe((data: any) => {
          if (data.msg != "Record Updated Successfully!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500
            });
            this.clearPSD();
            return false;
          }
        });
    }
  }

  //Function for add employee skill detail
  addSkill() {
    if (this.ddlSkillGroup == undefined || this.ddlSkillGroup == "") {
      this.toastr.errorToastr("Please select skill group", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.ddlSkill == undefined || this.ddlSkill == "") {
      this.toastr.errorToastr("Please enter skill", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.empSkillLevel == undefined || this.empSkillLevel == "") {
      this.toastr.errorToastr("Please enter expertise", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      if (this.empSkillLevel == undefined || this.empSkillLevel == "") {
        this.empSkillLevel = 0;
      }

      if (this.empSkillRemarks == undefined || this.empSkillRemarks == "") {
        this.empSkillRemarks = "-";
      }

      var duplicateChk = false;

      for (var i = 0; i < this.empSkillList.length; i++) {
        if (
          this.empSkillList[i].skillCd == this.ddlSkillGroup &&
          this.empSkillList[i].skillsCriteriaCd == this.ddlSkill
        ) {
          duplicateChk = true;
        }
      }

      if (duplicateChk == true) {
        this.toastr.errorToastr("Skill already added", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else {
        var dataList = [];
        dataList = this.skillGroupList.filter(
          x => x.value == this.ddlSkillGroup
        );

        var dataList1 = [];
        dataList1 = this.skillList.filter(x => x.value == this.ddlSkill);

        this.empSkillList.push({
          indvdlID: this.empId,
          skillTypeCd: dataList[0].qlfctnTypeCd,
          skillCd: this.ddlSkillGroup,
          skillsCriteriaCd: this.ddlSkill,
          skillLvl: this.empSkillLevel,
          skillRmrks: this.empSkillRemarks,
          qlfctnName: dataList[0].label,
          qlfctnCriteriaName: dataList1[0].label
        });

        this.ddlSkillGroup = "";
        this.ddlSkill = "";
        this.empSkillLevel = "";
        this.empSkillRemarks = "";
      }
    }
  }

  //Deleting previous service detail row
  removeSkill(item) {
    this.empSkillList.splice(item, 1);
  }

  //Function for update employee skill detail
  updateSkills() {
    if (this.empSkillList.length == 0) {
      this.toastr.errorToastr("Please enter employee skills detail", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.empId == undefined || this.empId == "") {
      this.toastr.errorToastr("Invalid Employee Information", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      this.app.showSpinner();
      //* ********************************************save data
      var updateData = {
        EmpID: this.empId,
        EmpSkillList: JSON.stringify(this.empSkillList),
        ConnectedUser: this.app.empId,
        DelFlag: 0
      };
      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/updateSkill", updateData, {
          headers: reqHeader
        })
        .subscribe((data: any) => {
          if (data.msg != "Record Updated Successfully!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });

            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500
            });
            this.clearSkills();
            //$('#standardModal').modal('hide');
            //this.getPStandard();
            return false;
          }
        });
    }
  }

  //Function for add employee qualification detail
  addQualification() {
    if (this.ddlDegree == undefined || this.ddlDegree == "") {
      this.toastr.errorToastr("Please select degree", "Error", { toastTimeout: 2500 });
      return false;
    } else if (
      this.empInstitute == undefined ||
      this.empInstitute.trim() == ""
    ) {
      this.toastr.errorToastr("Please enter institute/campus", "Error", { toastTimeout: 2500 });
      return false;
    } else if (
      this.empDegreeYear == undefined || this.empDegreeYear == "" || this.empDegreeYear == null
    ) {
      this.toastr.errorToastr("Please enter passing year", "Error", { toastTimeout: 2500 });
      return false;
    }
    // else if (this.ddlGrade == undefined || this.ddlGrade == "") {
    //     this.toastr.errorToastr('Please enter grade', 'Error', { toastTimeout: (2500) });
    //     return false;
    // }
    else if (this.ddlDivision == undefined || this.ddlDivision == "") {
      this.toastr.errorToastr("Please enter division", "Error", { toastTimeout: 2500 });
      return false;
    }
    // else if (this.empId == undefined || this.empId == 0) {
    //     this.toastr.errorToastr('Invalid Employee Information', 'Error', { toastTimeout: (2500) });
    //     return false;
    // }
    else {
      var myDate = new Date();
      var crntYear = myDate.getFullYear();

      myDate = new Date(this.empDegreeYear);

      var usrYear = myDate.getFullYear();

      if (usrYear > crntYear) {
        this.toastr.errorToastr("Invalid passing year", "Error", {
          toastTimeout: 2500
        });
        return false;
      }

      var duplicateChk = false;

      for (var i = 0; i < this.empDegreeList.length; i++) {
        if (this.empDegreeList[i].educationCriteriaCd == this.ddlDegree) {
          duplicateChk = true;
        }
      }

      if (duplicateChk == true) {
        this.toastr.errorToastr("Degree already added", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else {
        var dataList = [];
        dataList = this.degreeList.filter(x => x.value == this.ddlDegree);

        this.empDegreeList.push({
          EmpID: this.empId,
          indvdlID: this.empId,
          tBDProgramTitle: null,
          pssngDt: this.empDegreeYear,
          totMrks: 0,
          mrksObtnd: 0,
          grade: null, //this.ddlGrade,
          divIsion: this.ddlDivision,
          startDt: null,
          campusName: this.empInstitute,
          educationalInstituteID: this.app.cmpnyId, //--------------------------------------
          majorSbjcts: null,
          profileTypeCd: 2,
          educationTypeCd: dataList[0].qlfctnTypeCd,
          educationCd: dataList[0].qlfctnCd,
          educationCriteriaCd: this.ddlDegree,
          qlfctnCriteriaName: dataList[0].label
        });

        this.ddlDegree = "";
        this.empInstitute = "";
        this.empDegreeYear = "";
        this.ddlGrade = "";
        this.ddlDivision = "";
      }
    }
  }

  //Deleting qualification detail row
  removeQualification(item) {
    this.empDegreeList.splice(item, 1);
  }

  //Function for update employee qualification detail
  updateQualification() {
    if (this.empDegreeList.length == 0) {
      this.toastr.errorToastr(
        "Please enter employee qualification detail",
        "Error",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.empId == undefined || this.empId == "") {
      this.toastr.errorToastr("Invalid Employee Information", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      this.app.showSpinner();
      //* ********************************************save data
      var updateData = {
        EmpID: this.empId,
        EmpQualificationList: JSON.stringify(this.empDegreeList),
        ConnectedUser: this.app.empId,
        DelFlag: 0
      };
      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/updateQualification", updateData, {
          headers: reqHeader
        })
        .subscribe((data: any) => {
          if (data.msg != "Record Updated Successfully!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500
            });
            this.clearQualification();
            return false;
          }
        });
    }
  }

  //function for edit existing employee type
  edit(item) {
    this.clearAll();
    this.editMod = true;
    this.branch = item.jobPostLocationCd;
    this.getDepartment(item.jobPostLocationCd);
    this.sectionList = [];
    if (item.managerJobPostDeptCd == 0) {
      this.getSection(item.jobPostDeptCd);
    } else {
      this.getSection(item.managerJobPostDeptCd);
    }
    this.disabled = false;
    this.updateFlag = true;
    this.empHeading = "Edit";
    this.empId = item.empID;
    this.desigId = item.jobDesigID;
    this.deptId = item.jobPostDeptCd;
    this.locationId = item.jobPostLocationCd;
    this.cmpnyId = item.cmpnyID;

    //tab 1 fields
    this.firstName = item.indvdlFirstName;
    this.midName = item.indvdlMidName;
    this.lastName = item.indvdlLastName;
    this.fullName = item.indvdlFullName;
    //this.fhName = item.indvdlFatherName;
    this.CNIC = item.indvdlCNIC;

    //tab 2 fields
    this.lblJobTitle = item.jobDesigName;
    this.lblBPS = item.payGradeName;
    this.jobPost = item.jobDesigID;
    this.jobType = item.jobTypeCd;

    if (item.path == null) {
      this.imageUrl = "../assets/images/EmpImages/dropHereImg1.jpg";
    } else {
      this.imageUrl = "../assets/images/EmpImages/" + item.empID + ".jpg";
    }

    //this.renewalFrom = "";
    //this.contractEnd = "";

    //this.lblOffice = item.locationName;
    //this.lblDepartment = item.deptName;
    //this.lblJobType = item.jobTypeName;
    //this.lblContract = "contract";

    if (item.jobTypeCd == "1") {
      this.joiningDate = new Date(item.empJobStartDt);
      this.appliedDate = new Date(item.empJobAppntmntDt);
    } else {
      this.contractFrom = new Date(item.empJobStartDt);
      if (item.empJobLastDt == null) {
        this.contractEnd = item.empJobLastDt;
      } else {
        this.contractEnd = new Date(item.empJobLastDt);
      }
    }

    if (item.managerJobPostDeptCd == 0) {
      this.department = item.jobPostDeptCd;
    } else {
      this.department = item.managerJobPostDeptCd;
      this.section = item.jobPostDeptCd;
    }
    //alert(item.jobDesigID);
    //
    // alert(item.jobPostLocationCd);
    //
    // alert(item.managerJobPostLocationCd);

    // if(this.lblJobType.toUpperCase() == 'REGULAR'){
    //     this.lblRetirementDate = new Date(this.lblAppointmentDate.getFullYear() + 60, this.lblAppointmentDate.getMonth(), this.lblAppointmentDate.getDay());
    // }

    //this.getFilterItem("facility");

    this.getSpecificEmployeeData();
  }

  clearAll() {
    this.empHeading = "Add";
    this.empId = 0;
    this.desigId = 0;
    this.deptId = 0;
    this.locationId = 0;
    this.cmpnyId = 0;
    this.disabled = true;

    this.clearEmp();
    this.clearQualification();
    this.clearSkills();
    this.clearPSD();
    this.clearJobProfile();
  }

  clearEmp() {
    this.firstName = "";
    this.midName = "";
    this.lastName = "";
    this.CNIC = "";
    this.imgFile = undefined;
    this.image = undefined;
    this.selectedFile = null;
    this.imageUrl = "../assets/images/EmpImages/dropHereImg1.jpg";

    this.shrd_adrs.addressList = [];
    this.shrd_cntct.contactList = [];
    this.shrd_cntct.emailList = [];
  }

  clearQualification() {
    this.empDegreeList = [];
  }

  clearSkills() {
    this.empSkillList = [];
  }

  clearPSD() {
    this.empOrgList = [];
  }

  clearJobProfile() {
    this.deptId = 0;
    this.locationId = 0;

    this.lblOffice = "";
    this.lblDepartment = "";
    this.lblAppointmentDate = "";
    this.lblJobType = "";
    this.lblRetirementDate = "";
    this.lblContract = "";

    this.branch = "";
    this.department = "";
    this.section = "";
    this.jobPost = "";
    this.jobType = "";
    this.lblJobTitle = "";
    this.lblBPS = "";
    this.joiningDate = "";
    this.appliedDate = "";
    this.contractFrom = "";
    this.contractEnd = "";

    this.tempJobList = this.postList;
    this.departmentList = [];
    this.sectionList = [];
  }

  //Function for update employee personal info
  updateEmpPersonalInfo() {
    // this.toastr.errorToastr('Please enter complete information', 'Error', { toastTimeout: (2500) });
    // return false;

    if (this.firstName == undefined || this.firstName.trim() == "") {
      this.toastr.errorToastr("Please enter first name", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.lastName == undefined || this.lastName.trim() == "") {
      this.toastr.errorToastr("Please enter last name", "Error", {
        toastTimeout: 2500
      });
      return false;
    }
    // else if (this.fhName == undefined || this.fhName.trim() == "") {
    //     this.toastr.errorToastr('Please enter father/husband name', 'Error', { toastTimeout: (2500) });
    //     return false;
    // }
    else if (this.CNIC == undefined || this.CNIC == "") {
      this.toastr.errorToastr("Please enter cnic", "Error", {
        toastTimeout: 2500
      });
      return false;
    }
    // else if (this.religion == undefined || this.religion.trim() == "") {
    //     this.toastr.errorToastr('Please enter religion', 'Error', { toastTimeout: (2500) });
    //     return false;
    // }
    else if (this.shrd_adrs.addressList.length == 0) {
      this.toastr.errorToastr("Please enter employee address", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.shrd_cntct.contactList.length == 0) {
      this.toastr.errorToastr("Please enter employee contact", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.shrd_cntct.emailList.length == 0) {
      this.toastr.errorToastr("Please enter employee email", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      if (this.midName == undefined || this.midName.trim() == "") {
        this.midName = null;
      }

      var imgPath = null;
      if (this.image != undefined) {
        imgPath = this.imgPath;
      }

      if (this.empId == undefined || this.empId == "") {
        this.app.showSpinner();
        //* ********************************************save data
        var saveData = {
          EmpID: 0,
          IndvdlFirstName: this.firstName.trim(),
          IndvdlMidName: this.midName,
          IndvdlLastName: this.lastName,
          IndvdlFullName: this.fullName,
          IndvdlCNIC: this.CNIC,
          CmpnyID: this.app.cmpnyId,
          IndvdlFatherName: null, //this.fhName
          addressList: JSON.stringify(this.shrd_adrs.addressList),
          contactList: JSON.stringify(this.shrd_cntct.contactList),
          emailList: JSON.stringify(this.shrd_cntct.emailList),
          file: this.image,
          path: imgPath,
          ConnectedUser: this.app.empId,
          DelFlag: 0
        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http
          .post(this.serverUrl + "api/updateEmpPersonalInfo", saveData, {
            headers: reqHeader
          })
          .subscribe((data: any) => {
            if (data.msg == "Record Saved Successfully!") {
              this.app.hideSpinner();
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500
              });
              this.empId = parseInt(data.id);
              this.cmpnyId = parseInt(data.cmpId);
              this.disabled = false;
              this.clearEmp();
              this.getNewEmployee();
              return false;
            } else {
              this.app.hideSpinner();
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 5000
              });
              return false;
            }
          });
      } else {
        this.app.showSpinner();
        //* ********************************************save data
        var updateData = {
          EmpID: this.empId,
          IndvdlFirstName: this.firstName.trim(),
          IndvdlMidName: this.midName,
          IndvdlLastName: this.lastName,
          IndvdlFullName: this.fullName,
          IndvdlCNIC: this.CNIC,
          CmpnyID: this.app.cmpnyId,
          IndvdlFatherName: null, //this.fhName
          addressList: JSON.stringify(this.shrd_adrs.addressList),
          contactList: JSON.stringify(this.shrd_cntct.contactList),
          emailList: JSON.stringify(this.shrd_cntct.emailList),
          file: this.image,
          path: imgPath,
          ConnectedUser: this.app.empId,
          DelFlag: 0
        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http
          .post(this.serverUrl + "api/updateEmpPersonalInfo", updateData, {
            headers: reqHeader
          })
          .subscribe((data: any) => {
            if (data.msg != "Record Updated Successfully!") {
              this.app.hideSpinner();
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 5000
              });
              return false;
            } else {
              this.app.hideSpinner();
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500
              });
              this.clearEmp();
              this.getNewEmployee();
              return false;
            }
          });
      }
    }
  }

  delete(item) {
    if (this.app.pin != "") {
      this.app.showSpinner();
      //* ********************************************save data
      var delData = {
        EmpID: item.empID,
        IndvdlFirstName: null,
        IndvdlMidName: null,
        IndvdlLastName: null,
        IndvdlFullName: null,
        IndvdlCNIC: null,
        CmpnyID: this.app.cmpnyId,
        IndvdlFatherName: null, //this.fhName
        addressList: JSON.stringify(this.shrd_adrs.addressList),
        contactList: JSON.stringify(this.shrd_cntct.contactList),
        emailList: JSON.stringify(this.shrd_cntct.emailList),
        file: null,
        path: null,
        ConnectedUser: this.app.empId,
        DelFlag: 1
      };

      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/updateEmpPersonalInfo", delData, {
          headers: reqHeader
        })
        .subscribe((data: any) => {
          if (data.msg == "Record Deleted Successfully!") {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500
            });
            this.clearEmp;
            this.getNewEmployee();
            this.app.pin = "";
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

  //Function for update employee job profile
  updateProfile() {
    // this.toastr.errorToastr('Enter Complete Information', 'Error', { toastTimeout: (2500) });
    // return false;

    if (
      this.jobPost == "" ||
      this.jobPost == null ||
      this.jobPost == undefined
    ) {
      this.toastr.errorToastr("Please select job profile", "Error", {
        toastTimeout: 2500
      });
      return false;
    }
    if (
      this.jobType == "" ||
      this.jobType == null ||
      this.jobType == undefined
    ) {
      this.toastr.errorToastr("Please select job type", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (
      this.jobType == "1" &&
      (this.appliedDate == undefined ||
        this.appliedDate == "" ||
        this.appliedDate == null)
    ) {
      this.toastr.errorToastr("Please enter applied date", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (
      this.jobType == "1" &&
      (this.joiningDate == undefined ||
        this.joiningDate == "" ||
        this.joiningDate == null)
    ) {
      this.toastr.errorToastr("Please enter joining date", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (
      this.jobType != "1" &&
      (this.contractFrom == undefined ||
        this.contractFrom == "" ||
        this.contractFrom == null)
    ) {
      this.toastr.errorToastr("Please enter contract start date", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (
      this.jobType != "1" &&
      (this.contractEnd == undefined ||
        this.contractEnd == "" ||
        this.contractEnd == null)
    ) {
      this.toastr.errorToastr("Please enter contract end date", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.empId == undefined || this.empId == "") {
      this.toastr.errorToastr("Invalid Employee Information", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      var appDt = null,
        startDt = null,
        endDt = null;

      if (this.jobType == "1") {
        appDt = this.appliedDate;
        startDt = this.joiningDate;
      } else {
        appDt = this.contractFrom;
        startDt = this.contractFrom;
        endDt = this.contractEnd;
      }

      // alert(appDt);
      // alert(startDt);
      // alert(endDt);
      //return false;

      this.app.showSpinner();

      //* ********************************************save data
      var updateData = {
        EmpID: this.empId,
        JobDesigID: this.desigId,
        JobPostDeptCd: this.deptId,
        JobPostLocationCd: this.locationId,
        EmpJobAppntmntDt: appDt,
        EmpJobStartDt: startDt,
        EmpJobLastDt: endDt,
        JobTypeCd: this.jobType,
        ConnectedUser: this.app.empId,
        DelFlag: 0
      };

      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/updateEmpJobProfile", updateData, {
          headers: reqHeader
        })
        .subscribe((data: any) => {
          if (
            data.msg == "Record Updated Successfully!" ||
            data.msg == "Record Saved Successfully!"
          ) {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500
            });
            this.getNewEmployee();
            this.clearJobProfile();
            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          }
        });
    }
  }

  //function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  //function for get filtere list from job post
  getFilterItem(filterOption) {
    //if(this.jobTitle != null){
    //alert(this.jobTitle);
    //}

    var dataList = [];

    //filter for job post
    if (filterOption == "jobs") {
      dataList = this.postList.filter(x => x.jobDesigID == this.jobPost);

      this.desigId = dataList[0].jobDesigID;
      this.deptId = dataList[0].jobPostDeptCd;
      this.locationId = dataList[0].jobPostLocationCd;
      this.lblJobTitle = dataList[0].desigName;
      this.lblBPS = dataList[0].payGradeName;
    }

    //filter for generate skill list
    if (filterOption == "skill") {
      dataList = this.tempQualificationCriteriaList.filter(
        x => x.qlfctnCd == this.ddlSkillGroup
      );
      this.skillList = [];
      this.ddlSkill = "";

      for (var i = 0; i < dataList.length; i++) {
        this.skillList.push({
          label: dataList[i].qlfctnCriteriaName,
          value: dataList[i].qlfctnCriteriaCd
        });
      }
    }

    //filter for facility
    if (filterOption == "facility") {
      this.empFacilityList = [];
      dataList = this.allFacilityList.filter(
        x =>
          x.jobDesigID == this.desigId &&
          x.jobPostDeptCd == this.deptId &&
          x.jobPostLocationCd == this.locationId
      );

      for (var i = 0; i < dataList.length; i++) {
        this.empFacilityList.push({
          facilityName: dataList[i].facilityName
        });
      }
    }

    if (filterOption == "filterbranch") {
      dataList = this.postList.filter(x => x.jobPostLocationCd == this.branch);
      this.tempJobList = dataList;

      //this.srchPostFrom = '';
      this.jobPost = "";
    }

    if (filterOption == "filterdepart") {
      dataList = this.postList.filter(
        x =>
          x.jobPostLocationCd == this.branch &&
          x.jobPostDeptCd == this.department
      );
      this.tempJobList = dataList;

      //this.srchPostFrom = '';
      this.jobPost = "";
    }

    if (filterOption == "filtersection") {
      dataList = this.postList.filter(
        x =>
          x.jobPostLocationCd == this.branch &&
          x.jobPostDeptCd == this.section &&
          x.managerJobPostLocationCd == this.branch &&
          x.managerJobPostDeptCd == this.department
      );
      this.tempJobList = dataList;

      //this.srchPostFrom = '';
      this.jobPost = "";
    }
  }

  //function for generate employee full name
  generateFullName() {
    if (this.firstName == undefined) {
      this.fullName = "";
    }
    if (this.midName == undefined) {
      this.midName = " ";
    }
    if (this.lastName == undefined) {
      this.lastName = "";
    }
    this.fullName =
      this.firstName.trim() +
      " " +
      this.midName.trim() +
      " " +
      this.lastName.trim();
  }

  //function for email validation
  isEmail(email) {
    return this.app.validateEmail(email);
  }
}
