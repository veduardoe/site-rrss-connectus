import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.scss',
'../../download-content/view-content/view-content.component.scss']
})
export class ViewArticleComponent implements OnInit {

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit(): void {
  }

}
