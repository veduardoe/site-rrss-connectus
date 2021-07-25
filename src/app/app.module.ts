import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { SharedModule } from 'src/shared/shared.module';
import { FooterComponent } from 'src/shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './app.material.module';
import { UtilsService } from 'src/shared/services/utils.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
 //   FooterComponent    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    AppRouting,
    SharedModule
  ],
  providers: [
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
