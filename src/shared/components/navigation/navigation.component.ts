import { Component, HostListener, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.onScroll();
  }

  
  @HostListener('window:scroll', [])
  onScroll(): void {
    const top = $(window).scrollTop();
    console.log(top)
    if(top > 445){
      $("#navigation").addClass("fixed");
    }else{
      $("#navigation").removeClass("fixed");
    }
  }

  
}
