import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from 'src/shared/services/common.service';

@Component({
  selector: 'app-simple-text',
  templateUrl: './simple-text.component.html',
  styleUrls: ['./simple-text.component.scss']
})
export class SimpleTextComponent implements OnInit {

  sliders = [];
  counter = 0;
  interval;

  constructor(
    public commonService: CommonService,
    private sanitize: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getBanners();
  }

  
  getBanners(){
    this.commonService.getBanners('EN', 'TEXTUAL_BANNER').then( (res:any) => {
      let i = 1;
      res.data.forEach((val, key) => {
          this.sliders.push({
            index: i,
            titulo: this.sanitize.bypassSecurityTrustHtml(val.titulo),
            tituloResaltado: this.sanitize.bypassSecurityTrustHtml(val.tituloResaltado),
            url: this.sanitize.bypassSecurityTrustHtml(val.url),
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

  goTo(url){
    window.open(url, '_new')
  }

}
