import { environment } from '@environment/environment';

const BASE_URL = environment.apiUrl;

export class Routes {
  // Auth
  static SIGNUP = `${BASE_URL}/auth/signup`;
  static SIGNIN = `${BASE_URL}/auth/signin`;

  // Tasks
  static TASKS = `${BASE_URL}/tasks`;
  static TASK_BY_ID = (id: number | string) => `${BASE_URL}/tasks/${id}`;
}

export class Pages {
  static LOGIN = '/login';
  static TASKS = '/tasks';
}
