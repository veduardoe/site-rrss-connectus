import { Component, OnInit } from '@angular/core';
import { Ln } from 'src/shared/services/language.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  curView = 'userInformation';

  viewDescription: any = {}

  constructor(
    public utils: UtilsService,
    public ln: Ln
  ) {

    this.viewDescription = {
      userInformation: { det: 'USIN', icon: 'fal fa-user' },
      privacy: { det: 'PREF', icon: 'fal fa-user-secret' },
      accessibility: { det: 'Accessibility', icon: 'fal fa-universal-access' },
      security: { det: 'SECTY', icon: 'fal fa-shield-check' },
      help: { det: 'HELP', icon: 'fal fa-hands-helping' }
    }
  }

  ngOnInit(): void {
  }

}
