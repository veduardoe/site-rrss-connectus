import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-incoming-events',
  templateUrl: './incoming-events.component.html',
  styleUrls: ['./incoming-events.component.scss',
  '../home-suggestions/home-suggestions.component.scss']
})
export class IncomingEventsComponent implements OnInit {

  @Input() limit = 4;

  constructor() { }

  ngOnInit(): void {
  }

}
