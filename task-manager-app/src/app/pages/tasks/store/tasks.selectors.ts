// tasks.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskStatus } from '../enum/task-status.enum';
import { TaskState } from './tasks.reducer';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectTasks = createSelector(
  selectTaskState,
  (state: TaskState) => {
    return state.tasks;
  },
);

export const selectLoading = createSelector(
  selectTaskState,
  (state: TaskState) => state.loading,
);

export const selectError = createSelector(
  selectTaskState,
  (state: TaskState) => state.error,
);

export const selectOpenTasks = createSelector(selectTasks, (tasks) =>
  tasks.filter((task) => task.status === TaskStatus.OPEN),
);

export const selectInProgressTasks = createSelector(selectTasks, (tasks) =>
  tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS),
);

export const selectDoneTasks = createSelector(selectTasks, (tasks) =>
  tasks.filter((task) => task.status === TaskStatus.DONE),
);
