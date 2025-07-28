import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs'
import {LoginDto, UserRegisterDto,AuthResponseDto} from '@app/models/auth.models';
import { UserDropDownDto, UserResponseDto } from '@app/models/users.models';
import { environment } from '@environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorUtilsService } from '../utils/error-utils.service';

@Injectable({
  providedIn: 'root'
})

export class UserService{

    private baseUrl = `${environment.apiUrl}/users`;

    constructor(private http : HttpClient ,private errorUtils : ErrorUtilsService){}

    getUserById(id : number):Observable<UserResponseDto>{
      debugger
        return this.http.get<UserResponseDto>(`${this.baseUrl}/${id}`);
    }

   
}