import { NgModule } from "@angular/core";
import { AuthService } from "src/shared/services/auth.service";
import { LoginService } from "src/shared/services/login.service";
import { UtilsService } from "src/shared/services/utils.service";
import { SharedModule } from "src/shared/shared.module";
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from './login.component';

@NgModule({
    imports: [
        SharedModule,
        LoginRoutingModule
    ],
    declarations:[
      LoginComponent
  ],
    providers:[
      UtilsService,
      AuthService,
      LoginService
    ],
    entryComponents:[
    ]
})
export class LoginModule { }
