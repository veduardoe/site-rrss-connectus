import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { UtilsService } from "./utils.service";

@Injectable()
export class AuthService{

    loginState = new Subject();

    constructor(
        private router:Router,
        private utils:UtilsService
    ){

    }

    fnLoginState() {
        return {
            setLogin: (data: any) => {
                this.loginState.next(data)
            },
            getLogin: (): Observable<any> => {
                return this.loginState.asObservable();
            }
        }
    }

    get isAuth() {
        try {
            const data: any = JSON.parse(sessionStorage.getItem('auth'));
            return data.hasOwnProperty('access_token') && data.hasOwnProperty('data');
        } catch (err) {

            return false;
        }
    }

    getAuthInfo() {
        try {
            const info: any = sessionStorage.getItem('auth');
            return JSON.parse(info).data;
        } catch (err) {
            return false;
        }
    }

    removeAuthInfo() {
        sessionStorage.clear();
        localStorage.clear();
    }

    logout() {
        this.router.navigate(['/login']);
        this.removeAuthInfo();
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {

        try{

            if (this.isAuth) {
                return true;
            } else {
                this.router.navigate(['/login']);
                //this.utils.fnMessage("Acceso Denegado. No tiene permisos para ver el contenido del sitio.");
                return false;
            }

        }catch(err){
            this.router.navigate(['/login']);
            return false;
           // this.utils.fnMessage("Acceso Denegado. No tiene permisos para ver el contenido del sitio.");

        }

    }

}