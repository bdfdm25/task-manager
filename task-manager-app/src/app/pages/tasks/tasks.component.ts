import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/core/services/session.service';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITask } from './interfaces/task.interface';
import { loadTasks } from './store/tasks.actions';
import {
  selectDoneTasks,
  selectError,
  selectInProgressTasks,
  selectLoading,
  selectOpenTasks,
} from './store/tasks.selectors';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  openTasks$: Observable<ITask[]>;
  inProgressTasks$: Observable<ITask[]>;
  doneTasks$: Observable<ITask[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | undefined>;

  username: string = '';

  constructor(
    private sessionService: SessionService,
    private store: Store<{ tasks: ITask[] }>,
  ) {
    this.openTasks$ = this.store.pipe(select(selectOpenTasks));
    this.inProgressTasks$ = this.store.pipe(select(selectInProgressTasks));
    this.doneTasks$ = this.store.pipe(select(selectDoneTasks));
    this.loading$ = this.store.pipe(select(selectLoading));
    this.error$ = this.store.pipe(select(selectError));
  }

  ngOnInit() {
    this.username = this.sessionService.getUserData();
    this.store.dispatch(loadTasks());
  }
}
