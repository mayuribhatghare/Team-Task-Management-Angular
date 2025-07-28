import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardTitle } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { CommentAndTaskResponseDto, TaskResponseByTaskIdDto, UpdateTaskWithCommentRequestDto } from '@app/models/tasksitems.models';
import { TaskitemsService } from '@app/core/services/taskitems.service';
import { NotificationService } from '@app/core/services/notification.service';
import { TaskPriority, TaskStatus } from '@app/Taskenum/taskenum';
import { CommonModule } from '@angular/common';
import { ErrorUtilsService } from '@app/core/utils/error-utils.service';
import { enumToOptions, toEnumString, toEnumValue } from '@app/core/utils/enumutil';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { futureValidator } from '@app/core/customvalidator';
import { MatDialog } from '@angular/material/dialog';
import { SharedDialogComponent } from '@app/shared/shared-dialog/shared-dialog.component';
import { ManagerService } from '@app/core/services/manager.service';
import { UserDropDownDto } from '@app/models/users.models';

@Component({
  selector: 'app-update-tasks',
  standalone : true,
  imports: [
    MatCardModule,
    MatCardTitle,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-tasks.component.html',
  styleUrl: './update-tasks.component.scss'
})
export class UpdateTasksComponent {

  task: TaskResponseByTaskIdDto = {
    Title: '',
    Description: '',
    DueDate: '', // or new Date() if using Date object
    Status: TaskStatus.InProgress,
    Priority: TaskPriority.Medium,
    UserId: 0,
    CreatedDate: new Date()
  };

  dueDateForPicker: Date | null = null;
  isUser : boolean =false;
  isManager:boolean =false;
  isDarkMode: boolean = false;
  userId!:number;
  taskId :number = 0;
  commentList : CommentAndTaskResponseDto[] =[];
  userName: string ='';
  isComment: boolean = false;
  taskAssignToUserId :number =0;
  role:string='';
  allUsers: UserDropDownDto [] =[];

  priorityList= enumToOptions(TaskPriority);
  statusList = enumToOptions(TaskStatus);

  updateTaskForm! : FormGroup<any>

  updateRequestDto : UpdateTaskWithCommentRequestDto ={
    TaskId :0,
    UserId:0,
    Comment:'',
    CommentId :0,
    Status :'',
    Title:'',
    Description:'',
    Priority:'',
    DueDate: new Date()
  }

  constructor(private route : ActivatedRoute,
    private taskService : TaskitemsService,
    private notification : NotificationService,
    private errorUtils : ErrorUtilsService,
    private fbuilder : FormBuilder, private authService : AuthService,
    private managerService :ManagerService,
    private dialog:MatDialog){
    this.updateTaskForm = this.fbuilder.group({

      Priority:[''],
      Title:[''],
      Description:[''],
      DueDate:[''],
      Status:[''],
      Comment:[],
      CommentId:[]
      })
    }

  ngOnInit() : void{
    debugger

    this.taskId = Number(this.route.snapshot.paramMap.get('taskId'))!;
   
    this.taskAssignToUserId = Number (this.route.snapshot.paramMap.get('selectedUserId'));
    
    const userInfo = this.authService.getUserIdFromToken();
    this.userId = userInfo?.UserId ?? 0;


    if(userInfo == null || userInfo == undefined)
      return;

      this.role =userInfo.Role 

      if( this.role == "User")
      {
      this.isUser = true
      this.taskAssignToUserId = this.userId;

      }
      else if(this.role == "Manager")
      {
      this.isManager = true      
      }

    this.validateRolewise(this.role);

    if(this.taskId)
    {
    this.loadTask(this.taskId);
    }
   
  }

  validateRolewise(role :string)
  {
    debugger
    if(role == 'User')
    {
      this.updateTaskForm.get('Comment')?.setValidators([Validators.maxLength(4000)])
       this.updateTaskForm.get('Status')?.setValidators([Validators.required])
    }
    else if(role == "Manager"){
      this.updateTaskForm.get('Title')?.setValidators([Validators.required,Validators.maxLength(200)])
      this.updateTaskForm.get('Description')?.setValidators([Validators.maxLength(2000)])
      this.updateTaskForm.get('Priority')?.setValidators([Validators.required]),
      //this.updateTaskForm.get('DueDate')?.setValidators([futureValidator]),
      this.updateTaskForm.get('Comment')?.setValidators([Validators.maxLength(4000)])
    }

    this.updateTaskForm.updateValueAndValidity
  }
  
  goBack() :void {
    window.history.back();
  }

  loadTask(taskId : number){
    debugger
    this.taskService.getTaskByTaskId(taskId).subscribe({
      next :(apiTask) => {
        
        this.dueDateForPicker = apiTask.DueDate ? new Date(apiTask.DueDate) : null;       
        this.task = {
          ...apiTask,
          Status: toEnumValue(TaskStatus,apiTask.Status),
          Priority: toEnumValue(TaskPriority, apiTask.Priority)
        };

         this.updateTaskForm.patchValue({
          Title: this.task.Title,
          Description: this.task.Description,
          DueDate: this.dueDateForPicker,
          Priority: this.task.Priority,
          Status: this.task.Status,
         })

         if (!this.isManager) 
        {
          this.updateTaskForm.controls['Title'].disable();
          this.updateTaskForm.controls['Description'].disable();
          this.updateTaskForm.controls['DueDate'].disable();
          this.updateTaskForm.controls['Priority'].disable();
        } 
        else 
        {
          this.updateTaskForm.controls['Status'].disable();
        }

         this.loadComments(); 
      },
      error : this.errorUtils.handleError.bind(this.errorUtils)

    })
  }

  saveChanges() : void{
    debugger

    if(this.updateTaskForm.invalid) 
    {
      this.updateTaskForm.markAllAsTouched();
      this.notification.showError("Please fill out required fields properlys."); 
      return;
    }
    
    const formValues = this.updateTaskForm.getRawValue();
    const statusEnum = formValues.Status
    const statusString = toEnumString(TaskStatus, statusEnum); //  convert enum → string
   
    const priorityEnum = formValues.Priority;
    const priorityEnumString = toEnumString(TaskPriority, priorityEnum); 

    if(this.isUser)
    {
      if(formValues.Comment && statusEnum == TaskStatus.Pending)
      {
          this.notification.showWarning("Cannot keep status as 'Pending' when comment is provided.");
        return;
      }
    }

    if(this.task.Status == statusEnum && !this.updateRequestDto.Comment && this.isUser)
      this.notification.showWarning('No changes are detected,Task or comment remain unchanged');

  this.updateRequestDto = {
      Status : statusString,
      Comment: this.updateTaskForm.value.Comment,
      TaskId :this.taskId,
      UserId : this.taskAssignToUserId,
      Priority: priorityEnumString,
      Title : formValues.Title,
      Description : formValues.Description,
      DueDate: formValues.DueDate instanceof Date && !isNaN(formValues.DueDate.getTime())
          ? formValues.DueDate.toISOString().split('T')[0]
          : null,
      CommentId : 0

      
    }
    
   this.taskService.updateTaskStatus(this.updateRequestDto).subscribe({
      next:() =>{
        debugger
        this.notification.showSuccess("Task updated");
        this.updateRequestDto.Comment ='' ,
          // 🔁 Re-fetch the updated task so form reflects new values
        this.loadTask(this.taskId);
        //this.resetEditableFieldAfterSubmit();
        
          // 2️⃣ After slight delay, reset only editable fields
      setTimeout(() => {
        if (this.role === "Manager") {
          this.updateTaskForm.patchValue({
          Title: '',
          Description: '',
          Comment: ''
        });
        } else if (this.role === "User") {
        this.updateTaskForm.patchValue({
        Comment: ''
        });
      }
       // 3️⃣ Reset form states
    this.updateTaskForm.markAsPristine();
    this.updateTaskForm.markAsUntouched();
  }, 200); // Delay ensures loadTask() finishes patching before this
        
        this.loadComments();
         //this.loadUsers()

      },
      error: (err) => {
      debugger;
      this.errorUtils.handleError(err);
    }
    
   })
  };

  loadComments(){
    debugger
    this.taskService.getCommentForTask(this.taskId).subscribe({
      next : (commentData)=>{
       this.commentList = commentData
        const hasAtLeastOneComment = this.commentList.some(item => item.Comment && item.Comment.trim() !== '');
        if(hasAtLeastOneComment)
        {
          this.isComment =true;
        }
        else{
          this.isComment =false;
        }
      },
      error : this.errorUtils.handleError.bind(this.errorUtils)
    })
  }

  deleteComment(commentId : number ) :void
  {
    debugger
    if(!commentId) return;
    this.taskService.deleteComment(commentId).subscribe({
      next : ()=>{
        this.notification.showSuccess("Comment deleted sucessfully");
        this.loadComments();
      },
      error : this.errorUtils.handleError.bind(this.errorUtils)
     
    })    
  }

  hasError(controlName: string, errorCode: string): boolean {
    const control = this.updateTaskForm.get(controlName);
    return !!control && control.hasError(errorCode) && (control.dirty || control.touched);
  }

  resetEditableFieldAfterSubmit(){

    if(this.role == "User")
      this.updateTaskForm.patchValue({
        Status : this.task.Status,
        Comment:''
    })

      else if(this.role =="Manager"){

        this.updateTaskForm.patchValue({
          Title: '',
          Description :'',
          DueDate:null,
          Priority :this.task.Priority,
          Comment:''
        })
      
        this.updateTaskForm.markAsPristine();
        this.updateTaskForm.markAsUntouched();
    }
  }

  openConfirmDialog(commentId: number): void {
  const dialogRef = this.dialog.open(SharedDialogComponent, {
    width: '350px',
    data: {
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this comment?'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.deleteComment(commentId); // your delete logic
    }
  });
}

hasValidComments(): boolean {
  return this.commentList?.some(c => c?.Comment?.trim());
}

}
