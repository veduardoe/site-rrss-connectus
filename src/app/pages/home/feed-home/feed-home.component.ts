import { Component, OnInit } from '@angular/core';
import { ArticulosPublicosService } from 'src/shared/services/articulospublicos.service';
import { ConexionService } from 'src/shared/services/conexion.service';
import { EventosService } from 'src/shared/services/eventos.service';
import { PostsService } from 'src/shared/services/posts.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-feed-home',
  templateUrl: './feed-home.component.html',
  styleUrls: ['./feed-home.component.scss']
})
export class FeedHomeComponent implements OnInit {

  publishText = '';
  loading = false;
  posts = [];
  conexionesEspera = [];
  eventos = [];
  articulospublicos = [];

  constructor(
    public utils: UtilsService,
    private postService: PostsService,
    private conexionesService: ConexionService,
    private eventosService: EventosService,
    private articulosPublicosService: ArticulosPublicosService
  ) { }

  ngOnInit(): void {
    this.getPosts();
    this.getEventos();
    this.getConexionesEspera();
    this.getArticulosPublicos();
  }

  getArticulosPublicos() {
    this.articulosPublicosService.getArticulosPublicos('EN').then((res: any) => {
      this.articulospublicos = res.data;
      console.log(this.articulospublicos);
    });
  }

  getPosts() {
    this.loading = true;
    this.postService.getPosts().then((res: any) => {
      setTimeout(() => {
        this.loading = false;
        this.posts = res.data;
      }, 1000);
    });
  }

  getConexionesEspera() {
    this.conexionesService.conexionesEnEspera().then((res: any) => {
      this.conexionesEspera = res?.data.map(item => {
        return item.usuario;
      });
    });
  }

  deletePost(i) {
    this.posts.splice(i, 1);
    this.utils.fnMessage('Post deleted!');
  }

  getEventos() {
    this.eventosService.obtenerEventos().then((ev: any) => {
      this.eventos = this.utils.procesarEventosLateral(ev.data);
    });
  }

  goToSite(){
    window.open('http://site.connectus.global/home', '_blank');
  }
}
