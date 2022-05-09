import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-text-dialog',
  templateUrl: './create-text-dialog.component.html',
  styleUrls: ['./create-text-dialog.component.css'],
})
export class CreateTextDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateTextDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public textName: string
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onYesClick(): void {
    if (this.textName != '') {
      this.dialogRef.close(this.textName);
    }
  }
}
