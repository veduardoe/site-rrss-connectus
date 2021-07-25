import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-home-articles',
  templateUrl: './home-articles.component.html',
  styleUrls: ['./home-articles.component.scss']
})
export class HomeArticlesComponent implements OnInit {

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit(): void {
  }

}
