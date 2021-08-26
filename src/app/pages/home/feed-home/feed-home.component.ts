import { Component, OnInit } from '@angular/core';
import { ConexionService } from 'src/shared/services/conexion.service';
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

  constructor(
    public utils: UtilsService,
    private postService: PostsService,
    private conexionesService: ConexionService
  ) { }

  ngOnInit(): void {
    this.getPosts();
    this.getConexionesEspera();
  }

  getPosts() {
    this.loading = true;
    this.postService.getPosts().then((res: any) => {
      setTimeout(()=>{
        this.loading = false;
        this.posts = res.data;
      },1000);
    });
  }

  getConexionesEspera(){
    this.conexionesService.conexionesEnEspera().then( (res:any) => {
      this.conexionesEspera = res?.data.map( item => {
        return item.usuario;
      });
    });
  }

  deletePost(i){
    this.posts.splice(i, 1);
    this.utils.fnMessage('Post deleted!')
  }
}
