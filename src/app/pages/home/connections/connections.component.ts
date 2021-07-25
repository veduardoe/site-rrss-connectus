import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss',
]
})
export class ConnectionsComponent implements OnInit {

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit(): void {
  }

}
