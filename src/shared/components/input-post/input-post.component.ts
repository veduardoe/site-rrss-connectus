import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-post',
  templateUrl: './input-post.component.html',
  styleUrls: ['./input-post.component.scss']
})
export class InputPostComponent implements OnInit {

  @Input() placeholder;

  publishText = '';

  constructor() { }

  ngOnInit(): void {
  }

}
