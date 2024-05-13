import { Action, createReducer, on } from '@ngrx/store';

import { ITask } from '../interfaces/task.interface';
import { loadTasks, loadTasksFailure, tasksLoaded } from './tasks.actions';

export interface TaskState {
  tasks: ITask[];
  loading: boolean;
  error?: string;
}

export const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: undefined,
};

export const tasksReducer = createReducer(
  initialState,
  on(loadTasks, (state) => ({ ...state, loading: true })),
  on(tasksLoaded, (state, { tasks }) => {
    return { tasks, loading: false };
  }),
  on(loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export function reducer(state: TaskState | undefined, action: Action) {
  return tasksReducer(state, action);
}
