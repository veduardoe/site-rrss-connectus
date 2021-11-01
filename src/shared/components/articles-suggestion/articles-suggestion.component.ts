import { Component, OnInit } from '@angular/core';
import { Ln } from 'src/shared/services/language.service';

@Component({
  selector: 'app-articles-suggestion',
  templateUrl: './articles-suggestion.component.html',
  styleUrls: ['./articles-suggestion.component.scss',
              '../home-suggestions/home-suggestions.component.scss']
})
export class ArticlesSuggestionComponent implements OnInit {

  constructor(
    public ln:Ln
  ) { }

  ngOnInit(): void {
  }

}
