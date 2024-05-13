// tasks.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionService } from '@app/core/services/session.service';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { loadTasks } from './store/tasks.actions';
import { TasksHeaderComponent } from './tasks-header/tasks-header.component';
import { TasksComponent } from './tasks.component';
import { TasksModule } from './tasks.module';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let store: Store;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TasksModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
      ],
      declarations: [TasksComponent, TasksHeaderComponent],
      providers: [
        {
          provide: Store,
          useValue: { dispatch: jest.fn(), select: jest.fn(), pipe: jest.fn() },
        },
        { provide: SessionService, useValue: { getUserData: jest.fn() } },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    sessionService = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.username = 'test';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTasks action on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadTasks());
  });

  it('should get username from session service on init', () => {
    const getUserDataSpy = jest.spyOn(sessionService, 'getUserData');
    component.ngOnInit();
    expect(getUserDataSpy).toHaveBeenCalled();
  });
});
