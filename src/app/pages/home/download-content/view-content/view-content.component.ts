import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ENV } from 'src/environments/environment';
import { ContenidoDescargablesService } from 'src/shared/services/contenidodescargable.service';
import { Ln } from 'src/shared/services/language.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-view-content',
  templateUrl: './view-content.component.html',
  styleUrls: ['./view-content.component.scss']
})
export class ViewContentComponent implements OnInit {

  items = [];
  routeHostStorage = ENV.HOST_STORAGE;
  pathContenidoDescargable = '/contenidosdescargables%2F';
  loading = true;
  idCategoria = null;
  categoria = null;

  constructor(
    public contenidoDescargableService: ContenidoDescargablesService,
    public aRouter: ActivatedRoute,
    public router: Router,
    public utils: UtilsService,
    public ln: Ln
  ) { }

  ngOnInit(): void {

    this.aRouter.queryParams.subscribe(async param => {

      if (param.item) {

        this.idCategoria = param.item;
        this.loading = true;
        const contDesService = this.contenidoDescargableService.obtenerCategorias({ id: param.item });
        const contDescarables = this.contenidoDescargableService.obtenerContenidos({ idCategoriaDescargable: param.item });
        const response: any = await Promise.all([contDesService, contDescarables]);
        
        if (response[0].data.length === 1){
          this.categoria = response[0].data[0]
          this.items = response[1].data;
        }else{
          this.utils.fnMainDialog('Error', this.ln.o('NORESULTS'), 'message');
          this.router.navigate(['/home/downloadble-content']);
        }
        
        setTimeout(()=> {
          this.loading = false;
        },2000);

      } else {
        this.utils.fnMainDialog('Error', this.ln.o('NORESULTS'), 'message');
        this.router.navigate(['/home/downloadble-content']);
      }
    });
  }

  getCategorias() {
    this.loading = true;
    this.contenidoDescargableService.obtenerCategorias({ idioma: this.ln.gln()})
  }

  openFile(file){
    const urlFile = this.routeHostStorage + this.pathContenidoDescargable + file + '?alt=media';
    window.open(urlFile, '_blank');
  }
}
