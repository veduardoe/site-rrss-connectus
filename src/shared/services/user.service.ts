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

    putActualizarPerfil(data){
        return this.http.put(ENV.BACKEND + '/usuarios-rs/modificar-usuario', data).toPromise();
    }
}