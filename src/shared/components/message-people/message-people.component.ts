import { Component, Input, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { Ln } from 'src/shared/services/language.service';

@Component({
  selector: 'app-message-people',
  templateUrl: './message-people.component.html',
  styleUrls: ['./message-people.component.scss']
})
export class MessagePeopleComponent implements OnInit {

  @Input() right = false;
  @Input() data;
  @Input() from;
  
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  myInfo;

  constructor(
    public authService: AuthService,
    public ln: Ln
  ) { }

  ngOnInit(): void {
    this.myInfo = this.authService.getAuthInfo();

  }


}
