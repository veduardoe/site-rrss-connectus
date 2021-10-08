import { Component, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { ContenidoDescargablesService } from 'src/shared/services/contenidodescargable.service';

@Component({
  selector: 'app-download-content',
  templateUrl: './download-content.component.html',
  styleUrls: ['./download-content.component.scss']
})
export class DownloadContentComponent implements OnInit {

  items = [];
  routeHostStorage = ENV.HOST_STORAGE;
  pathContenidoDescargable = '/contenidosdescargables%2F';
  loading = false;

  constructor(
    public contenidoDescargableService: ContenidoDescargablesService
  ) { }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(){
    this.loading = true;
    this.contenidoDescargableService.obtenerCategorias({}).then((res: any) => {
      this.items = res.data;
      setTimeout(()=>{
        this.loading = false;
      },2000);
    }).catch( err => {
      setTimeout(()=>{
        this.loading = false;
      },2000);
    });
  }

}
