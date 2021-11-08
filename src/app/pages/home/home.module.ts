import { NgModule } from "@angular/core";
import { SharedModule } from "src/shared/shared.module";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { InterestInfoComponent } from './interest-info/interest-info.component';
import { FeedHomeComponent } from './feed-home/feed-home.component';
import { ArticlesComponent } from './articles/articles.component';
import { EventsComponent } from './events/events.component';
import { MessagingComponent } from './messaging/messaging.component';
import { ConnectionsComponent } from './connections/connections.component';
import { SettingsComponent } from './settings/settings.component';
import { DownloadContentComponent } from './download-content/download-content.component';
import { ViewContentComponent } from './download-content/view-content/view-content.component';
import { ViewArticleComponent } from './articles/view-article/view-article.component';
import { UtilsService } from "src/shared/services/utils.service";
import { UserInformationComponent } from './settings/user-information/user-information.component';
import { PrivacyComponent } from './settings/privacy/privacy.component';
import { AccessibilityComponent } from './settings/accessibility/accessibility.component';
import { SecurityComponent } from './settings/security/security.component';
import { HelpComponent } from './settings/help/help.component';
import { UserService } from "src/shared/services/user.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from "src/app/app.interceptor";
import { CommonService } from "src/shared/services/common.service";
import { PostsService } from "src/shared/services/posts.service";
import { NgxPaginationModule } from 'ngx-pagination';
import { MensajesService } from "src/shared/services/mensajes.service";
import { ContenidoDescargablesService } from "src/shared/services/contenidodescargable.service";
import { ArticulosPublicosService } from "src/shared/services/articulospublicos.service";
import { NotificacionesComponent } from "./notificaciones/notificaciones.component";
@NgModule({
    imports: [
        SharedModule,
        HomeRoutingModule,
        NgxPaginationModule
    ],
    declarations: [
        HomeComponent,
        InterestInfoComponent,
        FeedHomeComponent,
        ArticlesComponent,
        EventsComponent,
        MessagingComponent,
        ConnectionsComponent,
        SettingsComponent,
        DownloadContentComponent,
        ViewContentComponent,
        ViewArticleComponent,
        UserInformationComponent,
        PrivacyComponent,
        AccessibilityComponent,
        SecurityComponent,
        HelpComponent,
        NotificacionesComponent
    ],
    providers: [
        UserService,
        CommonService,
        PostsService,
        MensajesService,
        ContenidoDescargablesService,
        ArticulosPublicosService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },

    ],
    entryComponents: [
    ]
})
export class HomeModule { }
