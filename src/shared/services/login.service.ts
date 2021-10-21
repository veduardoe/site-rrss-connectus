import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class LoginService{
    
    constructor(
        private http: HttpClient
    ){}

    postLogin(data){
        return this.http.post(ENV.BACKEND + '/login-rs', data).toPromise();
    }
    
    postRegister(data){
        return this.http.post(ENV.BACKEND + '/usuarios-rs/crear-usuario', data).toPromise();
    }

    solicitarCodigoClave(data){
        return this.http.post(ENV.BACKEND + '/usuarios-rs/solicitar-codigo-clave', data).toPromise();
    }

    validarCodigoClave(data){
        return this.http.post(ENV.BACKEND + '/usuarios-rs/validar-codigo-clave', data).toPromise();
    }

    cambiarClave(data){
        return this.http.post(ENV.BACKEND + '/usuarios-rs/cambiar-clave', data).toPromise();
    }
}