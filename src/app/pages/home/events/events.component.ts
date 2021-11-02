import { Component, OnInit } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { CommonService } from 'src/shared/services/common.service';
import { EventosService } from 'src/shared/services/eventos.service';
import { UtilsService } from 'src/shared/services/utils.service';
import slugify from 'slugify';
import { Ln } from 'src/shared/services/language.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  p = 1;
  eventosRes = [];
  eventos = [];
  routeFicheros = ENV.FICHEROS;
  categorias = [];
  categoriaSelected;

  constructor(
    public utils:UtilsService,
    private eventosService: EventosService,
    private commonService: CommonService,
    public ln: Ln
  ) { }

  ngOnInit(): void {
    this.getEventos();
    this.getCategorias();
  }

  getEventos() {
    this.eventosService.obtenerEventos(this.ln.gln()).then((ev: any) => {
      this.eventosRes = this.utils.procesarEventosLateral(ev.data, true);
      this.eventos = this.utils.procesarEventosLateral(ev.data, false);
    });
  }

  getCategorias(){
    this.commonService.getCategorias().then( (res:any) => {
      this.categorias = res.data;
    });
  }

  goToEvent(id, titulo){
    const slug = slugify(titulo);
    const path = this.ln.gln() === 'ES' ? 'evento' : 'event';
    const url = `https://site.connectus.global/${path}/${id}/${slug}`;
    window.open(url, '_blank');
  }


}
