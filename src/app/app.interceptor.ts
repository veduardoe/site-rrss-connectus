import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/shared/services/auth.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    constructor(
        private utils: UtilsService,
        private autenticacionService: AuthService,
        private dialog: MatDialog
    ){}
   
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const auth: string = sessionStorage.getItem('auth');
        const token = auth ? JSON.parse(auth).access_token : '';
        let request = req;

        if (token) {
            request = req.clone({
                setHeaders: {
                    authorization: `Bearer ${token}`,
                },
            });
        }

        return next.handle(request).pipe(tap(() => { },
            (err: any) => {
                if (err instanceof HttpErrorResponse) {

                    if (err.status === 401) {
                        this.dialog.closeAll();
                        this.utils.fnMessage("No tiene permisos para acceder. Intente ingresar nuevamente.");
                        this.autenticacionService.logout();
                        return;
                    }
                }
            }));
    }
}
