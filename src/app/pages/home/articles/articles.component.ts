import { Component, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { CommonService } from 'src/shared/services/common.service';
import { PostsService } from 'src/shared/services/posts.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  articles = [];
  articlesFiltered = [];
  categorias = [];
  usuarioFromAuth;
  loading = false;
  p = 1;

  constructor(
    public utils: UtilsService,
    private postsService: PostsService,
    private authService: AuthService,
    private commonService: CommonService

  ) { }

  ngOnInit(): void {
    this.getArticles();
    this.getCategorias();
    this.usuarioFromAuth = this.authService.getAuthInfo();
  }

  getArticles() {
    this.loading = true;
    this.postsService.getPosts('true', 'ARTICLE').then((res: any) => {
      this.articles = this.utils.setLikesComments(res.data, this.usuarioFromAuth);
      this.articlesFiltered = JSON.parse(JSON.stringify(this.articles));
      this.loading = false;
    }).catch( err => { this.loading = false;});
  }

  getCategorias(){
    this.commonService.getCategorias().then( (res:any) => {
      this.categorias = res?.data;
    });
  }

  filterByCategory(e){
     const idCategoria = e.value;
     this.articlesFiltered = this.articles.filter( item => {
       return item.idCategoria === idCategoria || idCategoria === 'ALL';
     });
     this.p = 1;
  }
}
