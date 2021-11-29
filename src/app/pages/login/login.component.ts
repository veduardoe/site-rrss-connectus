import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/shared/services/login.service';
import { UtilsService } from 'src/shared/services/utils.service';
import jwt_decode from "jwt-decode";
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ENV } from 'src/environments/environment';
import { Ln } from 'src/shared/services/language.service';
declare var grecaptcha;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  curView = 'login';
  alertMessage = '';
  alertMessageReg = '';
  loading = false;
  errorClave = false;
  errorCorreo = false;
  btnRecoverTxt = 'RECOVER PASSWORD';
  lang;
  loginData = {
    usuario: '',
    clave: '',
    usuarioError: false,
    claveError: false,
    usuarioMsg: '',
    claveMsg: ''
  }

  recoverPassData = {
    usuario: '',
    validCode: '',
    clave: '',
    confirmarClave: '',
    usuarioError: false,
    claveError: false,
    cclaveError: false,
    codigoError: false,
    usuarioMsg: '',
    claveMsg: '',
    cclaveMsg: '',
    codigoMsg: '',
    etapa: 1
  }

  registerForm = new FormGroup({
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    usuario: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required])
  })

  constructor(
    public utils: UtilsService,
    private loginService: LoginService,
    private router: Router,
    private aRouter: ActivatedRoute,
    public ln: Ln
  ) { }

  ngOnInit(): void {
    this.aRouter.queryParams.subscribe( param => {
      if( param.lang === 'es' || param.lang === 'en'){
        this.lang = param.lang.toUpperCase();
        console.log(this.lang)
      }else{
        this.lang = 'EN';
      }
    })
  }

  get heightContainer() {
    return window.innerHeight + 'px';
  }

  get mf() {
    return this.registerForm.controls;
  }

  changeView(view) {
    this.curView = view;
    this.clearLogin();
    this.clearRecoverPass();
  }

  restoreValidation(item, e = null) {
    this.loginData[item] = false;
    if (e && e.which === 13) {
      this.login();
    }
  }

  clearLogin() {
    this.loginData = {
      usuario: '',
      clave: '',
      usuarioError: false,
      claveError: false,
      usuarioMsg: '',
      claveMsg: ''
    }
  }

  clearRecoverPass() {
    this.alertMessageReg = '';
    this.recoverPassData = {
      usuario: '',
      validCode: '',
      clave: '',
      confirmarClave: '',
      usuarioError: false,
      claveError: false,
      cclaveError: false,
      codigoError: false,
      usuarioMsg: '',
      claveMsg: '',
      cclaveMsg: '',
      codigoMsg: '',
      etapa: 1
    }
  }

  regRestoreValidation(key) {
    this.registerForm.get(key).markAsUntouched();
    if (key === 'clave') {
      this.errorClave = false;
    }

    if (key === 'email') {
      this.errorCorreo = false;
    }
    const usuario = this.registerForm.getRawValue()['usuario'];
    this.registerForm.patchValue({ usuario : usuario.split(" ").join("")});
  }

  async login() {

    this.alertMessage = '';

    if (this.loginData.usuario === '') {
      this.loginData.usuarioError = true;
      this.loginData.usuarioMsg = this.ln.o('LOGUSERREQ2', this.lang);
    } else {
      this.loginData.usuarioError = false;
      this.loginData.usuarioMsg = '';
    }

    if (this.loginData.clave.length < 8 || this.loginData.clave.length > 15) {
      this.loginData.claveError = true;
      this.loginData.claveMsg = this.ln.o('LOGPASSERR', this.lang);
    } else {
      this.loginData.claveError = false;
      this.loginData.claveMsg = '';
    }

    if (this.loginData.usuarioError || this.loginData.claveError) {
      return;
    }

    const token = await grecaptcha.execute(ENV.GOOGLESECRET, { action: 'login' });

    const data = {
      usuario: this.loginData.usuario,
      clave: this.loginData.clave,
      token
    }

    this.loading = true;
    this.loginService.postLogin(data).then((res: any) => {

      if (res.response) {
        const decodedToken: any = { data: jwt_decode(res.token), access_token: res.token };
        setTimeout(() => {
          sessionStorage.setItem('auth', JSON.stringify(decodedToken));
          this.router.navigate(['/home/homefeed']);
          this.loading = false;
        }, 2000);
      } else {

        switch (res.code) {

          case 'ACCESS_LOCKED':
            this.alertMessage = this.ln.o('LOGACLOCKED', this.lang);
            break;

          case 'INVALID_PASSWORD':
            this.alertMessage = this.ln.o('LOGACERRPASS', this.lang);
            break;

          case 'ERROR_RECAPTCHA':
            this.alertMessage = this.ln.o('LOGERRVALID', this.lang);
            break;

          default:
            this.alertMessage = this.ln.o('LOGERRNOTLOG', this.lang);
            break;

        }
        setTimeout(() => {
          this.loading = false;
        });
      }

    }).catch(err => {
      this.loading = false;
      this.alertMessage = this.ln.o('LOGERRNOTLOG', this.lang);

    });

  }

  triggedValidation(touched) {
    const obj = this.registerForm.value;
    Object.keys(obj).forEach(key => {
      touched ? this.registerForm.get(key).markAsTouched() : this.registerForm.get(key).markAsUntouched()
    });
  }

  async save() {

    this.triggedValidation(true);
    const data = this.registerForm.getRawValue();

    this.errorClave = data.clave.length < 8 || data.clave.length > 15;
    this.errorCorreo = data.email.length > 0 && !this.utils.validateEmail(data.email);

    if (this.registerForm.valid && !this.errorClave && !this.errorCorreo) {
      const token = await grecaptcha.execute(ENV.GOOGLESECRET, { action: 'save' });
      data.token = token;
      this.loading = true;
      data.lang = this.lang;
      this.loginService.postRegister(data).then((res: any) => {

        if (res.response) {
          this.loginData.usuario = data.usuario;
          this.loginData.clave = data.clave;
          this.login();

        } else {

          this.alertMessageReg = this.ln.o('LOGERRNOTREG', this.lang);
          setTimeout(() => {
            this.loading = false;
          });

        }

      }).catch(err => {

        switch (err.error.code) {

          case 'USUARIO_EXISTE':
            this.alertMessageReg = this.ln.o('REGUSERNO', this.lang);
            break;

          case 'CORREO_EXISTE':
            this.alertMessageReg = this.ln.o('REGEMAILNO', this.lang);
            break;

          case 'ERROR_RECAPTCHA':
            this.alertMessage = this.ln.o('REGRECPERR', this.lang);
            break;

          default:
            this.alertMessageReg = this.ln.o('LOGERRNOTREG', this.lang);
            break;

        }

        setTimeout(() => {
          this.loading = false;
        });

      });
    }

  }

  async requestPassword(stage) {

    this.alertMessageReg = '';

    switch (stage) {
      case 1: this.callValidCode(); break;
      case 2: this.validateCode(); break;
      case 3: this.changePassword(); break;
    }
  }

  async callValidCode() {

    this.recoverPassData.usuarioError = false;
    this.recoverPassData.usuarioMsg = '';

    if (!this.recoverPassData.usuario.trim()) {
      this.recoverPassData.usuarioError = true;
      this.recoverPassData.usuarioMsg = this.ln.o('LOGUSERREQ2', this.lang);
      return;
    }

    const token = await grecaptcha.execute(ENV.GOOGLESECRET, { action: 'recoverpass' });

    const dataReq = {
      token,
      usuario: this.recoverPassData.usuario.trim()
    };
    this.loading = true;

    this.loginService.solicitarCodigoClave(dataReq).then((res: any) => {

      this.loading = false;

      if (res.response) {
        this.recoverPassData.etapa = 2;
        this.btnRecoverTxt = this.ln.o('BTNVALIDCODE', this.lang);
      } else if (res.code === 'USUARIO_NO_ENCONTRADO') {
        this.alertMessageReg = this.ln.o('RECPASSNOF', this.lang);
      } else {
        this.alertMessageReg = this.ln.o('ERRRECPASS', this.lang);
      }

    }).catch(err => {

      this.loading = false;
      this.alertMessageReg = this.ln.o('ERRRECPASS', this.lang);

    });
  }

  async validateCode() {
    
    this.recoverPassData.codigoError = false;
    this.recoverPassData.codigoMsg = '';

    if (!this.recoverPassData.validCode.trim()) {
      this.recoverPassData.codigoError = true;
      this.recoverPassData.codigoMsg = this.ln.o('VALIDCODEREQ', this.lang);
      return;
    }

    const token = await grecaptcha.execute(ENV.GOOGLESECRET, { action: 'recoverpass' });

    const dataReq = {
      token,
      usuario: this.recoverPassData.usuario.trim(),
      codigo: this.recoverPassData.validCode.trim()
    };
    this.loading = true;

    this.loginService.validarCodigoClave(dataReq).then((res: any) => {

      this.loading = false;

      if (res.response) {
        this.recoverPassData.etapa = 3;
        this.btnRecoverTxt = this.ln.o('BTNCHPASS', this.lang);
      } else {
        this.alertMessageReg = this.ln.o('VALIDCODEERR', this.lang);
      }

    }).catch(err => {

      this.loading = false;
      this.alertMessageReg = this.ln.o('NOVALIDCODEERR', this.lang);

    });
  }

  async changePassword() {
    
    this.recoverPassData.claveError = false;
    this.recoverPassData.claveMsg = '';
    this.recoverPassData.cclaveError = false;
    this.recoverPassData.cclaveMsg = '';

    if (!this.recoverPassData.clave.trim()) {
      this.recoverPassData.claveError = true;
      this.recoverPassData.claveMsg = this.ln.o('RECPASSREQ', this.lang);
      return;
    }

    if (!this.recoverPassData.confirmarClave.trim()) {
      this.recoverPassData.cclaveError = true;
      this.recoverPassData.cclaveMsg = this.ln.o('RECCPASS', this.lang);
      return;
    }

    if(this.recoverPassData.clave.trim().length < 8 || this.recoverPassData.clave.trim().length > 15){
      this.alertMessageReg = this.ln.o('LOGPASSERR', this.lang).toUpperCase();
      return;
    }

    if(this.recoverPassData.clave.trim() !== this.recoverPassData.confirmarClave.trim()){
      this.alertMessageReg = this.ln.o('PASSNOMATCH', this.lang).toUpperCase();
      return;
    }

    const token = await grecaptcha.execute(ENV.GOOGLESECRET, { action: 'recoverpass' });

    const dataReq = {
      token,
      usuario: this.recoverPassData.usuario.trim(),
      codigo: this.recoverPassData.validCode.trim(),
      clave: this.recoverPassData.clave.trim()
    };

    this.loading = true;

    this.loginService.cambiarClave(dataReq).then((res: any) => {

      this.loading = false;

      if (res.response) {
        this.recoverPassData.etapa = 4;
      } else {
        this.alertMessageReg = this.ln.o('ERRCHPASS', this.lang).toUpperCase();
      }

    }).catch(err => {

      this.loading = false;
      this.alertMessageReg = this.ln.o('ERRCHPASS', this.lang).toUpperCase();

    });
  }

  resetInput(index, indexMsg) {
    this.recoverPassData[index] = '';
    this.recoverPassData[indexMsg] = '';
  }
}
