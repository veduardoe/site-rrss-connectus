import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.scss']
})
export class HomeSliderComponent implements OnInit {

  sliders = [
    { index: 1, sclass: { 'slide-1' : true, active: true } },
    { index: 2, sclass: { 'slide-2' : true, active: false } }
  ];
  counter = 0;
  interval;

  constructor() { }

  ngOnInit(): void {

    this.interval = setInterval(()=> {
      this.navigate('next')
    },8000);

  }

  navigate(dir, fromBtn = false){

    if(dir === 'next'){
      this.counter++;
    }else{
      this.counter--;
    }

    if(this.counter > (this.sliders.length - 1)){
      this.counter = 0;
    }else if(this.counter < 0){
      this.counter = this.sliders.length - 1;
    }

    this.sliders.forEach( val => {
      val.sclass.active = false;
    });
    this.sliders[this.counter].sclass.active = true;

    if(fromBtn){
      clearInterval(this.interval);
      this.interval = setInterval(()=> {
        this.navigate('next');
      },10000);
    }

  }
}
