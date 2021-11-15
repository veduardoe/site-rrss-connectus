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

    getImagenesPerfiles(){
        return this.http.get(ENV.BACKEND + '/common/imagenes-perfiles').toPromise();
    }

    getBanners(idioma = 'ES', tipoBanner){
        return this.http.get(ENV.BACKEND + '/common/banners?habilitado=true&idioma=' + idioma + '&tipo=' + tipoBanner).toPromise();
    }
}