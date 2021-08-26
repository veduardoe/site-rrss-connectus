import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/shared/services/auth.service';
import { PostsService } from 'src/shared/services/posts.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnChanges {

  publishText = '';
  comentarios = [];
  loading = false;
  myInfo;
  p = 1;

  @Input() post;
  @Output() setTotal: EventEmitter<number> = new EventEmitter();

  constructor(
    private postService: PostsService,
    public utils: UtilsService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.post?._id) {
      this.getComments();
    }
  }

  getComments() {
    this.loading = true;
    this.postService.getComentarios(this.post?._id).then((res: any) => {

      const comm = res?.comentarios.reverse();
      this.comentarios = comm.map(item => {
        return {
          nombreCompleto: `${item.usuario.nombres} ${item.usuario.apellidos}`,
          foto: item.usuario.foto,
          fecha: item.fechaRegistro,
          mensaje: item.detalle,
          usuario: item.usuario.usuario,
          id: item.idUsuario
        }
      });
      this.loading = false;
      this.setTotal.emit(this.comentarios.length);
      
    }).catch(err => {
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    });
  }

  postComment() {

    if(this.publishText.trim().length === 0){
      return;
    }

    const comment = {
      idPost: this.post._id,
      detalle: this.publishText
    }

    this.postService.crearComentario(comment).then((res: any) => {
      if (res.response) {
        this.getComments();
        this.publishText = '';
        this.utils.fnMessage("Comment added succesfully.")
      }
    });
  }
}
