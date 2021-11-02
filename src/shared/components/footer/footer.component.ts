import { Component, OnInit } from '@angular/core';
import { Ln } from 'src/shared/services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public ln: Ln
  ) { }

  ngOnInit(): void {
  }

}
