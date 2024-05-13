import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITask } from '../interfaces/task.interface';
import { TaskDeleteDialogComponent } from '../task-delete-dialog/task-delete-dialog.component';
import { TaskDetailDialogComponent } from '../task-detail-dialog/task-detail-dialog.component';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  @Input()
  task!: ITask;

  constructor(public dialog: MatDialog) {}

  updateTask(task: ITask) {
    this.dialog.open(TaskDetailDialogComponent, {
      data: {
        task,
      },
    });
  }

  deleteTask(task: ITask) {
    this.dialog.open(TaskDeleteDialogComponent, {
      data: {
        task,
      },
    });
  }
}
