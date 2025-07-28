import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs'
import {LoginDto, UserRegisterDto, AuthResponseDto} from '@app/models/auth.models';
import { environment } from '@environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DecodeUserInfo, UserResponseDto } from '@app/models/users.models';
import  {jwtDecode} from 'jwt-decode';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorUtilsService } from '../utils/error-utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient , private errorUtils: ErrorUtilsService){}

  register(user:UserRegisterDto):Observable<UserResponseDto>{
    debugger
    return this.http.post<UserResponseDto>(`${this.baseUrl}/register`,user)

  }

  login(loginCredentials : LoginDto): Observable<AuthResponseDto>{
    debugger
    return this.http.post<AuthResponseDto>(`${this.baseUrl}/login`,loginCredentials)
    
  }

  saveToken(token : string): boolean {
    if(token){
      debugger
      localStorage.setItem('token',token);
      return true;
    }
    return false;
  }

  getToken() : string | null{
    return localStorage.getItem('token');
  }

  logout():void {
    localStorage.removeItem('token');
  }

    getUserIdFromToken(): DecodeUserInfo| null
    {
      debugger
        const token = localStorage.getItem('token');

        if(!token) return null;

        try
        {
          const decode : any = jwtDecode(token);
          return {
            UserId: Number(decode.UserId),
            UserName : decode.UserName ||'',
            Role : decode.Role||decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ''
          };
        }
      
      catch(err){
        console.error('Failed to decode token',err);
        return null;
      }
    }

    isLoggedIn():boolean{
    debugger
    const token = localStorage.getItem('token');
    return !!token;
  }
}

