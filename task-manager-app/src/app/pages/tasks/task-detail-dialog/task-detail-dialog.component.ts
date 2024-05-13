import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { addTask, updateTask } from '../store/tasks.actions';

@Component({
  selector: 'app-task-detail-dialog',
  templateUrl: './task-detail-dialog.component.html',
})
export class TaskDetailDialogComponent {
  taskForm!: FormGroup;

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<TaskDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  onSubmit(): void {
    if (this.data.task) {
      this.onUpdateTask();
    } else {
      this.onAddTask();
    }
  }

  onAddTask(): void {
    if (this.taskForm.valid) {
      this.store.dispatch(addTask({ task: this.taskForm.value }));
      this.dialogRef.close();
    }
  }

  onUpdateTask(): void {
    if (this.taskForm.valid) {
      this.store.dispatch(
        updateTask({
          task: { ...this.data.task, ...this.taskForm.value },
        })
      );
      this.dialogRef.close();
    }
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  private createForm() {
    this.taskForm = new FormGroup({
      title: new FormControl(this.data.task ? this.data.task.title : '', [
        Validators.required,
      ]),
      status: new FormControl(this.data.task ? this.data.task.status : '', [
        Validators.required,
      ]),
      description: new FormControl(
        this.data.task ? this.data.task.description : ''
      ),
    });
  }
}
