import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  showError(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  showInfo(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  showWarning(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-warning'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
