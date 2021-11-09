import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as $ from 'jquery';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { ConexionService } from 'src/shared/services/conexion.service';
import { Ln } from 'src/shared/services/language.service';
import { UtilsService } from 'src/shared/services/utils.service';
import gtag, { install } from 'ga-gtag';
install(ENV.analyticsCode);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Connectus Portal';
  notifSubscription;
  myNotifications = [];
  myMessages = 0;
  intervalTimer = 5000;

  constructor(
    public router: Router,
    public auth: AuthService,
    public utils: UtilsService,
    public ln: Ln,
    private conexionesService: ConexionService,
  ) { }

  ngOnInit() {

    this.onScroll();
    this.callNotification();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        //const top = $(window).scrollTop();
        $("body, html").scrollTop(0);
        gtag('config', ENV.analyticsCode, { 'page_path': `/social${event.url}` });
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    /*  const top = $(window).scrollTop();
      if (top > 0 || window.innerWidth <= 720) {
        $("header").addClass("fixed");
        $("#content-router").addClass("header-fixed");
      } else {
        $("header").removeClass("fixed");
        $("#content-router").removeClass("header-fixed");
      }*/
  }


  callNotification() {
    this.notifSubscription = setInterval(() => {
      if (this.auth.isAuth) {
        this.conexionesService.misNotificacionesConexion().then((res: any) => {
          this.utils.fnNotificacionesEmitter().set({
            conexiones: this.mapNotifications(res.data.conexiones),
            mensajesNoLeidos: res.data.mensajesNoLeidos
          });
        });
      }
    }, 5000);
  }

  mapNotifications(nots) {
    return nots.map(item => {
      item.message = `${item.usuario.nombres} ${item.usuario.apellidos}`;
      switch (item.codigo) {
        case 'SOLICITUD_CONEXION_RECIBIDA': item.message += ` ${this.ln.o('NOTNEWCON')}`; break;
        case 'SOLICITUD_CONEXION_ANULADA': item.message += ` ${this.ln.o('NOTANLCON')}`; break;
        case 'SOLICITUD_CONEXION_RECHAZADA': item.message += ` ${this.ln.o('NOTREJCON')}`; break;
        case 'SOLICITUD_CONEXION_REMOVIDA': item.message += ` ${this.ln.o('NOTREMCON')}`; break;
        case 'SOLICITUD_CONEXION_ACEPTADA': item.message += ` ${this.ln.o('NOTACCON')}`; break;
      }
      return item;
    });
  }

  stopNotifications() {
    clearInterval(this.notifSubscription);
  }

}
