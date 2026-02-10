import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormHelper } from '@app/shared/helpers/form.helper';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { TASK_CATEGORIES, TaskCategory } from '../enum/task-category.enum';
import { PRIORITY_OPTIONS, TaskPriority } from '../enum/task-priority.enum';
import { STATUS_OPTIONS, TaskStatus } from '../enum/task-status.enum';
import { TaskFormModel } from '../models/task-form.model';
import { TaskService } from '../services/task.service';
import { addTask, updateTask } from '../store/tasks.actions';

@Component({
  selector: 'app-task-detail-dialog',
  templateUrl: './task-detail-dialog.component.html',
})
export class TaskDetailDialogComponent extends FormHelper implements OnInit {
  // Options from enums
  priorityOptions = PRIORITY_OPTIONS;
  categoryOptions = TASK_CATEGORIES;
  statusOptions = STATUS_OPTIONS;

  // Expose enums to template
  readonly TaskPriority = TaskPriority;

  // Loading state for async validation
  isCheckingTaskCode = false;

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<TaskDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
  ) {
    // Initialize FormHelper with TaskFormModel
    super(new TaskFormModel());
  }

  ngOnInit(): void {
    // If editing an existing task, populate the form
    if (this.data.task) {
      this.populateForm();
    }

    // Add async validator for taskCode
    const taskCodeControl = this.form.get('taskCode');
    if (taskCodeControl) {
      taskCodeControl.setAsyncValidators([this.taskCodeExistsValidator()]);

      // Monitor async validation status
      taskCodeControl.statusChanges.subscribe((status) => {
        this.isCheckingTaskCode = status === 'PENDING';
      });
    }

    // Dynamic field enabling/disabling based on priority
    this.setupDynamicFieldBehavior();
  }

  /**
   * Populates form with existing task data when editing
   */
  private populateForm(): void {
    const task = this.data.task;
    this.form.patchValue({
      taskCode: task.taskCode || '',
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'open',
      priority: task.priority || 'medium',
      category: task.category || '',
      assignedTo: task.assignedTo || '',
      estimatedHours: task.estimatedHours || 0,
      deadline: task.deadline || null,
      tags: task.tags || '',
      notifyOnCompletion: task.notifyOnCompletion || false,
    });

    // Disable taskCode when editing (shouldn't be changed)
    this.form.get('taskCode')?.disable();
  }

  /**
   * Sets up dynamic field behavior based on form values
   * Example: If priority is 'critical', estimated hours becomes required
   */
  private setupDynamicFieldBehavior(): void {
    this.form.get('priority')?.valueChanges.subscribe((priority) => {
      const estimatedHoursControl = this.form.get('estimatedHours');
      const deadlineControl = this.form.get('deadline');

      if (
        priority === TaskPriority.CRITICAL ||
        priority === TaskPriority.HIGH
      ) {
        // Make deadline required for high/critical priority
        deadlineControl?.setValidators([this.getDeadlineValidator()]);
        estimatedHoursControl?.setValidators([
          this.getEstimatedHoursValidator(),
        ]);
      } else {
        deadlineControl?.clearValidators();
        estimatedHoursControl?.clearValidators();
      }

      deadlineControl?.updateValueAndValidity();
      estimatedHoursControl?.updateValueAndValidity();
    });
  }

  /**
   * Gets the deadline validator from the model
   */
  private getDeadlineValidator() {
    const model = new TaskFormModel();
    return model.getValidationRules()['deadline'][0];
  }

  /**
   * Gets the estimated hours validator from the model
   */
  private getEstimatedHoursValidator() {
    const model = new TaskFormModel();
    return model.getValidationRules()['estimatedHours'][0];
  }

  /**
   * Submits the form
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.markAllControlsAsTouchedAndDirty(this.form);
      this.errorMsg = 'Please fix the errors in the form';
      return;
    }

    this.isSubmitting = true;

    if (this.data.task) {
      this.onUpdateTask();
    } else {
      this.onAddTask();
    }
  }

  /**
   * Adds a new task
   */
  onAddTask(): void {
    const formValue = this.form.getRawValue();
    this.store.dispatch(addTask({ task: formValue }));
    this.dialogRef.close();
  }

  /**
   * Updates an existing task
   */
  onUpdateTask(): void {
    const formValue = this.form.getRawValue();
    this.store.dispatch(
      updateTask({
        task: { ...this.data.task, ...formValue },
      }),
    );
    this.dialogRef.close();
  }

  /**
   * Closes the dialog
   */
  onCloseDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Resets the form to initial state
   */
  onResetForm(): void {
    this.resetAll(this.form, this.data.task ? ['taskCode'] : []);
    this.errorMsg = '';
  }

  /**
   * Async validator: Checks if task code already exists in the system
   * Uses the injected TaskService to simulate backend validation with debouncing
   */
  private taskCodeExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;
      if (!value) {
        return of(null);
      }

      return of(value).pipe(
        debounceTime(500), // Wait for user to stop typing
        switchMap((taskCode) =>
          this.taskService.checkTaskCodeExists(taskCode).pipe(
            map((exists) => (exists ? { taskExists: true } : null)),
            catchError(() => of(null)),
          ),
        ),
      );
    };
  }
}
