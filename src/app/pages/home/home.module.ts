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

@NgModule({
    imports: [
        SharedModule,
        HomeRoutingModule
    ],
    declarations:[
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
    ],
    providers:[
        UtilsService
    ],
    entryComponents:[
    ]
})
export class HomeModule { }
