import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EMOJIS } from 'src/environments/emojis';

@Component({
  selector: 'app-emojis-picker',
  templateUrl: './emojis-picker.component.html',
  styleUrls: ['./emojis-picker.component.scss']
})
export class EmojisPickerComponent implements OnInit {

  @Output() emojiSelected = new EventEmitter();

  emojisjSON =  EMOJIS;
  emojisArray = [];

  constructor() { }

  ngOnInit(): void {

    Object.keys(this.emojisjSON).forEach( key => {
      this.emojisArray.push(key);
    });

  }

  getEmoji(e){
      this.emojiSelected.emit(e);
  }

}
