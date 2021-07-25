import { NgModule } from "@angular/core";
import { UtilsService } from "src/shared/services/utils.service";
import { SharedModule } from "src/shared/shared.module";
import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileComponent } from './profile.component';

@NgModule({
    imports: [
        SharedModule,
        ProfileRoutingModule
    ],
    declarations:[
    ProfileComponent
  ],
    providers:[
      UtilsService
    ],
    entryComponents:[
    ]
})
export class ProfileModule { }
