import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { UserTaskResponseDto } from '@app/models/tasksitems.models';
import { TaskitemsService } from '@app/core/services/taskitems.service';
import { AuthService } from '@app/core/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import {MatSort} from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { ErrorUtilsService } from '@app/core/utils/error-utils.service';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-my-tasks',
  standalone : true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTableModule, 
    MatPaginatorModule,
    MatIcon,
    MatFormField ,
    MatLabel,
    MatSort,
    MatInputModule,
    RouterLink,
    MatTooltip
  ],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss'
})
export class MyTasksComponent implements AfterViewInit {
  tasks : any[] = [];
  displayedColumns:string[] = ['Title','DueDate','Status','Priority']
  dataSource  = new MatTableDataSource<UserTaskResponseDto>();
  
  @ViewChild(MatPaginator) paginator ! : MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;

constructor(private taskService : TaskitemsService,
  private authService : AuthService,
  private errorUtils : ErrorUtilsService){}
  
  ngOnInit() : void {
    debugger
    const userInfo = this.authService.getUserIdFromToken();

    if(!userInfo ||userInfo.UserId == undefined )
    {
      console.error('No valid user information in token');
      return;
    }
        const userId: number  = userInfo?.UserId;

    this.taskService.getTasks(userId).subscribe({
       next:(task) => {
        this.tasks = task ?? [];
        this.dataSource.filterPredicate = (data: UserTaskResponseDto, filter: string): boolean => {
        const searchString = filter.trim().toLowerCase();
      return (
          data.Title?.toLowerCase().includes(searchString) ||
          data.Status?.toLowerCase().includes(searchString) ||
        data.Priority?.toLowerCase().includes(searchString)
        );
      };
          this.dataSource.data = task;
          this.dataSource.paginator = this.paginator;
       },
       error : this.errorUtils.handleError
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(event : Event)
  {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.dataSource.filter =filterValue;
  }
}
