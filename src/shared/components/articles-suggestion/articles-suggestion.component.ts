import { Component, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { ArticulosPublicosService } from 'src/shared/services/articulospublicos.service';
import { Ln } from 'src/shared/services/language.service';

@Component({
  selector: 'app-articles-suggestion',
  templateUrl: './articles-suggestion.component.html',
  styleUrls: ['./articles-suggestion.component.scss',
    '../home-suggestions/home-suggestions.component.scss']
})
export class ArticlesSuggestionComponent implements OnInit {

  articulospublicos = [];
  routeFicheros = ENV.HOST_STORAGE;
  pathFicheros = '/articulospublicos%2F';

  constructor(
    public ln: Ln,
    private articulosPublicosService: ArticulosPublicosService,
  ) { }

  ngOnInit(): void {
    this.getArticulosPublicos();
  }

  getArticulosPublicos() {
    this.articulosPublicosService.getArticulosPublicos(this.ln.gln()).then((res: any) => {
      console.log(res.data)
      this.articulospublicos = res.data;
    });
  }

  goToSite(slug) {
    const path = this.ln.gln() === 'ES' ? 'articulo' : 'article';
    window.open("http://site.connectus.global/" + path + "/" + slug, '_blank')
  }

}
