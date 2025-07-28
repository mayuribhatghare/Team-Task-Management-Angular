import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { AssignedTaskManagerResponseDto, 
  AssignTaskToUserRequestDto, CommentAndTaskResponseDto, TaskCreateRequestDto,
   TaskCreateResponseDto, TaskReportDto, UnAssignedTaskResponseDto, UpdateTaskWithCommentRequestDto, UserTaskResponseDto } from '@app/models/tasksitems.models';
import { HttpParams } from '@angular/common/http';
import { TaskResponseByTaskIdDto } from '@app/models/tasksitems.models';
@Injectable({
  providedIn: 'root'
})
export class TaskitemsService {

  private baseUrl = `${environment.apiUrl}/taskitems`;

  constructor(private http : HttpClient) { }

  getTasks(userId?:number) : Observable<UserTaskResponseDto[]>{
    debugger
    let params = new HttpParams();
      if(userId != null)
      {
        params= params.set('userId',userId.toString());
      }
    
      return this.http.get<UserTaskResponseDto[]>(`${this.baseUrl}/tasks`,{params});
    }

    createTask(payload : TaskCreateRequestDto) :Observable<TaskCreateResponseDto>
    {
      debugger
      return this.http.post<TaskCreateResponseDto>
      (`${this.baseUrl}/manager/tasks/create`,payload)
    }
    unassignedTask() : Observable<UnAssignedTaskResponseDto[]> 
    {
      debugger
      return this.http.get<UnAssignedTaskResponseDto[]>
      (`${this.baseUrl}/manager/tasks/unassigned`)
    }

    assignTaskToUser(payload : AssignTaskToUserRequestDto) :Observable<any>{
      debugger
      return this.http.post<AssignTaskToUserRequestDto[]>
      (`${this.baseUrl}/manager/tasks/assign`,payload);
    }

    getAssignedTasktoUser(userId : number) :Observable<AssignedTaskManagerResponseDto[]>   
    {
      debugger
      return this.http.get<AssignedTaskManagerResponseDto[]>
      (`${this.baseUrl}/manager/tasks/assigned/${userId}`);
    }


    getTaskByTaskId(taskId: number ) : Observable<TaskResponseByTaskIdDto>
    {
      debugger
       return this.http.get<TaskResponseByTaskIdDto>
       (`${this.baseUrl}/taskdetails/${taskId}`);
    }

    updateTaskStatus(payload : UpdateTaskWithCommentRequestDto) :
    Observable<any>
    {
      debugger
      return this.http.put<void>
      (`${this.baseUrl}/usermanager/tasks/update-status`,payload);
    }

    getCommentForTask(taskId :number) : Observable<any>
    {
      debugger
      return this.http.get<CommentAndTaskResponseDto[]>
      (`${this.baseUrl}/comment/${taskId}`)
    }

    deleteComment(commentId : number) : Observable<void>
    {
      return this.http.delete<void>
      (`${this.baseUrl}/${commentId}`)
    }

    deleteTask(taskId : number) : Observable<void>
    {
      return this.http.delete<void>
      (`${this.baseUrl}/manager/tasks/${taskId}`)
    }

    getStatusPriorityMetaData() :Observable<any>  {
      return this.http.get<{status:any[];priority:any[]}>
      (`${this.baseUrl}/manager/tasks/metadata`);
    }

    getReport( params:{status :string;priority:string;userId :number | null}):Observable<TaskReportDto[]>
    {
      let queryParams = new HttpParams();
      if(params.status) 
        queryParams = queryParams.set('status',params.status);
      
      if(params.priority)
        queryParams = queryParams.set('priority',params.priority);
      
      if(params.userId != null && params.userId !== undefined)
        queryParams =queryParams.set('userId',params.userId.toString())
      
      return this.http.get<TaskReportDto[]>
      (`${this.baseUrl}/manager/tasks/report`,{params:queryParams});
    }
  }