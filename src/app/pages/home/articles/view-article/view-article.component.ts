import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';
import { Ln } from 'src/shared/services/language.service';
import { PostsService } from 'src/shared/services/posts.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.scss',
'../../download-content/view-content/view-content.component.scss']
})
export class ViewArticleComponent implements OnInit {

  curView;
  loading = false;
  usuarioFromAuth;
  idPost;
  article;

  constructor(
    public utils:UtilsService,
    private aRouter: ActivatedRoute,
    private router: Router,
    private postsService: PostsService,
    private authService: AuthService,
    public ln: Ln
  ) {
      this.aRouter.queryParams.subscribe( param => {
        this.curView = param?.curView === 'view' ? 'view' : 'create';
        this.idPost = param?.id;
      });
   }

  ngOnInit(): void {
    this.usuarioFromAuth = this.authService.getAuthInfo();
    if(this.idPost){
      this.getArticle();
    }
  }

  getArticles(){
    this.utils.fnMessage(this.ln.o('ARTADDX'));
    this.router.navigate(['/home/articles']);
  }

  getArticle() {
    this.loading = true;
    this.postsService.getPosts('true', 'ARTICLE', this.idPost).then((res: any) => {
      if(res.data.length > 0){
        this.article = this.utils.setLikesComments(res.data, this.usuarioFromAuth)[0];
      }else{
        this.router.navigate(['/home/articles']);
      }
      this.loading = false;
    }).catch( err => { this.loading = false;});
  }
}
