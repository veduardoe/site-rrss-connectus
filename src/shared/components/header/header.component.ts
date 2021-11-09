import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { ConexionService } from 'src/shared/services/conexion.service';
import { Ln } from 'src/shared/services/language.service';
import { UserService } from 'src/shared/services/user.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  plcFocus = false;
  filterUsuarios: any;
  usuariosCtrl = new FormControl();
  loadingUsuarios: boolean = false;
  myInfo;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  notifQty: any = [];
  notifMessages = 0;
  @ViewChild('triggerUsuarios', { read: MatAutocompleteTrigger, static: false }) triggerUsuarios: MatAutocompleteTrigger;

  constructor(
    public router: Router,
    public utils: UtilsService,
    public authService: AuthService,
    public userService: UserService,
    public conexionService: ConexionService,
    public ln: Ln
  ) { }

  ngOnInit(): void {
    this.setAutoComplete();
    this.myInfo = this.authService.getAuthInfo();
    this.receiveNotifications();
  }

  receiveNotifications() {
    const locItem = sessionStorage.getItem('notifQty');
    const qtyMsg = sessionStorage.getItem('msgQty');
    this.notifQty = locItem ? Number(locItem) : 0;
    this.notifMessages = qtyMsg ? Number(qtyMsg) : 0;
    this.utils.fnNotificacionesEmitter().get().subscribe((not: any) => {
      if(not){
        const notifQty = not.conexiones.filter(item => {
          return !item.marcaVisto;
        });
        this.notifMessages = not.mensajesNoLeidos;
        this.notifQty = notifQty.length;
        sessionStorage.setItem('notifQty', this.notifQty);
        sessionStorage.setItem('msgQty', String(this.notifMessages));
      }
    });
  }

  goToHome() {
    this.router.navigate(['/home/homefeed']);
  }

  goToNotifications() {
    this.conexionService.vistoMisNotificaciones();
    this.notifQty = 0;
    this.router.navigate(['/home/notifications']);
  }

  logout() {
    this.authService.logout();
  }

  setAutoComplete() {

    this.usuariosCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.loadingUsuarios = true;
      }),
      switchMap(value => {
        if (value.length > 2) {
          return this.userService.getUsuarios(value);
        } else {
          return new Observable((observer: Observer<any>) => {
            observer.next({ data: [] })
            observer.complete();
          });
        }
      })
    ).subscribe((r: any) => {
      this.filterUsuarios = r.data.map(item => {
        item.detalle = `${item.nombres} ${item.apellidos}`;
        return item;
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
  }

}
