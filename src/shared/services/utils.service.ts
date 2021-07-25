import { HostListener, Injectable } from "@angular/core";

@Injectable()
export class UtilsService{
    
    curWidth;

    get checkWidth720(){
        const curWidth = window.innerWidth;
        console.log(curWidth)
        return curWidth <= 720;
    }


}