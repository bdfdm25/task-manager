export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface PriorityOption {
  value: TaskPriority;
  label: string;
  color: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: TaskPriority.LOW, label: 'Low', color: 'text-success' },
  { value: TaskPriority.MEDIUM, label: 'Medium', color: 'text-warning' },
  { value: TaskPriority.HIGH, label: 'High', color: 'text-primary' },
  { value: TaskPriority.CRITICAL, label: 'Critical', color: 'text-danger' },
];
