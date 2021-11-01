import { Component, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { CommonService } from 'src/shared/services/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Ln } from 'src/shared/services/language.service';

@Component({
  selector: 'app-bar-picture',
  templateUrl: './bar-picture.component.html',
  styleUrls: ['./bar-picture.component.scss']
})
export class BarPictureComponent implements OnInit {

  sliders = [];
  counter = 0;
  interval;
  routeFicheros = ENV.FICHEROS;
  
  constructor(
    public commonService: CommonService,
    private sanitize: DomSanitizer,
    public ln: Ln
  ) { }

  ngOnInit(): void {
    this.getBanners();
  }

  
  getBanners(){
    this.commonService.getBanners(this.ln.gln(), 'SIDE_BANNER').then( (res:any) => {
      let i = 1;
      res.data.forEach((val, key) => {
          this.sliders.push({
            index: i,
            titulo: this.sanitize.bypassSecurityTrustHtml(val.titulo),
            tituloResaltado: this.sanitize.bypassSecurityTrustHtml(val.tituloResaltado),
            url: val.url,
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
