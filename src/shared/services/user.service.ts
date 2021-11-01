import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class UserService{

    constructor(
        private http: HttpClient
    ){}

    getMisDatos(){
        return this.http.get(ENV.BACKEND + '/usuarios-rs/obtener-mis-datos').toPromise();
    }

    getUsuarios(str){
        return this.http.get(ENV.BACKEND + '/usuarios-rs/obtener-usuarios?texto=' + str).toPromise();
    }

    getPerfil(usuario){
        return this.http.get(ENV.BACKEND + '/usuarios-rs/obtener-perfil?usuario=' + usuario).toPromise();
    }

    putActualizarPerfil(data){
        return this.http.put(ENV.BACKEND + '/usuarios-rs/modificar-usuario', data).toPromise();
    }

    putActualizarPreferencias(data){
        return this.http.put(ENV.BACKEND + '/usuarios-rs/modificar-preferencias', data).toPromise();
    }
}