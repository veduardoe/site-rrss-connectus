import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class MensajesService{

    constructor(
        private http: HttpClient
    ){}

    postMensaje(data){
        return this.http.post(ENV.BACKEND + '/mensajeria/crear-mensaje', data).toPromise();
    }

    obtenerChats(idChat = null){
        const query = idChat ? 'idChat=' + idChat : '';
        return this.http.get(ENV.BACKEND + '/mensajeria/obtener-chats?' + query).toPromise();
    }

    marcarMensajeVisto(idChat){
        return this.http.post(ENV.BACKEND + '/mensajeria/marcar-mensaje-visto', { idChat }).toPromise();
    }

    borrarChat(idChat){
        return this.http.post(ENV.BACKEND + '/mensajeria/borrar-chat', { idChat }).toPromise();
    }


}