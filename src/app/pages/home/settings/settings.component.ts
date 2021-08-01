import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  curView = 'userInformation';

  viewDescription = {
    userInformation: { det : 'User Information', icon: 'fal fa-user' },
    privacy: { det : 'Privacy', icon: 'fal fa-user-secret' },
    accessibility: { det : 'Accessibility', icon: 'fal fa-universal-access' },
    security: { det : 'Security', icon: 'fal fa-shield-check' },
    help: { det : 'Help', icon: 'fal fa-hands-helping' }
  }

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit(): void {
  }

}
