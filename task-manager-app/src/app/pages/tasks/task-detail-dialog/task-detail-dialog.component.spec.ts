import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TaskDetailDialogComponent } from './task-detail-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { addTask, updateTask } from '../store/tasks.actions';
import { ReactiveFormsModule } from '@angular/forms';

describe('TaskDetailDialogComponent', () => {
  let component: TaskDetailDialogComponent;
  let fixture: ComponentFixture<TaskDetailDialogComponent>;
  let store: MockStore;
  let dialogRef: MatDialogRef<TaskDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TaskDetailDialogComponent],
      providers: [
        provideMockStore(),
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dialogRef = TestBed.inject(MatDialogRef);
    fixture = TestBed.createComponent(TaskDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch addTask action on valid add task form submit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.taskForm.setValue({
      title: 'Test',
      status: 'New',
      description: 'Test description',
    });
    component.onAddTask();
    expect(dispatchSpy).toHaveBeenCalledWith(
      addTask({ task: component.taskForm.value })
    );
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not dispatch addTask action on invalid add task form submit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.taskForm.setValue({ title: '', status: '', description: '' });
    component.onAddTask();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch updateTask action on valid update task form submit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.data.task = {
      id: '1',
      title: 'Old title',
      status: 'Old status',
      description: 'Old description',
    };
    component.taskForm.setValue({
      title: 'New title',
      status: 'New status',
      description: 'New description',
    });
    component.onUpdateTask();
    expect(dispatchSpy).toHaveBeenCalledWith(
      updateTask({
        task: { ...component.data.task, ...component.taskForm.value },
      })
    );
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not dispatch updateTask action on invalid update task form submit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.data.task = {
      id: '1',
      title: 'Old title',
      status: 'Old status',
      description: 'Old description',
    };
    component.taskForm.setValue({ title: '', status: '', description: '' });
    component.onUpdateTask();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should close dialog on onCloseDialog', () => {
    component.onCloseDialog();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
