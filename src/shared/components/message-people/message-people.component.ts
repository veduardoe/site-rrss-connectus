import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import lgZoom from 'lightgallery/plugins/zoom';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { Ln } from 'src/shared/services/language.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-message-people',
  templateUrl: './message-people.component.html',
  styleUrls: ['./message-people.component.scss']
})
export class MessagePeopleComponent implements OnInit, OnDestroy {

  @Input() right = false;
  @Input() data;
  @Input() from;
  
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  routeFicheros = ENV.FICHEROS;

  myInfo;
  settings = {
    counter: false,
    plugins: [lgZoom]
  }
  constructor(
    public authService: AuthService,
    public ln: Ln
  ) { }

  ngOnInit(): void {
    this.myInfo = this.authService.getAuthInfo();
  }

  checkIfImage(a){
    return a.includes('|%PICX%|')
  }

  cleanPic(a){
    const file =  a.split('|%PICX%|').join('');
    return this.routeFicheros + file + '?alt=media';
  }

  ngOnDestroy(){
    $("body").removeAttr('style');
  }

}
