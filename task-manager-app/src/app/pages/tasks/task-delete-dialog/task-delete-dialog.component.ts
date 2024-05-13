import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { deleteTask } from '../store/tasks.actions';

@Component({
  selector: 'app-task-delete-dialog',
  templateUrl: './task-delete-dialog.component.html',
})
export class TaskDeleteDialogComponent {
  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<TaskDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit(): void {
    if (this.data.task) {
      this.store.dispatch(deleteTask({ taskId: this.data.task.id }));
      this.dialogRef.close();
    }
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }
}
