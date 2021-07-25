import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-page',
  templateUrl: './bar-page.component.html',
  styleUrls: ['./bar-page.component.scss']
})
export class BarPageComponent implements OnInit {

  @Input() namePage;

  constructor() { }

  ngOnInit(): void {
  }

}
