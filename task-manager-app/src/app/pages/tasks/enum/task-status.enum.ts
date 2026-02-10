export enum TaskStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in progress',
  DONE = 'done',
}

export interface StatusOption {
  value: TaskStatus;
  label: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { value: TaskStatus.OPEN, label: 'Open' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
];
