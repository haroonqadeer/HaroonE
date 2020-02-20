import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";

declare var $: any;
declare var gapi: any;

@Component({
  selector: "app-yearcalendar",
  templateUrl: "./yearcalendar.component.html",
  styleUrls: ["./yearcalendar.component.scss"]
})
export class YearcalendarComponent implements OnInit {
  // Client ID and API key from the Developer Console
  CLIENT_ID =
    "665834675648-liuqhc13bk0lcg0shrduhorbig5ddifo.apps.googleusercontent.com";
  clientSecret = "YV64hY-0ssEw13MOan9LBfkr";
  api_Key = "AIzaSyAsHi8NE9SF4vfID2SstAIcamHwLTqu3YQ";

  // Array of API discovery doc URLs for APIs used by the quickstart
  DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  authorizeButton = document.getElementById("authorize_button");
  signoutButton = document.getElementById("signout_button");

  constructor() {}

  ngOnInit() {
    this.handleClientLoad();
  }

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  handleClientLoad() {
    gapi.load("client:auth2", this.initClient);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  // Initialize the Google API client with desired scopes
  initClient() {
    gapi.client
      .init({
        apiKey: this.api_Key,
        clientId: this.CLIENT_ID,
        discoveryDocs: this.DISCOVERY_DOCS,
        scope: this.SCOPES
      })
      .then(
        function() {
          // Listen for sign-in state changes.
          gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen(this.updateSigninStatus);

          // Handle the initial sign-in state.
          this.updateSigninStatus(
            gapi.auth2.getAuthInstance().isSignedIn.get()
          );
          this.authorizeButton.onclick = this.handleAuthClick;
          this.signoutButton.onclick = this.handleSignoutClick;
        },
        function(error) {
          this.appendPre(JSON.stringify(error, null, 2));
        }
      );
  }
  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      this.authorizeButton.style.display = "none";
      this.signoutButton.style.display = "block";
      this.listUpcomingEvents();
    } else {
      this.authorizeButton.style.display = "block";
      this.signoutButton.style.display = "none";
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *
   * @param {string} message Text to be placed in pre element.
   */
  appendPre(message) {
    var pre = document.getElementById("content");
    var textContent = document.createTextNode(message + "\n");
    pre.appendChild(textContent);
  }

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  listUpcomingEvents() {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime"
      })
      .then(function(response) {
        var events = response.result.items;
        this.appendPre("Upcoming events:");

        if (events.length > 0) {
          for (var i = 0; i < events.length; i++) {
            var event = events[i];
            var when = event.start.dateTime;
            if (!when) {
              when = event.start.date;
            }
            this.appendPre(event.summary + " (" + when + ")");
          }
        } else {
          this.appendPre("No upcoming events found.");
        }
      });
  }
}
