import { Component, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { MensajesService } from 'src/shared/services/mensajes.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit {

  curUsuarioDestino;
  messages = [];
  publishText = '';
  usuarioFromAuth;
  routeFotoPerfil = ENV.FOTOS_PERFIL;

  constructor(
    public utils:UtilsService,
    public authService: AuthService,
    public mensajesService: MensajesService
  ) { }

  ngOnInit(): void {
    this.usuarioFromAuth = this.authService.getAuthInfo();
  }

  usuarioSelected(u){
    this.curUsuarioDestino = u;
    console.log(u);
  }

  postMessage(){
    const data = {
      idUsuarioDestino: this.curUsuarioDestino.id,
      mensaje: this.publishText
    }
    this.mensajesService.postMensaje(data).then( res => {
      this.publishText = '';
      this.utils.fnMessage('Message sent!')
      console.log(res);
    });

  }
}
