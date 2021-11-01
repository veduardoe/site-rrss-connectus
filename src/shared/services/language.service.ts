import { Injectable } from "@angular/core";
import { in18 } from "src/environments/languages";

@Injectable()
export class Ln{

    o(code){
        return in18[code][this.gln()];
    }

    gln(){
        try{
            const info: any = sessionStorage.getItem('auth');
            const fullData = JSON.parse(info);
            const preferencias = fullData.data.preferencias;
            return preferencias.idioma;
        }catch( err){
            return 'EN';
        }
    }
}