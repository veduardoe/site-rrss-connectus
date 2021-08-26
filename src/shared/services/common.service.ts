import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class CommonService{

    constructor(
        private http: HttpClient
    ){}

    getCategorias(){
        return this.http.get(ENV.BACKEND + '/common/listado-categorias').toPromise();
    }

    getBanners(idioma = 'ES'){
        return this.http.get(ENV.BACKEND + '/common/banners?habilitado=true&idioma=' + idioma).toPromise();
    }
}