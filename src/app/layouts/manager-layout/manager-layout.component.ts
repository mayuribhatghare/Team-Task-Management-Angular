import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
@Component({
  selector: 'app-manager-layout',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './manager-layout.component.html',
  styleUrl: './manager-layout.component.scss'
})
export class ManagerLayoutComponent {
 userName : string = '';
  role: string = '';


  constructor(private authService :AuthService ,
    private router : Router)
  {
    const userInfo = authService.getUserIdFromToken();

    if(userInfo)
    {
        this.userName= userInfo.UserName;
        this.role =userInfo.Role;
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
