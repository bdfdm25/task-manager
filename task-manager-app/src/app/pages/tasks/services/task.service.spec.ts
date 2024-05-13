import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Routes } from '@app/shared/helpers/routes.helper';
import { ITask } from '../interfaces/task.interface';
import { TaskStatus } from '../enum/task-status.enum';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests
  });

  it('should retrieve tasks from the API via GET', () => {
    const dummyTasks: ITask[] = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Task 1 description',
        status: TaskStatus.DONE,
      },
      {
        id: '2',
        title: 'Task 2',
        description: 'Task 2 description',
        status: TaskStatus.DONE,
      },
    ];

    service.getTaskList().subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(dummyTasks);
    });

    const request = httpMock.expectOne(Routes.TASKS);
    expect(request.request.method).toBe('GET');
    request.flush(dummyTasks);
  });

  it('should filter tasks from the API via GET', () => {
    const dummyTasks: ITask[] = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Task 1 description',
        status: TaskStatus.DONE,
      },
    ];

    service.filterTasks('Task 1').subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks).toEqual(dummyTasks);
    });

    const request = httpMock.expectOne(`${Routes.TASKS}?search=Task 1`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyTasks);
  });

  it('should create a task via POST', () => {
    const newTask: ITask = {
      id: '3',
      title: 'Task 3',
      description: 'Task 3 description',
      status: TaskStatus.DONE,
    };

    service.createTask(newTask).subscribe((task) => {
      expect(task).toEqual(newTask);
    });

    const request = httpMock.expectOne(Routes.TASKS);
    expect(request.request.method).toBe('POST');
    request.flush(newTask);
  });

  it('should update a task via PATCH', () => {
    const updatedTask: ITask = {
      id: '1',
      title: 'Updated Task 1',
      description: 'Updated Task 1 description',
      status: TaskStatus.DONE,
    };

    service.updateTask(updatedTask).subscribe((task) => {
      expect(task).toEqual(updatedTask);
    });

    const request = httpMock.expectOne(`${Routes.TASKS}/${updatedTask.id}`);
    expect(request.request.method).toBe('PATCH');
    request.flush(updatedTask);
  });

  it('should delete a task via DELETE', () => {
    const taskId = '1';

    service.deleteTask(taskId).subscribe();

    const request = httpMock.expectOne(`${Routes.TASKS}/${taskId}`);
    expect(request.request.method).toBe('DELETE');
  });
});
