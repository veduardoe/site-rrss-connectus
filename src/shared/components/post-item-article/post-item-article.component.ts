import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { PostsService } from 'src/shared/services/posts.service';
import * as striptags from 'striptags'
import lgZoom from 'lightgallery/plugins/zoom';
import { UtilsService } from 'src/shared/services/utils.service';
import { AuthService } from 'src/shared/services/auth.service';

@Component({
  selector: 'app-post-item-article',
  templateUrl: './post-item-article.component.html',
  styleUrls: ['./post-item-article.component.scss',
    './../post-item/post-item.component.scss']
})
export class PostItemArticleComponent implements OnInit, OnChanges {

  @Input() data;
  @Input() view;
  @Output() updateEvent:EventEmitter<boolean> = new EventEmitter();

  usuarioFromAuth;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  routeFicheros = ENV.FICHEROS;
  displayComentarios = false;
  settings = {
    counter: false,
    plugins: [lgZoom]
  }

  constructor(
    private postService: PostsService,
    private utils: UtilsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.usuarioFromAuth = this.authService.getAuthInfo();

  }

  ngOnChanges() {
    if (this.data) {
      const images = this.data.ficheros.filter(item => {
        return item.type === 'pic';
      });
      this.data.images = images.map(item => {
        item.img = this.routeFicheros + item.file + '?alt=media';
        return item;
      });
    }
  }

  stripTags(html) {
    return striptags(html);
  }

  get pertenecePost(){
    return this.data && this.usuarioFromAuth?.id === this.data?.idUsuario;
  }


  setComentarios() {
    if (this.view === 'FULL') {
      this.displayComentarios = !this.displayComentarios;
    }
  }

  async setLike() {

    this.data.isLike = !this.data.isLike;
    if (this.data.isLike) {
      this.data.qtyLikes += 1;
    } else {
      this.data.qtyLikes -= 1;
    }
    await this.postService.setLike(this.data._id);
  }

  updateQtyComments(n) {
    this.data.qtyComments = n;
  }

  detelePost() {
    this.utils.fnMainDialog("Confirm", "Are you sure to delete the post?", "confirm").subscribe( a => {
      if(a){
        this.postService.deletePost(this.data._id).then((res: any) => {
          this.updateEvent.emit(true);
        });
      }
    });
  }

}
