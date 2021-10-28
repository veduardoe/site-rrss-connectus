import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ENV } from 'src/environments/environment';
import lgZoom from 'lightgallery/plugins/zoom';
import { AuthService } from 'src/shared/services/auth.service';
import { PostsService } from 'src/shared/services/posts.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss', '../input-post/input-post.component.scss']
})
export class PostItemComponent implements OnInit, OnChanges {

  @Input() data;
  @Output() updateEvent:EventEmitter<boolean> = new EventEmitter();

  
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
    private utils: UtilsService,
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

    this.data = this.utils.setLikesComments([this.data], this.usuarioFromAuth)[0];

  }

  get pertenecePost(){
    return this.data && this.usuarioFromAuth?.id === this.data?.idUsuario;
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

  detelePost() {
    this.utils.fnMainDialog("Confirm", "Are you sure to delete the post?", "confirm").subscribe( a => {
      if(a){
        this.postService.deletePost(this.data._id).then((res: any) => {
          this.updateEvent.emit(true);
        });
      }
    });
  }

  denunciarPost() {
    this.utils.fnMainDialog("Confirm", "Are you sure to report the post?", "confirm").subscribe( a => {
      if(a){
        this.postService.denunciarePost(this.data._id).then((res: any) => {
          if(res.response){
            this.utils.fnMainDialog('Notification', 'Post has been reported successfully', 'message');
          }else{
            this.utils.fnMainDialog('Notification', 'You have already reported this post.', 'message');
          }
        });
      }
    });
  }
}
