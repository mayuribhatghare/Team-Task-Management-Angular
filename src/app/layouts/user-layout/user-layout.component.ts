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
  selector: 'app-user-layout',
  standalone :true,
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
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent {
  userName : string = '';
  role: string = '';


  constructor(private authService :AuthService ,private router : Router)
  {
    const userInfo = authService.getUserIdFromToken();

    if(userInfo)
    {
        this.userName= userInfo.UserName;
        this.role =userInfo.Role;
    }
  }

  logout() :void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}