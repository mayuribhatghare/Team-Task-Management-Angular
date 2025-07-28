import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs'
import { UserDropDownDto, UserResponseDto } from '@app/models/users.models';
import { environment } from '@environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorUtilsService } from '../utils/error-utils.service';
import { ChangeUserRoleDto } from '@app/models/manager.models';


@Injectable({
  providedIn: 'root'
})

export class ManagerService{

    private baseUrl = `${environment.apiUrl}/users`;

    constructor(private http : HttpClient ,private errorUtils : ErrorUtilsService){}

    getAllUsersForDropDown(includeManagers? : boolean):Observable<UserDropDownDto[]>
    {
       let params = new HttpParams();
        if (includeManagers) {
          params = params.set('includeManagers', 'true');
        }

      return this.http.get<UserDropDownDto[]>(`${this.baseUrl}/all-users`, {params});
    }

    changeUserRole(payload : ChangeUserRoleDto) : Observable<any>
    {
      return this.http.patch(`${this.baseUrl}/changerole`,payload);
      
    }
    
}
