import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorObserver } from 'rxjs';
import { ErrorUtilsService } from '@app/core/utils/error-utils.service';
import { NotificationService } from '@app/core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
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
    MatSlideToggleModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isDarkMode = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification : NotificationService,
    private errorUtils : ErrorUtilsService,
    private router :Router
  ) 
  {
    this.registerForm = this.fb.group({
      UserName: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/),
        Validators.pattern(/^\S*$/)
      ]],
      Email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
        Validators.pattern(/^\S*$/)
      ]],
      Password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/),
        Validators.pattern(/^\S*$/)
      ]],
      PhoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/),
        Validators.pattern(/^\S*$/)
      ]]
    });
  }

  //  Helper to reduce repetitive code
  hasError(controlName: string, errorCode: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.hasError(errorCode) && (control.dirty || control.touched);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  onSubmit() {
  this.registerForm.markAllAsTouched();

  if (this.registerForm.invalid) {
    this.notification.showError("Please fill out all required fields correctly.")
    return;
  }

  this.authService.register(this.registerForm.value).subscribe({
    next: () => {
      debugger
      this.notification.showSuccess('User Registered Successfully!')
      this.registerForm.reset();
    },
    error: this.errorUtils.handleError      
  });
}

  resetForm(): void {
  this.registerForm.reset();

  // Optionally mark all controls as pristine and untouched
  Object.keys(this.registerForm.controls).forEach(key => {
    const control = this.registerForm.get(key);
    control?.markAsPristine();
    control?.markAsUntouched();
  });
}

navigateToLogin() {
  this.router.navigate(['/login']); // adjust if your route is different
}
}
