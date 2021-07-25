import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-feed-home',
  templateUrl: './feed-home.component.html',
  styleUrls: ['./feed-home.component.scss']
})
export class FeedHomeComponent implements OnInit {

  publishText = '';

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit(): void {
  }

}
