import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit(): void {
  }

}
