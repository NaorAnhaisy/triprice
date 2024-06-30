import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'triprice-confirm-dialog',
  template: `
    <h2>Are you sure?</h2>
    <p>This action cannot be undone.</p>
    <div class="buttons-dialog">
      <button mat-raised-button color="primary" (click)="confirm()">Yes</button>
      <button mat-raised-button color="warn" (click)="cancel()">No</button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}