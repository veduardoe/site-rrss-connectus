import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class ConexionService{

    constructor(
        private http: HttpClient
    ){}
    
    crearConexion(data) {
        return this.http.post(ENV.BACKEND + '/conexion/crear-solicitud', data).toPromise();
    }

    procesarConexion(data) {
        return this.http.post(ENV.BACKEND + '/conexion/procesar-solicitud', data).toPromise();
    }

    conexionesEnEspera(){
        return this.http.get(ENV.BACKEND + '/conexion/usuarios-espera-conexion').toPromise();
    }

    misConexiones(){
        return this.http.get(ENV.BACKEND + '/conexion/mis-conexiones').toPromise();
    }

    misConexionesEnEspera(){
        return this.http.get(ENV.BACKEND + '/conexion/mis-conexiones-en-espera').toPromise();
    }

    misNotificacionesConexion(){
        return this.http.get(ENV.BACKEND + '/conexion/mis-notificaciones').toPromise();
    }

    borrarMisNotificaciones(action){
        return this.http.delete(ENV.BACKEND + '/conexion/mis-notificaciones/' + action).toPromise();
    }

    vistoMisNotificaciones(){
        return this.http.put(ENV.BACKEND + '/conexion/mis-notificaciones/marcar-visto/todos',{}).toPromise();
    }
}