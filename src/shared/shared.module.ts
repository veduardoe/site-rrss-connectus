import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from 'src/app/app.material.module';
import { HeaderProfileComponent } from './components/header-profile/header-profile.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { BarPageComponent } from './components/bar-page/bar-page.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { HomeSuggestionsComponent } from './components/home-suggestions/home-suggestions.component';
import { BarPictureComponent } from './components/bar-picture/bar-picture.component';
import { PostItemArticleComponent } from './components/post-item-article/post-item-article.component';
import { ArticlesSuggestionComponent } from './components/articles-suggestion/articles-suggestion.component';
import { IncomingEventsComponent } from './components/incoming-events/incoming-events.component';
import { ChatPeopleComponent } from './components/chat-people/chat-people.component';
import { InputPostComponent } from './components/input-post/input-post.component';
import { MessagePeopleComponent } from './components/message-people/message-people.component';
import { AwaitingConnectionComponent } from './components/awaiting-connection/awaiting-connection.component';
import { HomeSliderComponent } from './components/home-slider/home-slider.component';
import { FooterComponent } from './components/footer/footer.component';
import { SimpleTextComponent } from './components/simple-text/simple-text.component';
import { HomeArticlesComponent } from './components/home-articles/home-articles.component';
import { LightgalleryModule } from 'lightgallery/angular';
import { CommentsComponent } from './components/comments/comments.component';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { ConexionService } from './services/conexion.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxPaginationModule } from 'ngx-pagination';
import { EventosService } from './services/eventos.service';
import { EmojisPickerComponent } from './components/emojis-picker/emojis-picker.component';
import { AngularEmojisModule } from 'angular-emojis';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { Ln } from './services/language.service';
import { UtilsService } from './services/utils.service';
import { NotificacionesComponent } from 'src/app/pages/home/notificaciones/notificaciones.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FlexLayoutModule,
        AngularMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        LightgalleryModule,
        DragDropModule ,
        NgxPaginationModule,
        AngularEmojisModule,
        AngularEditorModule 

    ],
    declarations: [
        HeaderProfileComponent,
        NavigationComponent,
        BarPageComponent,
        PostItemComponent,
        HomeSuggestionsComponent,
        BarPictureComponent,
        FooterComponent,
        PostItemArticleComponent,
        ArticlesSuggestionComponent,
        IncomingEventsComponent,
        ChatPeopleComponent,
        InputPostComponent,
        MessagePeopleComponent,
        AwaitingConnectionComponent,
        HomeSliderComponent,
        SimpleTextComponent,
        HomeArticlesComponent,
        CommentsComponent,
        EmojisPickerComponent,
    ],
    providers: [
        UserService,
        AuthService,
        ConexionService, 
        EventosService,
        Ln
    ],
    exports: [
        CommonModule,
        HttpClientModule,
        FlexLayoutModule,
        AngularMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HeaderProfileComponent,
        NavigationComponent,
        BarPageComponent,
        PostItemComponent,
        HomeSuggestionsComponent,
        BarPictureComponent,
        PostItemArticleComponent,
        ArticlesSuggestionComponent,
        IncomingEventsComponent,
        ChatPeopleComponent,
        InputPostComponent,
        MessagePeopleComponent,
        AwaitingConnectionComponent,
        HomeSliderComponent,
        FooterComponent,
        SimpleTextComponent,
        HomeArticlesComponent,
        CommentsComponent,
        DragDropModule,
        AngularEmojisModule,
        EmojisPickerComponent,
        AngularEditorModule 
    ]
})
export class SharedModule { }