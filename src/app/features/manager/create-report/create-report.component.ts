import { Component, ViewChild } from '@angular/core';
import { TaskitemsService } from '@app/core/services/taskitems.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NotificationService } from '@app/core/services/notification.service';
import { ErrorUtilsService } from '@app/core/utils/error-utils.service';
import { MatIconModule } from '@angular/material/icon';
import { TaskReportDto } from '@app/models/tasksitems.models';
import { ManagerService } from '@app/core/services/manager.service';
import { debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-report',
  imports: [
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
    MatIconModule,
    MatOptionModule,
    CommonModule
  ],
  templateUrl: './create-report.component.html',
  styleUrl: './create-report.component.scss'
})
export class CreateReportComponent {

  statusOptions:any[] =[];
  priorityOptions:any[] =[];
  CreateReportSource = new MatTableDataSource<TaskReportDto>();
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort! :MatSort;
  reportForm! : FormGroup;
  displayedColumns:string[]=['TaskId','Title','UserName','Status','Priority',
    'DueDate','OverDue' ]
    totalTasks:number =0;
    users:UserDropDownDto[]=[];
    taskRow : any[] =[];

  constructor(private taskService : TaskitemsService,
    private errorUtils :ErrorUtilsService,
    private managerService : ManagerService,private fb :FormBuilder)
    {
      this.reportForm = this.fb.group({
        status:[''],
        priority:[''],
        userId:[''],
        search:['']
      })

    }

  ngOnInit():void
  {
    this.taskService.getStatusPriorityMetaData().subscribe({
      next :(resdata)=>{

        this.statusOptions=[{label:'All',value:''},...resdata.status];
        this.priorityOptions=[{label:'All',value:''},...resdata.priority];
      }
    })

    this.reportForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.loadReport();
    });

    this.loadUsers();
    this.loadReport();

  }

  loadUsers()
  {
    this.managerService.getAllUsersForDropDown().subscribe({
      next:(usersData) =>{
        this.users = usersData
      },
      error : this.errorUtils.handleError.bind(this.errorUtils)
    })
  }

  loadReport()
  {
    debugger
   // Step 1: Get the full form value
    const formValue = this.reportForm.value;

    // Step 2: Access each field one-by-one
      const userId = formValue.userId;
      const status = formValue.status;
      const priority = formValue.priority;
      const search = formValue.search;

    // Step 3: Create the params object with safe default values
      const params = {
      status: status ? status : '',         // If status is null/empty, use ''
      priority: priority ? priority : '',   // Same for priority
      userId: userId ? userId : null        // If no user is selected, use null
    };

    this.taskService.getReport(params).subscribe({
      next:(data)=>{
        this.totalTasks=data.length;
        this.taskRow =data;
        this.CreateReportSource = new MatTableDataSource(this.applySearch(data,search));
        this.CreateReportSource.paginator = this.paginator;
        this.CreateReportSource.sort = this.sort;
        
      },

      error:(error)=>{
        if(error.status === 404){
          //clear data if nothing is found
          this.totalTasks =0;
          this.taskRow=[];
          this.CreateReportSource = new MatTableDataSource<TaskReportDto>([]);
        }
      
         this.errorUtils.handleError.bind(this.errorUtils);
      }
      
    })   
  }

  applySearch(data: TaskReportDto[],search :string){
    debugger
    if(!search) return data;
    const lower = search.toLocaleLowerCase();
    return data.filter(task=>{
      return(
      task?.Title?.toLocaleLowerCase().includes(lower) ||
      task?.Status?.toLocaleLowerCase().includes(lower)||
      task?.Priority?.toLocaleLowerCase().includes(lower)||
      task?.UserName?.toLocaleLowerCase().includes(lower)
      );
    })
  }

  downloadCsv(){

    if(this.CreateReportSource.data.length === 0)
      {
        return;
      }

      const headers=['TaskId','Title','UserName','Status','Priority',
      'DueDate','OverDue' ];

      const rows= this.CreateReportSource.data.map(task=>({
        TaskId: task.TaskId,
        Title: task.Title,
        UserName: task.UserName,
        Status: task.Status,
        Priority: task.Priority,
        DueDate: task.DueDate,
        OverDue: task.OverDue ? 'Overdue' : 'On Time'
      }));

      let csvContent='';
      //Add header row
      csvContent += headers.join(',') +'\r\n';

      rows.forEach(row=>{
        const values = headers.map(header => `"${(row as any)[header]}"`);
        csvContent += values.join(',') + '\r\n';
      })

      
  // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'Task_Report.csv');
      link.click();

    }
  
  resetFilters() {
    this.reportForm.reset({ userId: '', status: '', priority: '', search: '' });
  }

}
