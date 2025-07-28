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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagerService } from '@app/core/services/manager.service';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
  selector: 'app-change-role',
  standalone: true,
   imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './change-role.component.html',
  styleUrl: './change-role.component.scss'
})
export class ChangeRoleComponent implements OnInit{
  changeRoleForm : FormGroup
  users: UserDropDownDto[] =[];
  hidePassword = true;
  isDarkMode = false;

   
  constructor(private fb : FormBuilder, private  errorUtils:ErrorUtilsService,
    private managerService : ManagerService ,private notification : NotificationService
  )
  {
    this.changeRoleForm = fb.group({
      UserId:['',Validators.required],
      NewRole : ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.managerService.getAllUsersForDropDown().subscribe({
      next:(data: UserDropDownDto[]) =>
        (this.users = data),
       error: this.errorUtils.handleError.bind(this.errorUtils),
    });   
  }
 

   hasError(controlName: string, errorCode: string): boolean {
    const control = this.changeRoleForm.get(controlName);
    return !!control && control.hasError(errorCode) && (control.dirty || control.touched);
  }

  onSubmit()
  {
    this.changeRoleForm.markAllAsTouched();

    if(this.changeRoleForm.invalid) return;

    this.managerService.changeUserRole(this.changeRoleForm.value)
    .subscribe({
      next:() =>{
        this.notification.showSuccess("Role changed Successfully");
        this.changeRoleForm.reset();
      },
      error: this.errorUtils.handleError.bind(this.errorUtils),
      
    })   
  }

   toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }
}
