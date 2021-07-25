import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-people',
  templateUrl: './message-people.component.html',
  styleUrls: ['./message-people.component.scss']
})
export class MessagePeopleComponent implements OnInit {

  @Input() right = false;

  constructor() { }

  ngOnInit(): void {
  }

}
