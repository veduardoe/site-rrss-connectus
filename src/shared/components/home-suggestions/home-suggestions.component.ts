import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-suggestions',
  templateUrl: './home-suggestions.component.html',
  styleUrls: ['./home-suggestions.component.scss']
})
export class HomeSuggestionsComponent implements OnInit {
  @Input() limit = 5;
  
  constructor() { }

  ngOnInit(): void {
  }

}
