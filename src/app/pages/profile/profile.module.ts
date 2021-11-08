import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { InterceptorService } from "src/app/app.interceptor";
import { CommonService } from "src/shared/services/common.service";
import { PostsService } from "src/shared/services/posts.service";
import { UserService } from "src/shared/services/user.service";
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
      UserService,
      CommonService,
      PostsService,
      { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },

    ],
    entryComponents:[
    ]
})
export class ProfileModule { }
