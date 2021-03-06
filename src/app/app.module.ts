import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { SharedModule } from 'src/shared/shared.module';
import { registerLocaleData } from '@angular/common';
import { UtilsService } from 'src/shared/services/utils.service';
import { AuthService } from 'src/shared/services/auth.service';
import { MainMessageComponent } from 'src/shared/components/main-message/main-message.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './app.interceptor';
import { CONFIG } from 'src/environments/configurations';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import localeES from '@angular/common/locales/es';
import localeEN from '@angular/common/locales/en';
import { NgImageSliderModule } from 'ng-image-slider';
import { NotificacionesComponent } from './pages/home/notificaciones/notificaciones.component';
let LOCALE_ES = 'es-ES';
let LOCALE_EN = 'en-US';
let GLOBAL_LOCALE = '';
if (sessionStorage.getItem('auth')) {

  let idioma = '';

  try {
    const info: any = sessionStorage.getItem('auth');
    const fullData = JSON.parse(info);
    const preferencias = fullData.data.preferencias;
    idioma = preferencias.idioma;
  } catch (err) {
    idioma = 'EN';
  }

  const locale = idioma === 'ES' ? localeES : localeEN;
  const localeAlt = idioma === 'ES' ? LOCALE_ES : LOCALE_EN;
  registerLocaleData(locale, localeAlt);
  GLOBAL_LOCALE = localeAlt;
} else {
  registerLocaleData(localeEN, LOCALE_EN);
  GLOBAL_LOCALE = LOCALE_EN;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainMessageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    AppRouting,
    SharedModule,
    NgImageSliderModule,
  ],
  providers: [
    AuthService,
    UtilsService,
    { provide: LOCALE_ID, useValue: GLOBAL_LOCALE },
    { provide: MAT_DATE_FORMATS, useValue: CONFIG.DATE_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  entryComponents: [MainMessageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
