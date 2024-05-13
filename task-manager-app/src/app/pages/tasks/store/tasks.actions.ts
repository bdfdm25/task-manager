import { createAction, props } from '@ngrx/store';
import { ITask } from '../interfaces/task.interface';

export const loadTasks = createAction('[Task] Load Tasks');

export const tasksLoaded = createAction(
  '[Task] Tasks Loaded',
  props<{ tasks: ITask[] }>()
);

export const filterTasks = createAction(
  '[Task] Filter Tasks',
  props<{ filter: string }>()
);

export const addTask = createAction(
  '[Task] Add Task',
  props<{ task: ITask }>()
);

export const updateTask = createAction(
  '[Task] Update Task',
  props<{ task: ITask }>()
);

export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ taskId: string }>()
);

export const loadTasksFailure = createAction(
  '[Tasks] Load Tasks Failure',
  props<{ error: string }>()
);
