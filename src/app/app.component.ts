import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'portal';

  constructor(
    public router: Router
  ) { }

  ngOnInit() {

    this.onScroll();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const top = $(window).scrollTop();
       // if(top >= 100){
          $("body, html").animate({
            scrollTop: 0
          },1000)
        //}
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const top = $(window).scrollTop();
    if (top > 0 || window.innerWidth <= 720) {
      $("header").addClass("fixed");
      $("#content-router").addClass("header-fixed");
    } else {
      $("header").removeClass("fixed");
      $("#content-router").removeClass("header-fixed");
    }
  }

}
