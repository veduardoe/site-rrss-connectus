import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/shared/services/login.service';
import { UtilsService } from 'src/shared/services/utils.service';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ENV } from 'src/environments/environment';
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
    private router: Router
  ) { }

  ngOnInit(): void {
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
      this.loginData.usuarioMsg = 'User o Email is required.';
    } else {
      this.loginData.usuarioError = false;
      this.loginData.usuarioMsg = '';
    }

    if (this.loginData.clave.length < 8 || this.loginData.clave.length > 15) {
      this.loginData.claveError = true;
      this.loginData.claveMsg = 'The password must contain between 8 and 15 characters.';
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
            this.alertMessage = 'ACCOUNT IS LOCKED';
            break;

          case 'INVALID_PASSWORD':
            this.alertMessage = 'WRONG USERNAME AND PASSWORD';
            break;

          case 'ERROR_RECAPTCHA':
            this.alertMessage = 'USER COULD NOT BE VALIDATED. TRY AGAIN LATER';
            break;

          default:
            this.alertMessage = 'CANNOT LOGIN NOW. TRY AGAIN LATER';
            break;

        }
        setTimeout(() => {
          this.loading = false;
        });
      }

    }).catch(err => {
      this.loading = false;
      this.alertMessage = 'CANNOT LOGIN NOW. TRY AGAIN LATER';

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
      this.loginService.postRegister(data).then((res: any) => {

        if (res.response) {
          this.loginData.usuario = data.usuario;
          this.loginData.clave = data.clave;
          this.login();

        } else {

          this.alertMessageReg = 'CANNOT REGISTER NOW';
          setTimeout(() => {
            this.loading = false;
          });

        }

      }).catch(err => {

        switch (err.error.code) {

          case 'USUARIO_EXISTE':
            this.alertMessageReg = 'USERNAME IS NOT AVAILABLE. USER ANOTHER...';
            break;

          case 'CORREO_EXISTE':
            this.alertMessageReg = 'EMAIL IS NOT AVAILABLE. USER ANOTHER...';
            break;

          case 'ERROR_RECAPTCHA':
            this.alertMessage = 'REQUEST COULD NOT BE VALIDATED. TRY AGAIN LATER';
            break;

          default:
            this.alertMessageReg = 'CANNOT REGISTER NOW. TRY AGAIN LATER';
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
      this.recoverPassData.usuarioMsg = 'EMAIL OR USERNAME IS REQUIRED. TRY AGAIN.';
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
        this.btnRecoverTxt = 'VALIDATE CODE';
      } else if (res.code === 'USUARIO_NO_ENCONTRADO') {
        this.alertMessageReg = 'EMAIL OR USERNAME WAS NOT FOUND. TRY AGAIN';
      } else {
        this.alertMessageReg = 'CANNOT RECOVER PASSWORD NOW. TRY AGAIN LATER';
      }

    }).catch(err => {

      this.loading = false;
      this.alertMessageReg = 'CANNOT RECOVER PASSWORD NOW. TRY AGAIN LATER';

    });
  }

  async validateCode() {
    
    this.recoverPassData.codigoError = false;
    this.recoverPassData.codigoMsg = '';

    if (!this.recoverPassData.validCode.trim()) {
      this.recoverPassData.codigoError = true;
      this.recoverPassData.codigoMsg = 'VALIDATION CODE IS REQUIRED. TRY AGAIN.';
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
        this.btnRecoverTxt = 'CHANGE PASSWORD';
      } else {
        this.alertMessageReg = 'VALIDATION CODE IS WRONG. TRY AGAIN';
      }

    }).catch(err => {

      this.loading = false;
      this.alertMessageReg = 'CANNOT VALIDATE THE CODE NOW. TRY AGAIN LATER';

    });
  }

  async changePassword() {
    
    this.recoverPassData.claveError = false;
    this.recoverPassData.claveMsg = '';
    this.recoverPassData.cclaveError = false;
    this.recoverPassData.cclaveMsg = '';

    if (!this.recoverPassData.clave.trim()) {
      this.recoverPassData.claveError = true;
      this.recoverPassData.claveMsg = 'PASSWORD IS REQUIRED. TRY AGAIN.';
      return;
    }

    if (!this.recoverPassData.confirmarClave.trim()) {
      this.recoverPassData.cclaveError = true;
      this.recoverPassData.cclaveMsg = 'CONFIRM PASSWORD IS REQUIRED. TRY AGAIN.';
      return;
    }

    if(this.recoverPassData.clave.trim().length < 8 || this.recoverPassData.clave.trim().length > 15){
      this.alertMessageReg = 'PASSWORD MUST CONTAIN BETWEEN 8 AND 15 CHARACTERS. TRY AGAIN';
      return;
    }

    if(this.recoverPassData.clave.trim() !== this.recoverPassData.confirmarClave.trim()){
      this.alertMessageReg = 'PASSWORDS DO NOT MATCH. TRY AGAIN';
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
        this.alertMessageReg = 'PASSWORD COULD NOT BE CHANGED. TRY AGAIN';
      }

    }).catch(err => {

      this.loading = false;
      this.alertMessageReg = 'CANNOT CHANGE THE PASSWORD NOW. TRY AGAIN LATER';

    });
  }

  resetInput(index, indexMsg) {
    this.recoverPassData[index] = '';
    this.recoverPassData[indexMsg] = '';
  }
}
