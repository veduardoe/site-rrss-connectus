import { Injectable } from "@angular/core";
import { lnList } from "src/environments/languages";

@Injectable()
export class Ln {

    o(code, ln = null) {
        return lnList[code][ln ? ln : this.gln()];
    }


    gln() {
        try {
            const info: any = sessionStorage.getItem('auth');
            const fullData = JSON.parse(info);
            const preferencias = fullData.data.preferencias;
            return preferencias.idioma;
        } catch (err) {
            return 'EN';
        }
    }
}