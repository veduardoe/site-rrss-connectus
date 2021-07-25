import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-item-article',
  templateUrl: './post-item-article.component.html',
  styleUrls: ['./post-item-article.component.scss',
              './../post-item/post-item.component.scss']
})
export class PostItemArticleComponent implements OnInit {

  @Input() title;
  @Input() image;
  @Input() category;
  @Input() view;
  
  constructor() { }

  ngOnInit(): void {
  }

}
