import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MainMessageComponent } from "../components/main-message/main-message.component";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { Subject } from "rxjs";
import { ENV } from "src/environments/environment";
import * as striptags from 'striptags'
import { Ln } from "./language.service";

@Injectable()
export class UtilsService {

  curWidth;
  mensajeEmitter = new Subject();
  borrarMensajeEmitter = new Subject();

  public horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  public verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public ln: Ln
  ) { }

  get checkWidth720() {
    const curWidth = window.innerWidth;
    return curWidth <= 720;
  }

  validateEmail(correo) {
    let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(correo) ? true : false;
  }

  fnMainDialog(title: string, message: string, type: string, maxWidth = '480px') {

    let dialogConfirm = this.dialog.open(MainMessageComponent, {
      width: '90%',
      maxWidth: maxWidth,
      data: { title, message, type },
      autoFocus: false
    });

    return dialogConfirm.afterClosed();
  }

  fnMessage(message) {
    this.snackBar.open(message, 'Close', {
      panelClass: ['btn-class-action'],
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  setLikesComments(data, usuarioFromAuth) {
    return data.map(item => {
      let markLike = false;
      item.likes.forEach((val, key) => {
        if (usuarioFromAuth.id === val) {
          markLike = true;
        }
      });
      item.isLike = markLike;
      item.qtyLikes = item.likes.length;
      item.qtyComments = item.comentarios.length;
      return item;
    });
  }

  fnMensajeEmitter() {
    return {
      get: () => {
        return this.mensajeEmitter.asObservable();
      },
      set: (e) => {
        this.mensajeEmitter.next(e);
      }
    }
  }

  fnBorrarMensajeEmitter() {
    return {
      get: () => {
        return this.borrarMensajeEmitter.asObservable();
      },
      set: (e) => {
        this.borrarMensajeEmitter.next(e);
      }
    }
  }

  procesarEventosLateral(e, onlyHightlighted = false,) {
    const evRes = e.filter(item => item.resaltado);
    const nEvRes = !onlyHightlighted ? e.filter(item => !item.resaltado) : [];
    const eventos = evRes.concat(nEvRes);
    return eventos.map(item => {
      const dateSplitted = item.fechaHoraStr.split('T')[0].split("-");
      const horaSplitted = item.fechaHoraStr.split('T')[1].split(":");
      item.day = dateSplitted[2];
      item.monthIn = ENV.MONTHS[this.ln.gln()][parseInt(dateSplitted[1]) - 1];
      item.hora = `${horaSplitted[0]}:${horaSplitted[1]}`;
      return item;
    })
  }

}