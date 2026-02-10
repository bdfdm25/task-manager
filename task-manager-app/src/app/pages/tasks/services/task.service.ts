import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Routes } from '@app/shared/helpers/routes.helper';
import { Observable } from 'rxjs';
import { ITask } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  public getTaskList(): Observable<ITask[]> {
    return this.http.get<ITask[]>(Routes.TASKS);
  }

  public filterTasks(filter: string): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${Routes.TASKS}?search=${filter}`);
  }

  public createTask(task: ITask): Observable<ITask> {
    return this.http.post<ITask>(Routes.TASKS, task);
  }

  public updateTask(task: ITask): Observable<ITask> {
    return this.http.patch<ITask>(`${Routes.TASKS}/${task.id}`, task);
  }

  public deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${Routes.TASKS}/${taskId}`);
  }

  /**
   * Async validator: Checks if a task code already exists in the system.
   * Makes an HTTP request to the backend to validate uniqueness.
   *
   * @param taskCode - The task code to check
   * @returns Observable<boolean> - true if task code exists, false otherwise
   */
  public checkTaskCodeExists(taskCode: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${Routes.TASKS}/check-code/${taskCode.toUpperCase()}`,
    );
  }
}
