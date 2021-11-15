import { Component, OnDestroy, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { EventosService } from 'src/shared/services/eventos.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { Ln } from 'src/shared/services/language.service';
import { ConexionService } from 'src/shared/services/conexion.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit, OnDestroy {

  p = 1;
  eventosRes = [];
  eventos = [];
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  conexionesEspera = [];
  notificaciones = [];
  notifSubscribe;
  loading = true;
  constructor(
    public utils:UtilsService,
    private eventosService: EventosService,
    private conexionesService: ConexionService,
    public ln: Ln
  ) { }

  ngOnInit(): void {
    this.receiveNotifications();
  }

  ngOnDestroy(){
    this.notifSubscribe.unsubscribe();
  }

  receiveNotifications() {
    this.notifSubscribe = this.utils.fnNotificacionesEmitter().get().subscribe((not: any) => {
      if(not){
        this.notificaciones = not.conexiones;
        this.loading = false;
      }
    });
}
  
  getConexionesEspera() {
    this.conexionesService.conexionesEnEspera().then((res: any) => {
      this.conexionesEspera = res?.data.map(item => {
        return item.usuario;
      });
    });
  }

  getEventos() {
    this.eventosService.obtenerEventos(this.ln.gln()).then((ev: any) => {
      this.eventos = this.utils.procesarEventosLateral(ev.data);
    });
  }

  deleteNotf(id = null, idx = null){
    if(id ){
      this.conexionesService.borrarMisNotificaciones(id);
      setTimeout(()=>{
        this.notificaciones[idx].loading = true;
      },1000);
    }else{
      this.conexionesService.borrarMisNotificaciones('all');
      setTimeout(()=>{
        this.notificaciones.forEach((v, key) => {
          v.loading = true;
        });
      },1000);
    }
  }

}
