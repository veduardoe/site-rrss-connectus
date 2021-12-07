import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { ConexionService } from 'src/shared/services/conexion.service';
import { Ln } from 'src/shared/services/language.service';
import { MensajesService } from 'src/shared/services/mensajes.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-chat-people',
  templateUrl: './chat-people.component.html',
  styleUrls: ['./chat-people.component.scss',
    '../home-suggestions/home-suggestions.component.scss',
    '../header/header.component.scss']
})
export class ChatPeopleComponent implements OnInit, OnDestroy {

  plcFocus = false;
  filterUsuarios: any;
  usuariosCtrl = new FormControl();
  loadingUsuarios: boolean = false;
  myInfo;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  chatList = [];
  idCurUserChat;
  usuarioFromAuth;
  mensajeSubscriber;
  borrarMensajeSubscriber;

  loading = false;

  @ViewChild('triggerUsuarios', { read: MatAutocompleteTrigger, static: false }) triggerUsuarios: MatAutocompleteTrigger;
  @Output() usuarioSelected: EventEmitter<any> = new EventEmitter();

  constructor(
    public utils: UtilsService,
    private authService: AuthService,
    private conexionesService: ConexionService,
    private mensajesService: MensajesService,
    public ln: Ln
  ) { }

  ngOnInit(): void {
    this.setAutoComplete();
    this.getChats();
    this.usuarioFromAuth = this.authService.getAuthInfo();

    this.mensajeSubscriber = this.utils.fnMensajeEmitter().get().subscribe( async (idChat:any) => {
      await this.getChats();
      const chatId = idChat.hasOwnProperty('fromInterval') ? idChat.idChat : idChat;
      const fromInterval = idChat.hasOwnProperty('fromInterval');
      const usu = this.chatList.find(item => item.idChat === chatId);
      if(usu){
        this.setUsuario(usu, fromInterval);
      }
    });

    this.borrarMensajeSubscriber = this.utils.fnBorrarMensajeEmitter().get().subscribe( idChat => {
      this.idCurUserChat = null;
      this.borrarMensajeSubscriber.unsubscribe();
    });

  }

  ngOnDestroy(){
    this.mensajeSubscriber.unsubscribe();
  }

  setAutoComplete() {
    let conexiones = [];

    this.conexionesService.misConexiones().then((r:any) => {
      conexiones = r?.data.map(item => {
        item.usuario.idSolicitud = item._id;
        item.usuario.detalle = `${item.usuario.nombres} ${item.usuario.apellidos}`;
        return item.usuario;
      });

      this.filterUsuarios = this.usuariosCtrl.valueChanges.pipe(
        startWith(''),
        map(value => {
          return conexiones.filter( item => {
            console.log(value)
            return item.detalle && typeof value === 'string' && item.detalle?.toLowerCase().includes(value.toLowerCase())
          });
        })
      );
      
    });

    

  }

  displayTextAutocomplete(obj?: any): string | undefined {
    return obj ? obj.detalle : undefined;
  }

  usuarioSelection(e) {
    this.usuariosCtrl.setValue('');
    const usuario = e.option.value;
    const usuCheck = this.chatList.find(item => item.id === usuario.id);
    if (!usuCheck) {
      usuario.idChat = null;
      this.chatList.unshift(usuario);
    }
    this.idCurUserChat = usuario.id;
    this.usuarioSelected.emit({ u: usuario, fromInterval : false})
  }

  async setUsuario(u, fromInterval = false) {
    this.idCurUserChat = u.id;
    await this.mensajesService.marcarMensajeVisto(u.idChat);
    this.usuarioSelected.emit({u, fromInterval});
    u.nChatsNoLeidos = [];
  }

  getChats() {
    return new Promise(resolve => {
      this.mensajesService.obtenerChats().then((res: any) => {
        const usuariosExistentes = [];
        const chatIdNull = this.chatList.filter( item => {
          return !item.idChat
        })
        const chatList = res.data.map(item => {
          const usu = item.usuario;
          usu[item.usuario.id] = item.usuario;
          usu[this.usuarioFromAuth.id] = this.usuarioFromAuth;
          usu.idChat = item._id;
          usu.detalle = `${usu.nombres} ${usu.apellidos}`;
          usu.mensajes = item.mensajes.map(item => {
            item.usuarioMsgDestino = usu[item.idUsuarioDestino];
            item.usuarioMsgOrigen = usu[item.idUsuarioOrigen];
            return item;
          });
          usu.nChatsNoLeidos = item.mensajes.filter(itmesg => {
            return !itmesg.vistoDestino && itmesg.idUsuarioDestino === this.usuarioFromAuth.id;
          });
          usuariosExistentes.push(item.usuario.usuario)
          return item.usuario;
        });
        const chatListCleaned = chatIdNull.filter( item => !usuariosExistentes.includes(item.usuario))
        this.chatList = chatListCleaned.concat(chatList);

        resolve(true);
      }).catch(err => resolve(true));
    });

  }
    

}
