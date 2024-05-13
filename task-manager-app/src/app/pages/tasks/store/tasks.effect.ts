// tasks.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { TaskService } from '../services/task.service';
import * as TasksActions from './tasks.actions';

@Injectable()
export class TasksEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      mergeMap(() =>
        this.taskService.getTaskList().pipe(
          map((tasks) => TasksActions.tasksLoaded({ tasks })),
          catchError((e) =>
            of(TasksActions.loadTasksFailure({ error: e.error.message }))
          )
        )
      )
    )
  );

  filterTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.filterTasks),
      mergeMap((action) =>
        this.taskService.filterTasks(action.filter).pipe(
          map((tasks) => TasksActions.tasksLoaded({ tasks })),
          catchError((e) =>
            of(TasksActions.loadTasksFailure({ error: e.error.message }))
          )
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.addTask),
      mergeMap((action) =>
        this.taskService.createTask(action.task).pipe(
          map(() => TasksActions.loadTasks()),
          catchError((e) =>
            of(TasksActions.loadTasksFailure({ error: e.error.message }))
          )
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTask),
      mergeMap((action) =>
        this.taskService.updateTask(action.task).pipe(
          map(() => TasksActions.loadTasks()),
          catchError((e) =>
            of(TasksActions.loadTasksFailure({ error: e.error.message }))
          )
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      mergeMap((action) =>
        this.taskService.deleteTask(action.taskId).pipe(
          map(() => TasksActions.loadTasks()),
          catchError((e) =>
            of(TasksActions.loadTasksFailure({ error: e.error.message }))
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private taskService: TaskService) {}
}
