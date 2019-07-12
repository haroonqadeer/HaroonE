import { DatePipe } from '@angular/common';
import { Component, OnInit,  } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';

declare var $: any;

@Component({
  selector: 'app-yearcalendar',
  templateUrl: './yearcalendar.component.html',
  styleUrls: ['./yearcalendar.component.scss']
})
export class YearcalendarComponent implements OnInit {

  serverUrl = "http://localhost:3007/";

  events: any[];
  options: any;

  txtRemarks = "";
  cmbHoliday = "";
  eventDate = "";
  startTime = "";
  endTime = "";
  eventType = "";

  affectDate="";
  Monday = '';
  Tuesday = '';
  Wednesday = '';
  Thursday = '';
  Friday = '';
  Saturday = '';
  Sunday = '';

  eventTypeList = [];
  holidayList = [];

  cmbHolidayList = [
    {
      value:'1',
      label:'Kashmir Day'
    },{
      value:'2',
      label:'Pakistan Day'
    },{
      value:'3',
      label:'Labour Day'
    },{
      value:'4',
      label:'Independence Day'
    },{
      value:'5',
      label:'Defence Day'
    },{
      value:'6',
      label:'Iqbal Day'
    },{
      value:'7',
      label:'Quaid Day'
    },
  ];

  constructor(
    private toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient
  ) { }

  ngOnInit() {

    this.getHolidays();
    this.getEvents();
    
    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapPlugin],
      defaultDate: '2019-06-01',
      eventTextColor: "white",
      // dayTextColor:"black",
      // editable: true,
      // defaultView:'dayGridFourDay',
      selectable: true,
      selectHelper: true,
      customButtons: {
        addEvent: {
          text: 'Add Holidays',
          click: function () {
            $('#eventModal').modal('show');
          }
        },
        generateCalender: {
          text: 'Generate Calendar',
          click: function () {
            $('#calendarModal').modal('show');
          }
        },
      },
      header: {
        left: 'prev,next, today, addEvent, generateCalender',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      buttonIcons: {
        prev: 'left-single-arrow',
        next: 'right-single-arrow'
      },
      themeSystem: 'bootstrap'
      // eventLimit: true,
    };
  }

  getHolidays(){

    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getHolidays', { headers: reqHeader }).subscribe((data: any) => {

      this.holidayList = data;

      this.app.hideSpinner();
    });
  }
  
  getEvents(){
    
    this.app.showSpinner();

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get(this.serverUrl + 'api/getEvents', { headers: reqHeader }).subscribe((data: any) => {
      
      this.events = data;

      this.app.hideSpinner();
    });
  }

  convertDate(myDate) {

    var oldDate = new Date(myDate);
    var d = oldDate.getDate();
    var m = oldDate.getMonth();
    m += 1;  // JavaScript months are 0-11
    var y = oldDate.getFullYear();

    var convertedDate = d + "-" + m + "-" + y;

    return convertedDate;
  }

  saveCalender(){

    if(this.affectDate == ""){
      this.toastr.errorToastr('Please Select Affect Date!', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.Monday == '' &&
        this.Tuesday == '' &&
        this.Wednesday == '' &&
        this.Thursday == '' &&
        this.Friday == '' &&
        this.Saturday == '' &&
        this.Sunday == '') {
      this.toastr.errorToastr('Please Select Weekend!', 'Error', { toastTimeout: (2500) });
      return;
    // }  
    // else if (this.txtRemarks == '') {
    //   this.toastr.errorToastr('Please Enter Remarks', 'Error', { toastTimeout: (2500) });
    //   return false;
    }else{
      
      this.app.showSpinner();

      var saveData = {
        monday: this.Monday,
        tuesday: this.Tuesday,
        wednesday: this.Wednesday,
        thursday: this.Thursday,
        friday: this.Friday,
        saturday: this.Saturday,
        sunday: this.Sunday,
        affectDate: this.affectDate
      };

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(this.serverUrl + 'api/saveCalendar', saveData, { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg == "Record Saved Successfully!") {
          this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
          this.clear();
          this.getEvents();
          $('#calendarModal').modal('hide');
          this.app.hideSpinner();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
          //$('#companyModal').modal('hide');
          this.app.hideSpinner();
          return false;
        }
      });

    }
  }

  saveEvent(){
    
    for(var i=0; i<this.holidayList.length;i++){
      // alert(this.convertDate(this.holidayList[i].eventDate) + ' - ' + this.convertDate(this.eventDate));
      if(this.holidayList[i].holiday == this.cmbHoliday && this.convertDate(this.holidayList[i].eventDate) == this.convertDate(this.eventDate)){
        this.toastr.errorToastr('Holiday Already Saved!', 'Error', { toastTimeout: (2500) });
        return;
      }
    }
    
    if (this.eventDate == '') {
      this.toastr.errorToastr('Please Select Event Date', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.cmbHoliday == '') {
      this.toastr.errorToastr('Please Select Holiday', 'Error', { toastTimeout: (2500) });
      return;
    } else {
      
      this.app.showSpinner();

      var saveData = {
        eventDate: this.eventDate,
        holiday: this.cmbHoliday,
      };

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(this.serverUrl + 'api/saveHoliday', saveData, { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg == "Record Saved Successfully!") {
          this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
          this.getHolidays();
          this.getEvents();
          this.clear();
          this.app.hideSpinner();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
          //$('#companyModal').modal('hide');
          this.app.hideSpinner();
          return false;
        }
      });

    }
  }

  clear(){

    this.eventDate = "";
    this.cmbHoliday = "";
  }
}
