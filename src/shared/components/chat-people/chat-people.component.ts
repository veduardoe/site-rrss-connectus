import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Observer } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { ConexionService } from 'src/shared/services/conexion.service';
import { MensajesService } from 'src/shared/services/mensajes.service';
import { UserService } from 'src/shared/services/user.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-chat-people',
  templateUrl: './chat-people.component.html',
  styleUrls: ['./chat-people.component.scss',
              '../home-suggestions/home-suggestions.component.scss',
              '../header/header.component.scss']
})
export class ChatPeopleComponent implements OnInit {

  plcFocus = false;
  filterUsuarios: any;
  usuariosCtrl = new FormControl();
  loadingUsuarios: boolean = false;
  myInfo;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  chatList = [];
  idCurUserChat;
  usuarioFromAuth;

  @ViewChild('triggerUsuarios', { read: MatAutocompleteTrigger, static: false }) triggerUsuarios: MatAutocompleteTrigger;
  @Output() usuarioSelected:EventEmitter<any> = new EventEmitter();

  constructor(
    public utils: UtilsService,
    private authService: AuthService,
    private userService: UserService,
    private conexionesService: ConexionService,
    private mensajesService: MensajesService
  ) { }

  ngOnInit(): void {
    this.setAutoComplete();
    this.getChats();
    this.usuarioFromAuth = this.authService.getAuthInfo();
  }

  setAutoComplete() {

    this.usuariosCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
          this.loadingUsuarios = true;
      }),
      switchMap(value => {
        if (value.length > 2) {
          return this.conexionesService.misConexiones();
        } else {
          return new Observable((observer: Observer<any>) => {
            observer.next({ data: [] })
            observer.complete();
          });
        }
      })
    ).subscribe((r: any) => {
        this.filterUsuarios =  r?.data.map(item => {
          item.usuario.idSolicitud = item._id;
          item.usuario.detalle = `${item.usuario.nombres} ${item.usuario.apellidos}`;
          return item.usuario;
        });
        this.loadingUsuarios = false;
      }, () => {
        this.loadingUsuarios = false;
      });

  }

  displayTextAutocomplete(obj?: any): string | undefined {
    return obj ? obj.detalle : undefined;
  }

  usuarioSelection(e) {
    this.usuariosCtrl.setValue('');
    const usuario = e.option.value;
    const usuCheck = this.chatList.find( item => item.id === usuario.id);
    if(!usuCheck){
      usuario.idChat = null;
      this.chatList.push(usuario);
    }
    this.idCurUserChat = usuario.id;
    this.usuarioSelected.emit(usuario)
  }

  setUsuario(u){
    this.idCurUserChat = u.id;
    this.usuarioSelected.emit(u)
  }

  getChats(){
    this.mensajesService.obtenerChats().then((res:any) => {
      this.chatList = res.data.map( item => {
        const usu = item.usuario;
        usu[item.usuario.id] = item.usuario;
        usu[this.usuarioFromAuth.id] = this.usuarioFromAuth;
        usu.idChat = item._id;
        usu.esDestino = item.idUsuarioDestino === this.usuarioFromAuth.id;
        usu.detalle = `${usu.nombres} ${usu.apellidos}`;
        usu.mensajes = item.mensajes.reverse().map( item => {
          item.usuarioMsgDestino = usu[item.idUsuarioDestino];
          item.usuarioMsgOrigen = usu[item.idUsuarioOrigen];
          return item;
          
        });
        usu.nChatsNoLeidos = item.mensajes.filter( itmesg => {
            return usu.esDestino && !itmesg.vistoDestino;
        });
        return item.usuario;
      });
    });
  }

}
