import { Component, OnInit } from '@angular/core';
import { Ln } from 'src/shared/services/language.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  constructor(
    public ln: Ln
  ) { }

  ngOnInit(): void {
  }

}
