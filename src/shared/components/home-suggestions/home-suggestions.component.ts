import { Component, Input, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';

@Component({
  selector: 'app-home-suggestions',
  templateUrl: './home-suggestions.component.html',
  styleUrls: ['./home-suggestions.component.scss']
})
export class HomeSuggestionsComponent implements OnInit {

  @Input() limit = 5;
  @Input() data:any;
  @Input() titleCard = '';
  routeFotoPerfil = ENV.FOTOS_PERFIL;

  constructor() { }

  ngOnInit(): void {
  }

}
