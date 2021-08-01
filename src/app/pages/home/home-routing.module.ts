import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthService } from "src/shared/services/auth.service";
import { ArticlesComponent } from "./articles/articles.component";
import { ViewArticleComponent } from "./articles/view-article/view-article.component";
import { ConnectionsComponent } from "./connections/connections.component";
import { DownloadContentComponent } from "./download-content/download-content.component";
import { ViewContentComponent } from "./download-content/view-content/view-content.component";
import { EventsComponent } from "./events/events.component";
import { FeedHomeComponent } from "./feed-home/feed-home.component";
import { HomeComponent } from "./home.component";
import { MessagingComponent } from "./messaging/messaging.component";
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate:[AuthService], children: [
      { path: 'homefeed', component: FeedHomeComponent },
      { path: 'articles', component: ArticlesComponent },
      { path: 'articles/view', component: ViewArticleComponent },
      { path: 'events', component: EventsComponent },
      { path: 'messaging', component: MessagingComponent },
      { path: 'connections', component: ConnectionsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'downloadble-content', component: DownloadContentComponent},
      { path: 'downloadble-content/view', component: ViewContentComponent},

      {
        path: '',
        redirectTo: 'homefeed',
        pathMatch: 'full'
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
