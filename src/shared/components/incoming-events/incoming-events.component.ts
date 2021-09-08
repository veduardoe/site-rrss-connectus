import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-incoming-events',
  templateUrl: './incoming-events.component.html',
  styleUrls: ['./incoming-events.component.scss',
  '../home-suggestions/home-suggestions.component.scss']
})
export class IncomingEventsComponent implements OnInit {

  @Input() limit = 4;
  @Input() eventos = [];
  @Input() fromHome = true;
  
  constructor() { }

  ngOnInit(): void {
  }

}
