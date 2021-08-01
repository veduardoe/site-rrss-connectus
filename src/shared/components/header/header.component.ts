import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';
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
    public utils:UtilsService,
    public authService:AuthService
  ) { }

  ngOnInit(): void {
  }

  goToHome(){
    this.router.navigate(['/home/homefeed']);
  }
  
  logout(){
    this.authService.logout();
  }
}
