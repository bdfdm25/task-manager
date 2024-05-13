import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TaskDeleteDialogComponent } from './task-delete-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { deleteTask } from '../store/tasks.actions';

describe('TaskDeleteDialogComponent', () => {
  let component: TaskDeleteDialogComponent;
  let fixture: ComponentFixture<TaskDeleteDialogComponent>;
  let store: MockStore;
  let dialogRef: MatDialogRef<TaskDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDeleteDialogComponent],
      providers: [
        provideMockStore(),
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { task: { id: '1' } } },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dialogRef = TestBed.inject(MatDialogRef);
    fixture = TestBed.createComponent(TaskDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch deleteTask action on submit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onSubmit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      deleteTask({ taskId: component.data.task.id })
    );
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not dispatch deleteTask action on submit without task data', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.data.task = null;
    component.onSubmit();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should close dialog on onCloseDialog', () => {
    component.onCloseDialog();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
