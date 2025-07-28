import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserDropDownDto } from '@app/models/users.models';
import {  AssignedTaskManagerResponseDto, UserTaskResponseDto } from '@app/models/tasksitems.models';
import { ManagerService } from '@app/core/services/manager.service';
import { TaskitemsService } from '@app/core/services/taskitems.service';
import { NotificationService } from '@app/core/services/notification.service';
import { AuthService } from '@app/core/services/auth.service';
import { ErrorUtilsService } from '@app/core/utils/error-utils.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SharedDialogComponent } from '@app/shared/shared-dialog/shared-dialog.component';
@Component({
  selector: 'app-viewtask',
  imports: 
  [ CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule
  ],
  templateUrl: './viewtask.component.html',
  styleUrl: './viewtask.component.scss'
})
export class ViewtaskComponent {

  filteredTasks = new MatTableDataSource<AssignedTaskManagerResponseDto>();
  displayedColumns:string[] = [];

    users : UserDropDownDto[] =[];
    isDarkMode :boolean= true;
    tasks :any[] =[];
    selectedUserId : number | null =null;
    tableReady : boolean = false;
    role?: string ='';

    @ViewChild(MatPaginator) paginator! :MatPaginator;
    @ViewChild(MatSort) sort! : MatSort;

    constructor(private taskService : TaskitemsService,
    private authService : AuthService,
    private errorUtils : ErrorUtilsService,
    private managerService : ManagerService,
    private notification : NotificationService,
    private router:Router,
    private dialog :MatDialog
    ) {}

    ngOnInit()
    {
      debugger;
      const userInfo = this.authService.getUserIdFromToken();
      if(userInfo == null || userInfo.UserId == undefined)
      {
        console.error("No valid information found in token");
      }

      this.role = userInfo?.Role

      this.loadUsersDropdown();     
      this.displayedColumns =['Title', 'Description', 'Status', 'Priority', 'DueDate', 'UserName','Action'];
      console.log("colums",this.displayedColumns);
    }

    loadUsersDropdown()
    {
      debugger
       this.managerService.getAllUsersForDropDown().subscribe({
        next :(usersdrp) =>{
          this.users = usersdrp
          console.log(this.users);
        },
        error : this.errorUtils.handleError.bind(this.errorUtils)
       })
    }


    ngAfterViewInit() : void
    {
      this.filteredTasks.paginator = this.paginator;
      this.filteredTasks.sort =this.sort;

       // Explicit default pageSize
  //this.paginator._changePageSize(this.paginator.pageSize);
    }

    toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  onUserChange(userId :number){
    debugger
  this.selectedUserId =userId;

    this.taskService.getAssignedTasktoUser(this.selectedUserId).subscribe({
      next:(taskassigned) =>{
        debugger
        this.filteredTasks = new MatTableDataSource(taskassigned); // ✅ important
      this.filteredTasks.sort = this.sort;

      // ✅ Reset paginator with new data
      setTimeout(() => {
        this.filteredTasks.paginator = this.paginator;
        this.paginator.pageIndex = 0;
        this.paginator._changePageSize(this.paginator.pageSize); // Force UI update
      });

      this.tableReady = true;
      this.tasks = taskassigned;
      },
      error : this.errorUtils.handleError.bind(this.errorUtils)
    })
  }

  viewTask(taskId : number) : void
  {
    debugger
    const selectedUserId = this.selectedUserId;

    if(this.role == "User")
      this.router.navigate(['/users/update-tasks',taskId,selectedUserId]);
    
    else if(this.role == "Manager")
      this.router.navigate(['manager/update-tasks',taskId,selectedUserId])
  }
  deleteTask(taskId : number ):void{
        debugger
    if(!taskId) return ;

    const dialogRef= this.dialog.open(SharedDialogComponent,{
      width :'350 px',
      data :{
        title : 'Confirm Delete',
        message: 'Are you sure you want to delete this task?'
      }
    })

    dialogRef.afterClosed().subscribe(result =>{
    if(result == true) {

      this.taskService.deleteTask(taskId).subscribe({
      next : () =>{
        debugger
        this.notification.showSuccess("Task deleted successfully");

        //Refresh the list
        if(this.selectedUserId !== null)
        {
          this.onUserChange(this.selectedUserId)
        }
      },
      error : this.errorUtils.handleError.bind(this.errorUtils)
      })
    }
    })
  }
}
