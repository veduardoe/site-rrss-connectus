import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UtilsService } from 'src/shared/services/utils.service';
import slugify from 'slugify';

@Component({
  selector: 'app-incoming-events',
  templateUrl: './incoming-events.component.html',
  styleUrls: ['./incoming-events.component.scss',
  '../home-suggestions/home-suggestions.component.scss']
})
export class IncomingEventsComponent implements OnInit {

  @Input() limit = 4;
  @Input() eventos = [];
  @Input() fromHome = true;
  
  constructor(
    public utils: UtilsService
  ) { }

  ngOnInit(): void {
  }

  goToEvent(id, titulo){
    const slug = slugify(titulo);
    const path = `https://site.connectus.global/event/${id}/${slug}`;
    window.open(path, '_blank');
  }

}
