import { Component, OnInit } from '@angular/core';
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

  constructor(
    public utils: UtilsService,
    private postService: PostsService
  ) { }

  ngOnInit(): void {
    this.getPosts();
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

}
