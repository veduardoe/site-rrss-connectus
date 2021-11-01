import { Component, Input, OnChanges, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AuthService } from 'src/shared/services/auth.service';
import { PostsService } from 'src/shared/services/posts.service';
import { UtilsService } from 'src/shared/services/utils.service';
import * as $ from 'jquery';
import { Ln } from 'src/shared/services/language.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnChanges {

  publishText = '';
  comentarios = [];
  loading = false;
  displayEmoji = false;
  myInfo;
  p = 1;

  @Input() post;
  @Output() setTotal: EventEmitter<number> = new EventEmitter();

  constructor(
    private postService: PostsService,
    public utils: UtilsService,
    public auth: AuthService,
    public ln: Ln
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
        this.utils.fnMessage("Comment added succesfully.");
        this.displayEmoji = false;
      }else{
        this.utils.fnMainDialog('Error', 'There was an error. Try again later!', 'message');
      }
    }).catch( err => {
      this.utils.fnMainDialog('Error', 'There was an error. Try again later!', 'message');
    });
  }

  emojiSelected(e) {
    const cursorPosition = $('#inputText').prop("selectionStart");
    const nStrText = this.publishText.length;
    this.publishText = this.publishText.substr(0, cursorPosition) + e + this.publishText.substr(cursorPosition, nStrText);
    $('#inputText').focus();
  }

  
}
