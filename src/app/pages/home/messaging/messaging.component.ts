import { Component, OnDestroy, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { MensajesService } from 'src/shared/services/mensajes.service';
import { UtilsService } from 'src/shared/services/utils.service';
import * as $ from 'jquery';
import { Ln } from 'src/shared/services/language.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit, OnDestroy {

  curUsuarioDestino;
  messages = [];
  publishText = '';
  publishImg:any = {};
  usuarioFromAuth;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  routeFicheros = ENV.FICHEROS;
  curIdChat;
  intervalChat;
  loadingChat = false;
  posted = false;
  displayEmoji = false;
  p = 1;

  constructor(
    public utils: UtilsService,
    public authService: AuthService,
    public mensajesService: MensajesService,
    public ln: Ln
  ) { }

  ngOnInit(): void {
    this.usuarioFromAuth = this.authService.getAuthInfo();
    this.setUpdateAsync();
  }

  ngOnDestroy() {
    clearInterval(this.intervalChat);
  }

  usuarioSelected(data) {
    this.curUsuarioDestino = data.u;
    this.curIdChat = data.u.idChat;
    if(data.fromInterval){
      if(data.u.nChatsNoLeidos.length > 0){
        this.scrollContent();
      }
    }else{
      setTimeout(()=> {
        this.posted ? this.scrollContent() : this.scrollContent(false);
        this.posted = false;
      },500);
      setTimeout(()=> {
        this.loadingChat = true;
      },1000);
    }

  }

  scrollContent(withAnimate = true){
    const contMesHei = $('#contMessage').height();
    if(withAnimate){
      $("#chatList").animate({
        scrollTop: contMesHei
      },1000);
    }else{
      $("#chatList").scrollTop(contMesHei);
    }
  } 

  postMessage() {

    const data = {
      idUsuarioDestino: this.curUsuarioDestino.id,
      mensaje: this.publishImg?.file ? this.publishImg : this.publishText,
    }

    if(!data.mensaje){
      return;
    }

    this.mensajesService.postMensaje(data).then((res: any) => {
      this.publishText = '';
      this.publishImg = {};
      this.utils.fnMessage(this.ln.o('MESSAGESENTX'))
      this.curIdChat = res.data;
      this.posted = true;
      this.utils.fnMensajeEmitter().set(this.curIdChat);
    });
  }

  setUpdateAsync() {
    this.intervalChat = setInterval(() => {
      this.utils.fnMensajeEmitter().set({ fromInterval: true, idChat: this.curIdChat });
    }, 6000);
  }

  closeChat(){
    this.utils.fnMainDialog(this.ln.o('CONFIRMTX'), this.ln.o('CLOSECHATTX'), 'confirm').subscribe( res => {
      if(res){
        this.mensajesService.borrarChat(this.curIdChat).then( r => {
          this.curUsuarioDestino = null;
          this.curIdChat = null;
        });
      }
    });
  }

  emojiSelected(e){
    const cursorPosition = $('#inputText').prop("selectionStart");
    const nStrText = this.publishText.length;
    this.publishText = this.publishText.substr(0, cursorPosition) + e + this.publishText.substr(cursorPosition, nStrText);
    $('#inputText').focus();
  }

  showEmojis(){
    this.displayEmoji = !this.displayEmoji;
  }
  
  uploadImage(){
    document.getElementById('imagenes').click();
  }

  fileChange(e) {

    const files: File[] = e.target.files;
    Object.keys(files).forEach(a => {
      this.prepareFile(files[a]);
    });
    let val: any = document.getElementById('imagenes');
    val.value = null;
  }

  prepareFile(file: any,) {

    let reader = new FileReader();
    let size = Math.round((file['size'] / 1000) * 100) / 100;

    if (size < 6000) {

      reader.readAsDataURL(file);
      reader.onload = () => {

        let file64 = String(reader.result).split(";");
        let fichero = String(reader.result);
        let mimetype = file64[0].split(":")[1];
        const mimeTypeImagenes = mimetype == "image/jpg" || mimetype == "image/jpeg" || mimetype == "image/gif" || mimetype == "image/png";

        if (mimeTypeImagenes) {

          this.publishImg = {
            file: fichero,
            image: fichero,
            nombre: file.name,
            type: 'pic',
            uploaded: false
          }

         let txt = '<span class="txtimg">' + this.ln.o('UPLIMAGECONFIRM') + '</span><br /><br />'
         txt += '<img class="imgfile"  src="'+fichero+'" />'
          this.utils.fnMainDialog(this.ln.o('NOTIF'), txt , 'confirm', '640px').subscribe( r => {
            if(r){
              this.postMessage();
            }
          })
        } else {
          this.utils.fnMessage(this.ln.o('ERRFILETYPE'));
        }
      };
    } else {
      this.utils.fnMessage(this.ln.o('IMAGESIZE'));
    }

  }

}
