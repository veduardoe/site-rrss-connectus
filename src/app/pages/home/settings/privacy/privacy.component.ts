import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/shared/services/auth.service';
import { Ln } from 'src/shared/services/language.service';
import { UserService } from 'src/shared/services/user.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  perfilPublico;
  mostrarEmail;
  mostrarTelefono;
  idioma;
  loading = false;
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public utils: UtilsService,
    public ln: Ln
  ) { }

  ngOnInit(): void {
    const authInfo = this.authService.getAuthInfo();
    const pref = authInfo.preferencias;
    this.perfilPublico = pref.perfilPublico;
    this.mostrarEmail = pref.mostrarEmail;
    this.mostrarTelefono = pref.mostrarTelefono;
    this.idioma = pref.idioma
  }

  changeOption(tipo = null){
    const data = {
      perfilPublico: this.perfilPublico,
      mostrarEmail: this.mostrarEmail,
      mostrarTelefono: this.mostrarTelefono,
      idioma: this.idioma
    };
    this.loading = true;
    this.userService.putActualizarPreferencias(data).then( (res:any) => {
      if(res.response){
          const info: any = sessionStorage.getItem('auth');
          const fullData = JSON.parse(info);
          const preferencias = fullData.data.preferencias;
          preferencias.perfilPublico = this.perfilPublico;
          preferencias.mostrarEmail = this.mostrarEmail;
          preferencias.mostrarTelefono = this.mostrarTelefono;
          preferencias.idioma = this.idioma;
          sessionStorage.setItem('auth', JSON.stringify(fullData));

          if(tipo === 'IDIOMA'){
            location.reload();
          }
      }
      this.loading = false;

    }).catch(err => {
      this.utils.fnMessage('Preferences could not be updated. Try again.');
      this.loading = false;
    })
  }

}
