import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit {

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit(): void {
  }

}
