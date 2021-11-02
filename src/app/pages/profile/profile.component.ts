import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { ConexionService } from 'src/shared/services/conexion.service';
import { Ln } from 'src/shared/services/language.service';
import { UserService } from 'src/shared/services/user.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  routeFotoPerfil = ENV.FOTOS_PERFIL;
  perfilUsuario;
  loadedUsuario = false;
  loading = false;
  loadingConexion = false;
  connectInfo;
  isMyProfile = true;
  myInfo;

  constructor(
    public utils: UtilsService,
    public userService: UserService,
    public aRouter: ActivatedRoute,
    public authService: AuthService,
    public conexionService: ConexionService,
    public ln: Ln
  ) { }

  ngOnInit(): void {
    this.aRouter.queryParams.subscribe(params => {
      if (params.usuario) {
        this.myInfo = this.authService.getAuthInfo();
        this.loading = true;
        this.userService.getPerfil(params.usuario).then((res: any) => {
          this.perfilUsuario = res.data[0];
          this.loadedUsuario = true;
          this.loading = false;
          this.setBtnConnect();
        }).catch(err => {
          this.loadedUsuario = true;
          this.loading = false;
        });
      }
    })
  }

  setBtnConnect() {

    if (this.perfilUsuario.estadoConexion.length === 0) {
      this.connectInfo = {
        texto: 'CONNECT +',
        action: 'CREATE_CONNECTION'
      };
      return;
    }

    if (this.perfilUsuario.estadoConexion.length > 0) {

      const conexion = this.perfilUsuario.estadoConexion[0];

      if (conexion.idUsuarioSolicitud === this.myInfo.id && conexion.idUsuarioDestino === this.perfilUsuario._id) {

        if (conexion.estadoSolicitud && !conexion.estadoDestino) {
          this.connectInfo = {
            texto: 'AWAITING RESPONSE CONNECTION',
            action: 'AWAIT_CONNECTION'
          };
        }

      }

      if (conexion.idUsuarioSolicitud === this.perfilUsuario._id && conexion.idUsuarioDestino === this.myInfo.id) {

        if (conexion.estadoSolicitud && !conexion.estadoDestino) {
          this.connectInfo = {
            texto: 'ACCEPT CONNECTION',
            action: 'ACCEPT_CONNECTION'
          };
        }

      }

      if (conexion.estadoSolicitud && conexion.estadoDestino) {
        this.connectInfo = {
          texto: 'CONNECTED',
          action: 'CONNECTED'
        };
      }

      if (!conexion.estadoSolicitud && !conexion.estadoDestino) {
        this.connectInfo = {
          texto: 'CONNECTION REJECTED',
          action: 'CONNECTION_REJECTED'
        };
      }

    }
  }

  crearConexion() {
    this.loadingConexion = true;
    this.conexionService.crearConexion({ idUsuarioSolicitud: this.perfilUsuario._id }).then((res: any) => {
      if (res.response) {
        this.utils.fnMessage('Invitation has been sent');
        this.perfilUsuario.estadoConexion = [{
          idUsuarioSolicitud: this.myInfo.id,
          idUsuarioDestino: this.perfilUsuario._id,
          estadoSolicitud: true,
          estadoDestino: false,
          _id: res.data
        }]
        this.setBtnConnect();
      }
      this.loadingConexion = false;

    }).catch(err => {
      this.loadingConexion = false;
    });
  }

  procesarConexion(estado) {

    const data = {
      action: this.connectInfo.action,
      aceptaSolicitud: estado,
      idSolicitud: this.perfilUsuario.estadoConexion[0]._id
    }

    this.conexionService.procesarConexion(data).then((res: any) => {

      if (res.response){
        
        if (this.connectInfo.action === 'AWAIT_CONNECTION' && !estado) {
          this.perfilUsuario.estadoConexion = [];
        }

        if (this.connectInfo.action === 'ACCEPT_CONNECTION' && estado) {
          this.perfilUsuario.estadoConexion[0].estadoDestino = true;
          this.perfilUsuario.estadoConexion[0].estadoSolicitud = true;
        }
        
        if (this.connectInfo.action === 'ACCEPT_CONNECTION' && !estado) {
          this.perfilUsuario.estadoConexion = [];
        }

        if (this.connectInfo.action === 'CONNECTED' && !estado) {
          this.perfilUsuario.estadoConexion = [];
        }
        
        this.setBtnConnect();
      }

    
    });

  }
}
