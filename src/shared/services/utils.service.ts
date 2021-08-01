import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MainMessageComponent } from "../components/main-message/main-message.component";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
@Injectable()
export class UtilsService {

    curWidth;
    public horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    public verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
    ) { }

    get checkWidth720() {
        const curWidth = window.innerWidth;
        return curWidth <= 720;
    }

    validateEmail(correo) {
        let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(correo) ? true : false;
    }

    fnMainDialog(title: string, message: string, type: string, maxWidth = '480px') {

        let dialogConfirm = this.dialog.open(MainMessageComponent, {
            width: '90%',
            maxWidth: maxWidth,
            data: { title, message, type },
            autoFocus: false
        });

        return dialogConfirm.afterClosed();
    }

    fnMessage(message) {
        this.snackBar.open(message, 'Cerrar', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    
}