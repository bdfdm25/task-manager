import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { Pages } from '@app/shared/helpers/routes.helper';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { filterTasks, loadTasks } from '../store/tasks.actions';
import { TasksHeaderComponent } from './tasks-header.component';

describe('TasksHeaderComponent', () => {
  let component: TasksHeaderComponent;
  let fixture: ComponentFixture<TasksHeaderComponent>;
  let store: MockStore;
  let authService: AuthService;
  let router: Router;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksHeaderComponent],
      providers: [
        provideMockStore(),
        { provide: AuthService, useValue: { logout: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(TasksHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch filterTasks action on search', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = { target: { value: 'Test' } } as any;
    component.onSearchTask(event);
    expect(dispatchSpy).toHaveBeenCalledWith(filterTasks({ filter: 'Test' }));
  });

  it('should dispatch loadTasks action on empty search', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const event = { target: { value: '' } } as any;
    component.onSearchTask(event);
    expect(dispatchSpy).toHaveBeenCalledWith(loadTasks());
  });

  it('should call authService.logout and router.navigate on logout', () => {
    const logoutSpy = jest.spyOn(authService, 'logout');
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.onLogout();
    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith([Pages.LOGIN]);
  });

  it('should open dialog on addTask', () => {
    const openSpy = jest.spyOn(dialog, 'open');
    component.addTask();
    expect(openSpy).toHaveBeenCalled();
  });
});
