import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule  } from '@angular/material/dialog';
@Component({
  selector: 'app-shared-dialog',
  standalone :true,
  imports: [MatDialogModule ],
  templateUrl: './shared-dialog.component.html',
  styleUrl: './shared-dialog.component.scss'
})
export class SharedDialogComponent {
title: string = '';
  message: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.message = data.message;
  }

}
