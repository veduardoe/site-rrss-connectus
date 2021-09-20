import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as $ from 'jquery';
import { AuthService } from 'src/shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'portal';

  constructor(
    public router: Router,
    public auth: AuthService
  ) { }

  ngOnInit() {

    this.onScroll();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const top = $(window).scrollTop();
        $("body, html").scrollTop(0)
       // if(top >= 100){
          
        //}
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
  /*  const top = $(window).scrollTop();
    if (top > 0 || window.innerWidth <= 720) {
      $("header").addClass("fixed");
      $("#content-router").addClass("header-fixed");
    } else {
      $("header").removeClass("fixed");
      $("#content-router").removeClass("header-fixed");
    }*/
  }

}
