import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/shared/services/login.service';
import { UtilsService } from 'src/shared/services/utils.service';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  loginData = {
    usuario: '',
    clave: '',
    usuarioError: false,
    claveError: false,
    usuarioMsg: '',
    claveMsg: ''
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
  }

  restoreValidation(item) {
    this.loginData[item] = false;
  }

  clearLogin(){
    this.loginData = {
      usuario: '',
      clave: '',
      usuarioError: false,
      claveError: false,
      usuarioMsg: '',
      claveMsg: ''
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
  }

  login() {

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

    const data = {
      usuario: this.loginData.usuario,
      clave: this.loginData.clave
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

          default:
            this.alertMessage = 'CANNOT LOGIN NOW';
            break;

        }
        setTimeout(() => {
          this.loading = false;
        });
      }

    });

  }

  triggedValidation(touched) {
    const obj = this.registerForm.value;
    Object.keys(obj).forEach(key => {
      touched ? this.registerForm.get(key).markAsTouched() : this.registerForm.get(key).markAsUntouched()
    });
  }

  save() {

    this.triggedValidation(true);
    const data = this.registerForm.getRawValue();

    this.errorClave = data.clave.length < 8 || data.clave.length > 15;
    this.errorCorreo = data.email.length > 0 && !this.utils.validateEmail(data.email);

    if (this.registerForm.valid && !this.errorClave && !this.errorCorreo) {
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

      }).catch( err => {

        switch (err.error.code) {

          case 'USUARIO_EXISTE':
            this.alertMessageReg = 'USERNAME IS NOT AVAILABLE. USER ANOTHER...';
            break;

          case 'CORREO_EXISTE':
            this.alertMessageReg = 'EMAIL IS NOT AVAILABLE. USER ANOTHER...';
            break;

          default:
            this.alertMessageReg = 'CANNOT REGISTER NOW';
            break;

        }

        setTimeout(() => {
          this.loading = false;
        });

      });
    }

  }

}
