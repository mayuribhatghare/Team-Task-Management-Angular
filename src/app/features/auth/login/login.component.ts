import { Component } from '@angular/core';
import { FormBuilder,Validators,FormGroup } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ErrorUtilsService } from '@app/core/utils/error-utils.service';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone : true,
   imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm : FormGroup;
  hidePassword = true;
  isDarkMode = false;

  constructor(
    private fb:FormBuilder ,private authService :AuthService ,
    private errorUtils :ErrorUtilsService, private router :Router,
    private notification : NotificationService)
  {
    this.loginForm =this.fb.group({
    Email :['', [Validators.required ,Validators.email]],
    Password :['',[Validators.required]]
    });
  }

   hasError(controlName: string, errorCode: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.hasError(errorCode) && (control.dirty || control.touched);
  }

 onLogin() {
  debugger;
  if (this.loginForm.invalid) return;

  this.authService.login(this.loginForm.value).subscribe({
    next: (res) => {
      debugger;

      this.loginForm.reset();
      
      const isToken = this.authService.saveToken(res.Token);
      if (isToken) {
        const decoded = this.authService.getUserIdFromToken();

        if (!decoded || decoded === undefined) {
          this.notification.showError("Invalid token received")
          return;
        }

        if (decoded.Role === 'Manager')
        {
          debugger
          this.router.navigateByUrl('/manager/unassignedtask');
        } 
        else if (decoded.Role === 'User') 
        {
          debugger
          this.router.navigate(['/users/my-tasks']);
        }
      } 
      
      else {
        this.notification.showError("Failed to get token");
      }
    },
 error: (err) => {
      this.loginForm.reset(); // Reset on login failure
      this.errorUtils.handleError(err); // ✅ centralized error handling
    },
  });
}
navigateToRegister()
{
  this.router.navigate(['auth/register']);
}
}