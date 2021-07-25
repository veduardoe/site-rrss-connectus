import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from 'src/shared/services/fadeAnimation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeAnimation]

})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
