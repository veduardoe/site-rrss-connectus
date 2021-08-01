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
}