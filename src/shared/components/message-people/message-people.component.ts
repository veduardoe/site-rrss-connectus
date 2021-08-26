import { Component, Input, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';

@Component({
  selector: 'app-message-people',
  templateUrl: './message-people.component.html',
  styleUrls: ['./message-people.component.scss']
})
export class MessagePeopleComponent implements OnInit {

  @Input() right = false;
  @Input() data;
  routeFotoPerfil = ENV.FOTOS_PERFIL;
  myInfo;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.myInfo = this.authService.getAuthInfo();

  }

}
