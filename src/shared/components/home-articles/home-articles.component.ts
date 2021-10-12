import { Component, Input, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-home-articles',
  templateUrl: './home-articles.component.html',
  styleUrls: ['./home-articles.component.scss']
})
export class HomeArticlesComponent implements OnInit {

  routeFicheros = ENV.HOST_STORAGE;
  pathFicheros = '/articulospublicos%2F'
  @Input() articulospublicos = [];

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit(): void {
  }

  goToSite(slug){
    window.open("http://site.connectus.global/article/" + slug, '_blank')
  }

}
