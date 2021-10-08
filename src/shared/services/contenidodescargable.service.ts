import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class ContenidoDescargablesService {

    constructor(
        private http: HttpClient
    ) { }

    obtenerCategorias(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(ENV.BACKEND + '/contenidosdescargables/categorias?' + str).toPromise();
    }

    obtenerContenidos(data) {
        let str = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        return this.http.get(ENV.BACKEND + '/contenidosdescargables/contenidos?' + str).toPromise();
    }
    
}
