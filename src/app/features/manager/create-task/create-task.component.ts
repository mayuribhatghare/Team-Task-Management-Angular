import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ErrorUtilsService } from '@app/core/utils/error-utils.service';
import { UserDropDownDto } from '@app/models/users.models';
import { NotificationService } from '@app/core/services/notification.service';
import { TaskitemsService } from '@app/core/services/taskitems.service';

@Component({
  selector: 'app-create-task',
  standalone :true,
  imports: [ CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatSelectModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
  createTaskForm : FormGroup

  constructor(private formbuilder : FormBuilder,private nottification : NotificationService,
    private taskService : TaskitemsService,private errorUtils : ErrorUtilsService) 
  {
    this.createTaskForm = this.formbuilder.group({
      Title:['',
            [Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
           Validators.pattern(/^[a-zA-Z][a-zA-Z0-9\s\-:,.\/_()]*$/)]],
          Description:['',Validators.maxLength(2000)]
    })
  }

  hasError(controlName: string, errorCode: string): boolean {
    const control = this.createTaskForm.get(controlName);
    return !!control && control.hasError(errorCode) && (control.dirty || control.touched);
  }

  onCreateTask()
  {
    debugger
     if(this.createTaskForm.invalid) return ;

     const trimmedForm = {
      Title : this.createTaskForm.value.Title.trim(),
      Description : this.createTaskForm.value.Description?.trim()
     }

     this.taskService.createTask(trimmedForm).subscribe({
      next:()=>{
        debugger
        this.nottification.showSuccess("Task created sucessfully")
        this.createTaskForm.reset()
      },
      error: this.errorUtils.handleError
     })

  }

}
