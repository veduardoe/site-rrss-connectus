import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class ArticulosPublicosService {

    constructor(
        private http: HttpClient
    ) { }

    getArticulosPublicos(idioma) {
        return this.http.get(ENV.BACKEND + '/articulospublicos/site?mostrarEnSlide=1&idioma=' + idioma).toPromise();
    }

}