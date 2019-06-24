import { Component, OnInit } from '@angular/core';
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
  eventDate = "";
  startTime = "";
  endTime = "";
  eventType = "";
  eventTypeList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient
  ) { }

  ngOnInit() {

    this.events = [
      {
          "title": "All Day Event",
          "start": "2019-06-01",
          "color": "purple"
      },
      {
          "title": "Long Event",
          "start": "2019-06-07",
          "end": "2019-06-10",
          "color": "green"
      },
      {
          "title": "Repeating Event",
          "start": "2019-06-09T16:00:00"
      },
      {
          "title": "Repeating Event",
          "start": "2019-06-16T16:00:00",
          "color": "brown"
      },
      {
          "title": "Conference",
          "start": "2019-06-11",
          "end": "2019-06-13",
      }
    ];
    
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
          text: 'Add Event',
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

  saveEvent(){
    
    if (this.eventDate == '') {
      this.toastr.errorToastr('Please select Event Date', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.startTime == '') {
      this.toastr.errorToastr('Please Select Start Time', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.endTime == '') {
      this.toastr.errorToastr('Please Select End Time', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.eventType == '') {
      this.toastr.errorToastr('Please Select Event Type', 'Error', { toastTimeout: (2500) });
      return;
    }  else if (this.txtRemarks == '') {
      this.toastr.errorToastr('Please Enter Remarks', 'Error', { toastTimeout: (2500) });
      return;
    } else {
      
      var saveData = {
        eventDate: this.eventDate,
        startTime: this.startTime,
        endTime: this.endTime,
        eventType: this.eventType,
        remarks: this.txtRemarks,
      };

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(this.serverUrl + 'api/saveEvent', saveData, { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg == "Record Saved Successfully!") {
          this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
          this.clear();
          //this.app.hideSpinner();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
          //$('#companyModal').modal('hide');
          //this.app.hideSpinner();
          return false;
        }
      });

    }
  }

  clear(){

    this.eventDate = "";
    this.startTime = "";
    this.endTime = "";
    this.eventType = "";
    this.txtRemarks = "";
  }
}
