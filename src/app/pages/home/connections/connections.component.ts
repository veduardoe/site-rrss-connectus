import { Component, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { ConexionService } from 'src/shared/services/conexion.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss',
  ]
})
export class ConnectionsComponent implements OnInit {

  conexiones = [];
  conexionesFilter = [];
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  findAConnectionStr = '';
  actionView = 1;
  loading = false;
  p = 1;

  constructor(
    public utils: UtilsService,
    private conexionesService: ConexionService
  ) { }

  ngOnInit(): void {
    this.getConexiones();
  }

  getConexiones() {
    this.actionView = 1;
    this.loading = true;
    this.conexionesService.misConexiones().then((res: any) => {
      this.conexiones = res?.data.map(item => {
        item.usuario.idSolicitud = item._id;
        return item.usuario;
      });
      this.conexionesFilter = JSON.parse(JSON.stringify(this.conexiones));
      this.loading = false;
    }).catch(err => { this.loading = false; });
  }

  getConexionesEspera() {
    this.actionView = 2;
    this.loading = true;
    this.conexionesService.conexionesEnEspera().then((res: any) => {
      this.conexiones = res?.data.map(item => {
        item.usuario.idSolicitud = item._id;
        return item.usuario;
      });
      this.conexionesFilter = JSON.parse(JSON.stringify(this.conexiones));
      this.loading = false;
    }).catch(err => { this.loading = false; });
  }

  getConexionesAprobacion() {
    this.actionView = 3;
    this.loading = true;
    this.conexionesService.misConexionesEnEspera().then((res: any) => {
      this.conexiones = res?.data.map(item => {
        item.usuario.idSolicitud = item._id;
        return item.usuario;
      });
      this.conexionesFilter = JSON.parse(JSON.stringify(this.conexiones));
      this.loading = false;
    }).catch(err => { this.loading = false; });
  }

  procesarConexion(estado, idSolicitud, action, behavior) {

    const data = {
      action: action,
      aceptaSolicitud: estado,
      idSolicitud: idSolicitud
    }

    this.conexionesService.procesarConexion(data).then((res: any) => {

      if (res.response){
        
        let message = '';

        switch(this.actionView){
          case 1: this.getConexiones(); break;
          case 2: this.getConexionesEspera(); break;
          case 3: this.getConexionesAprobacion(); break;
        }

        switch(behavior){
          case 'REMOVE': message = 'Connection has been removed.'; break;
          case 'REJECT': message = 'Connection has been rejected.'; break;
          case 'APPROVE': message = 'Connection has been approved.'; break;
          case 'CANCEL': message = 'Connection request has been canceled.'; break;
        }
        
        this.utils.fnMessage(message);
      }
    
    });

  }

  finAConnection(ev){
    const str =  ev.target.value;
    this.conexionesFilter = this.conexiones.filter( item => {
      return item.nombres.toLowerCase().includes(str) || 
            item.apellidos.toLowerCase().includes(str) ||
            item.usuario.toLowerCase().includes(str) || str === ''
    })
  } 
}
