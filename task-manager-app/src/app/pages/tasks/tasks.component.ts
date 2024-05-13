import { Component, OnInit } from '@angular/core';
import { SessionService } from '@app/core/services/session.service';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITask } from './interfaces/task.interface';
import { loadTasks } from './store/tasks.actions';
import {
  selectError,
  selectLoading,
  selectTasks,
} from './store/tasks.selectors';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  tasks$: Observable<ITask[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | undefined>;

  loading: boolean = false;
  username: string = '';

  constructor(
    private sessionService: SessionService,
    private store: Store<{ tasks: ITask[] }>
  ) {
    this.tasks$ = this.store.pipe(select(selectTasks));
    this.loading$ = this.store.pipe(select(selectLoading));
    this.error$ = this.store.pipe(select(selectError));
  }

  ngOnInit() {
    this.username = this.sessionService.getUserData();
    this.store.dispatch(loadTasks());
  }
}
