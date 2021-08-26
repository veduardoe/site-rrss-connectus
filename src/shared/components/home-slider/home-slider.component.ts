import { Component, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { CommonService } from 'src/shared/services/common.service';

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.scss']
})
export class HomeSliderComponent implements OnInit {

  sliders = [];
  counter = 0;
  interval;
  routeFicheros = ENV.FICHEROS;

  constructor(
    public commonService: CommonService
  ) { }

  ngOnInit(): void {
   
    this.getBanners();
  }

  getBanners(){
      this.commonService.getBanners('EN').then( (res:any) => {
        let i = 1;
        res.data.forEach((val, key) => {
          this.sliders.push({
            index: i,
            dataBanner: val, 
            sclass: {
              active: i === 1 
            }
          })
          i++;
        });
        
        if(this.sliders.length > 0){
          this.interval = setInterval(()=> {
            this.navigate('next')
          },8000);
        } 

      });

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
