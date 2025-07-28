import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';

export interface ParsedHttpError {
  status: number;
  messages: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ErrorUtilsService {
  constructor(private snackBar: MatSnackBar) {}

  handleError = (error: HttpErrorResponse) => {
    const parsedError: ParsedHttpError = {
      status: error.status,
      messages: []
    };

    // --- 400 Bad Request (Validation errors or general bad request) ---
    if (error.status === 400) {
      debugger
      if (error.error?.errors && Array.isArray(error.error.errors)) {
        debugger
        parsedError.messages = error.error.errors.map(
          (fieldError: { field: string; message: string }) =>
            `${fieldError.field}: ${fieldError.message}`
        );
      } else if (typeof error.error === 'object') {
        debugger
        if (error.error?.Error) {
          parsedError.messages = [error.error.Error];
        } else if (error.error?.Message) {
          parsedError.messages = [error.error.Message];
        } else {
          parsedError.messages = ['Bad request'];
        }
      } 
    }

    // --- 403 Forbidden ---
    else if (error.status === 403) {
      parsedError.messages = ['Access denied. You are not authorized to perform this action.'];
    }

    // --- 404 Not Found ---
    else if (error.status === 404) {
      const msg = error.error?.Message || error.error?.Error || 'Not found.';
      parsedError.messages = [msg];
    }

    // --- 409 Conflict ---
    else if (error.status === 409) {
      debugger
      const msg = error.error?.Message || error.error?.Error || 'Conflict occurred.';
      parsedError.messages = [msg];
    }

    // --- 500+ Internal Server Error ---
    else if (error.status >= 500) {
      const msg = error.error?.Message || error.error?.Error || 'Internal server error.';
      parsedError.messages = [msg];
    }

    // --- Unknown or Network Error ---
    else {
      parsedError.messages = ['A network error occurred. Please try again later.'];
    }

    // --- Show messages in Snackbar ---
    parsedError.messages.forEach(msg => {
      this.snackBar.open(msg, 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error']
      });
    });

    return throwError(() => parsedError);
  };
}
