import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class EventosService {

    constructor(
        private http: HttpClient
    ) { }

    obtenerEventos(lang = 'EN') {
        return this.http.get(ENV.BACKEND + '/eventos?filtered=true&idioma=' + lang).toPromise();
    }

}