import { Component, OnDestroy, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { MensajesService } from 'src/shared/services/mensajes.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit, OnDestroy {

  curUsuarioDestino;
  messages = [];
  publishText = '';
  usuarioFromAuth;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  curIdChat;
  intervalChat;
  p = 1;

  constructor(
    public utils: UtilsService,
    public authService: AuthService,
    public mensajesService: MensajesService
  ) { }

  ngOnInit(): void {
    this.usuarioFromAuth = this.authService.getAuthInfo();
    this.setUpdateAsync();
  }

  ngOnDestroy() {
    clearInterval(this.intervalChat);
  }

  usuarioSelected(u) {
    this.curUsuarioDestino = u;
    this.curIdChat = u.idChat;
  }

  postMessage() {
    const data = {
      idUsuarioDestino: this.curUsuarioDestino.id,
      mensaje: this.publishText
    }
    this.mensajesService.postMensaje(data).then((res: any) => {
      this.publishText = '';
      this.utils.fnMessage('Message sent!')
      this.curIdChat = res.data;
      this.utils.fnMensajeEmitter().set(this.curIdChat);
    });
  }

  setUpdateAsync() {
    this.intervalChat = setInterval(() => {
      this.utils.fnMensajeEmitter().set({ fromInterval: true, idChat: this.curIdChat });
    }, 60000);
  }

  closeChat(){
    this.utils.fnMainDialog('Confirm', 'Are you sure to close the chat?', 'confirm').subscribe( res => {
      if(res){
        this.mensajesService.borrarChat(this.curIdChat).then( r => {
         // this.utils.fnBorrarMensajeEmitter().set(this.curIdChat);
          this.curUsuarioDestino = null;
          this.curIdChat = null;
        });
      }
    });
  }
}
