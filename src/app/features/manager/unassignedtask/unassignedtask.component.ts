import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // ✅ required
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UnAssignedTaskResponseDto } from '@app/models/tasksitems.models';
import { TaskitemsService } from '@app/core/services/taskitems.service';
import { ErrorUtilsService } from '@app/core/utils/error-utils.service';
import { TaskPriority, TaskStatus } from '@app/Taskenum/taskenum';
import { UserDropDownDto } from '@app/models/users.models';
import { ManagerService } from '@app/core/services/manager.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '@app/core/services/notification.service';
import { MatSort } from '@angular/material/sort';
import { futureValidator } from '@app/core/customvalidator';
import { toEnumString } from '@app/core/utils/enumutil';

@Component({
  selector: 'app-unassignedtask',
   standalone :true,
  imports: [ CommonModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatTableModule,           
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatPaginatorModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './unassignedtask.component.html',
  styleUrl: './unassignedtask.component.scss'
})
export class UnassignedtaskComponent implements OnInit,AfterViewInit {
  unassignedTasks = new MatTableDataSource<UnAssignedTaskResponseDto>();
  displayedColumns: string[] = ['Title', 'Description', 'Priority', 'Status', 'DueDate', 'Assignee', 'Actions'];
   // tasks : any[] = [];
    taskFormArray! : FormArray;
    taskFormGroup! : FormGroup;
    
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;

  users: UserDropDownDto[] = [];

  priorityOptions: { value: number; label: string }[] = [];
  statusOptions: { value: number; label: string }[] = [];

  constructor(
    private taskService: TaskitemsService,
    private errorUtils: ErrorUtilsService,
    private managerService: ManagerService,
    private notification : NotificationService,
    private fb :FormBuilder
  ) {}

  ngOnInit(): void {
    debugger
    this.priorityOptions = this.enumToArray(TaskPriority);
    this.statusOptions = this.enumToArray(TaskStatus);

    this.loadUsersDropDown();
    this.loadUnassignedTasks();
    
  }


  loadUnassignedTasks(): void {
    this.taskService.unassignedTask().subscribe({

      next: (tasks: UnAssignedTaskResponseDto[]) => {
         const updatedTasks = tasks.map(task => ({
        ...task,
        Priority: typeof task.Priority === 'number' ? task.Priority : TaskPriority.Medium,
        Status: typeof task.Status === 'number' ? task.Status : TaskStatus.Pending,
        DueDate: task.DueDate ?? this.getDefaultDate()  // default DueDate
        
      }));

         //this.tasks = updatedTasks;
        this.unassignedTasks = new MatTableDataSource(updatedTasks); // ✅ new instance
        this.unassignedTasks.paginator = this.paginator;              // ✅ set paginator
        this.unassignedTasks.sort = this.sort;       
     
        this.taskFormArray =this.fb.array(
          updatedTasks.map(task=>
            this.fb.group({
              TaskId: [task.TaskId],
              Priority:[task.Priority,[Validators.required,Validators.min(0)]],
              UserId:[task.AssigneeId,Validators.required],
              Status: new FormControl(
              { value: typeof task.Status === 'number' ? task.Status : TaskStatus.Pending, disabled: true },
              [Validators.required, Validators.min(0)]
              ),
              DueDate:[task.DueDate,[Validators.required,futureValidator()]]
            })
          )
        )

      },
      error: this.errorUtils.handleError
    });
  }

  loadUsersDropDown(): void {
    this.managerService.getAllUsersForDropDown().subscribe({
      next: (data: UserDropDownDto[]) => {
        this.users = data;
      },
      error: this.errorUtils.handleError.bind(this.errorUtils),
    });
  }

  enumToArray(enumObj: any): { value: number; label: string }[] {
    return Object.keys(enumObj)
      .filter(key => isNaN(Number(key))) // only enum keys
      .map(key => ({
        value: enumObj[key],
        label: key
      }));
  }

  assignTask(index :number):void {
    debugger
    // handle assign logic here (API call)
    const formGroup = this.taskFormArray.at(index) as FormGroup;
  
    if(formGroup.invalid)
    {
      formGroup.markAllAsTouched();
      return;
    }
    
    const rawFormValue = formGroup.getRawValue();

    const requestdto =  {
      TaskId :rawFormValue.TaskId,
      UserId : rawFormValue.UserId,
      Status: toEnumString(TaskStatus, rawFormValue.Status),
      Priority : toEnumString(TaskPriority,rawFormValue.Priority),
      DueDate : this.formatDate(rawFormValue.DueDate)
    };

    this.taskService.assignTaskToUser(requestdto).subscribe({
      next:() =>{
        debugger
        const data = this.unassignedTasks.data;
        data.splice(index, 1); // ✅ remove from same reference
        this.taskFormArray.removeAt(index);

         // Trigger internal table updates
        
        this.unassignedTasks = new MatTableDataSource(data); // ✅ new instance
        this.unassignedTasks.paginator = this.paginator;     // ✅ reassign paginator
        this.unassignedTasks.sort = this.sort;               // ✅ reassign sort

        this.notification.showSuccess("Task assign to user successfully");
      },
      error: this.errorUtils.handleError
    });
  }

  formatDate(date: Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // 'yyyy-MM-dd'
}

  getDefaultDate(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset time
  return today;
  }

  getFormControl(index: number, controlName: string): FormControl {
  return this.taskFormArray.at(index).get(controlName) as FormControl;
  }
  ngAfterViewInit(): void {
  this.unassignedTasks.paginator = this.paginator;
  this.unassignedTasks.sort = this.sort;
}

  gethasTask() :boolean{
    return this.taskFormArray?.length > 0 && this.unassignedTasks?.data?.length > 0
  }
}