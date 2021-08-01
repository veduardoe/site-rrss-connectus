import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import lgZoom from 'lightgallery/plugins/zoom';
import { AuthService } from 'src/shared/services/auth.service';
import { PostsService } from 'src/shared/services/posts.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss', '../input-post/input-post.component.scss']
})
export class PostItemComponent implements OnInit, OnChanges {

  @Input() data;
  listadoImagenes = [];
  listadoFicheros = [];
  displayComentarios = false;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  routeFicheros = ENV.FICHEROS;
  usuarioFromAuth;
  settings = {
    counter: false,
    plugins: [lgZoom]
  }

  constructor(
    private authService: AuthService,
    private postService: PostsService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {

    this.usuarioFromAuth = this.authService.getAuthInfo();

    if (this.data?.ficheros.length > 0) {

      this.data?.ficheros.forEach((val, key) => {

        if (val.type === 'pic') {
          this.listadoImagenes.push({
            image: this.routeFicheros + val.file + '?alt=media',
            src: this.routeFicheros + val.file + '?alt=media'
          });
        }

        if (val.type === 'doc') {
          this.listadoFicheros.push({
            file: this.routeFicheros + val.file + '?alt=media',
            nombre: val.nombre
          });
        }

      });

    }

    if (this.data?.likes){
      let markLike = false;
      this.data?.likes.forEach((val, key) => {
        if(this.usuarioFromAuth.id === val){
          markLike = true;
        }
      });
      this.data.isLike = markLike;
      this.data.qtyLikes = this.data?.likes.length;  
    }

    if (this.data?.comentarios){
      this.data.qtyComments = this.data?.comentarios.length;
    }


  }

  async setLike(){

    this.data.isLike = !this.data.isLike;
    if(this.data.isLike){
      this.data.qtyLikes += 1;
    }else{
      this.data.qtyLikes -= 1;
    }
    await this.postService.setLike(this.data._id);
  }

  updateQtyComments(n){
    this.data.qtyComments = n;
  }

}
