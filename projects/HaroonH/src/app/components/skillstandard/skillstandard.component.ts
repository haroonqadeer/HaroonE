import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skillstandard',
  templateUrl: './skillstandard.component.html',
  styleUrls: ['./skillstandard.component.scss']
})
export class SkillstandardComponent implements OnInit {

  txtdPassword = '';
  txtdPin = '';

  //Page Models
  skillSearch = "";

  skills = [
    {
      skiId: 1,
      skiName: "Digital Marketing",
      skiJobProfile: 2
    },
    {
      skiId: 2,
      skiName: "Content Writing",
      skiJobProfile: 2
    },
    {
      skiId: 3,
      skiName: "SEO",
      skiJobProfile: 4
    },
    {
      skiId: 4,
      skiName: "MS SQL Server",
      skiJobProfile: 2
    },
    {
      skiId: 5,
      skiName: "C#",
      skiJobProfile: 3
    },
    {
      skiId: 6,
      skiName: "Angular JS",
      skiJobProfile: 3
    },
    {
      skiId: 7,
      skiName: "PHP",
      skiJobProfile: 2
    }
  ]
  constructor() { }

  ngOnInit() {
  }

}
