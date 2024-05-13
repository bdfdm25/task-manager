// task-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskDeleteDialogComponent } from '../task-delete-dialog/task-delete-dialog.component';
import { TaskDetailDialogComponent } from '../task-detail-dialog/task-detail-dialog.component';
import { TaskStatus } from '../enum/task-status.enum';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskCardComponent],
      providers: [{ provide: MatDialog, useValue: { open: jest.fn() } }],
    }).compileComponents();

    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    component.task = {
      id: '1',
      title: 'Test',
      status: TaskStatus.OPEN,
      description: 'Test description',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open TaskDetailDialogComponent on updateTask', () => {
    const openSpy = jest.spyOn(dialog, 'open');
    component.updateTask(component.task);
    expect(openSpy).toHaveBeenCalledWith(TaskDetailDialogComponent, {
      data: { task: component.task },
    });
  });

  it('should open TaskDeleteDialogComponent on deleteTask', () => {
    const openSpy = jest.spyOn(dialog, 'open');
    component.deleteTask(component.task);
    expect(openSpy).toHaveBeenCalledWith(TaskDeleteDialogComponent, {
      data: { task: component.task },
    });
  });
});
