import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  plcFocus = false;

  constructor(
    public router:Router,
    public utils:UtilsService
  ) { }

  ngOnInit(): void {
  }

  goToHome(){
    this.router.navigate(['/home/homefeed']);
  }
  
}
