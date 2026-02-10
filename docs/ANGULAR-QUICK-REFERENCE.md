# Angular Quick Reference Guide

## Last-Minute Interview Prep Cheat Sheet

> **Purpose**: Quick review before senior-level Angular interview  
> **Format**: Rapid-fire concepts, code snippets, gotchas  
> **Time**: 15-30 minutes to review everything

---

## Table of Contents

1. [RxJS Operators Quick Reference](#rxjs-operators-quick-reference)
2. [NgRx Pattern Checklist](#ngrx-pattern-checklist)
3. [Forms: Common Patterns](#forms-common-patterns)
4. [Performance: Quick Wins](#performance-quick-wins)
5. [Security: Must-Know](#security-must-know)
6. [Architecture: Key Decisions](#architecture-key-decisions)
7. [Common Interview Questions](#common-interview-questions)
8. [Code Snippets Library](#code-snippets-library)
9. [Gotchas & Edge Cases](#gotchas--edge-cases)

---

## RxJS Operators Quick Reference

### Essential Operators

| Operator                 | Use Case                            | Example                        |
| ------------------------ | ----------------------------------- | ------------------------------ |
| **map**                  | Transform values                    | `map(x => x * 2)`              |
| **filter**               | Skip values                         | `filter(x => x > 5)`           |
| **tap**                  | Side effects (logging)              | `tap(x => console.log(x))`     |
| **switchMap**            | Cancel previous, latest only        | Search, HTTP cancellation      |
| **mergeMap**             | All requests in parallel            | Multiple independent API calls |
| **concatMap**            | Sequential, ordered                 | Queue operations               |
| **catchError**           | Error handling                      | `catchError(() => of(null))`   |
| **debounceTime**         | Wait after input stops              | `debounceTime(500)`            |
| **distinctUntilChanged** | Skip duplicate values               | `distinctUntilChanged()`       |
| **take**                 | Take N emissions                    | `take(1)`                      |
| **takeUntil**            | Complete on signal                  | Unsubscribe pattern            |
| **combineLatest**        | Wait for all, emit when any changes | Form validation                |
| **forkJoin**             | Wait for all to complete            | Parallel HTTP calls            |

### Switching Operators Comparison

```typescript
// switchMap - Latest wins (use for search)
searchTerm$.pipe(
  switchMap((term) => api.search(term)),
  // Types "ab" → request 1 starts
  // Types "abc" → request 1 CANCELLED, request 2 starts
);

// mergeMap - All concurrent (use for independent actions)
taskIds$.pipe(
  mergeMap((id) => api.getTask(id)),
  // Request 1, 2, 3 all run simultaneously
  // All complete (out of order possible)
);

// concatMap - Sequential queue (use for order-dependent)
actions$.pipe(
  concatMap((action) => api.performAction(action)),
  // Request 1 completes → request 2 starts → request 3 starts
  // Guaranteed order
);

// exhaustMap - Ignore while busy (use for button clicks)
saveButton$.pipe(
  exhaustMap(() => api.save()),
  // Click 1 → save starts
  // Click 2, 3, 4 → IGNORED (save still in progress)
  // Save completes → next click allowed
);
```

### Subject Types

```typescript
// Subject - No initial value, no replay
const subject = new Subject<number>();
subject.subscribe(console.log); // Subscribes NOW
subject.next(1); // Prints: 1
subject.next(2); // Prints: 2

// BehaviorSubject - Has initial value, replays last value
const behavior = new BehaviorSubject<number>(0);
behavior.subscribe(console.log); // Prints: 0 (initial)
behavior.next(1); // Prints: 1
behavior.subscribe(console.log); // Prints: 1 (replays last)

// ReplaySubject - Replays N last values
const replay = new ReplaySubject<number>(2); // Buffer 2
replay.next(1);
replay.next(2);
replay.next(3);
replay.subscribe(console.log); // Prints: 2, 3 (last 2)
```

---

## NgRx Pattern Checklist

### File Structure

```
store/
├── tasks.actions.ts       # Action creators
├── tasks.reducer.ts       # State mutations
├── tasks.effects.ts       # Side effects (API calls)
├── tasks.selectors.ts     # State queries
└── index.ts               # Public API
```

### Actions Pattern

```typescript
import { createAction, props } from "@ngrx/store";

// Load tasks
export const loadTasks = createAction("[Tasks Page] Load Tasks");

export const loadTasksSuccess = createAction("[Tasks API] Load Tasks Success", props<{ tasks: ITask[] }>());

export const loadTasksFailure = createAction("[Tasks API] Load Tasks Failure", props<{ error: string }>());

// Naming: [Source] Event
// [Tasks Page] - User action
// [Tasks API] - API response
```

### Reducer Pattern

```typescript
import { createReducer, on } from "@ngrx/store";

export interface TasksState {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const tasksReducer = createReducer(
  initialState,

  // ALWAYS return new state object (immutability)
  on(TasksActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TasksActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks, // Replace array
    loading: false,
  })),

  on(TasksActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)), // Immutable update
  })),
);
```

### Effects Pattern

```typescript
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

@Injectable()
export class TasksEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks), // Listen for action
      switchMap(() =>
        this.tasksService.getTasks().pipe(
          map((tasks) => TasksActions.loadTasksSuccess({ tasks })),
          catchError((error) => of(TasksActions.loadTasksFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private tasksService: TasksService,
  ) {}
}
```

### Selectors Pattern

```typescript
import { createFeatureSelector, createSelector } from "@ngrx/store";

// Feature selector
export const selectTasksState = createFeatureSelector<TasksState>("tasks");

// Basic selectors
export const selectAllTasks = createSelector(selectTasksState, (state) => state.tasks);

export const selectTasksLoading = createSelector(selectTasksState, (state) => state.loading);

// Composed selectors (memoized, efficient)
export const selectTasksByStatus = (status: TaskStatus) =>
  createSelector(selectAllTasks, (tasks) => tasks.filter((task) => task.status === status));

export const selectTaskById = (id: string) =>
  createSelector(selectAllTasks, (tasks) => tasks.find((task) => task.id === id));
```

### Component Usage

```typescript
export class TasksComponent implements OnInit {
  // Select state
  tasks$ = this.store.select(selectAllTasks);
  loading$ = this.store.select(selectTasksLoading);
  openTasks$ = this.store.select(selectTasksByStatus(TaskStatus.OPEN));

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Dispatch action
    this.store.dispatch(TasksActions.loadTasks());
  }

  onCreateTask(task: ITask): void {
    this.store.dispatch(TasksActions.createTask({ task }));
  }
}
```

---

## Forms: Common Patterns

### FormGroup Creation

```typescript
// Basic
this.form = this.fb.group({
  email: ["", [Validators.required, Validators.email]],
  password: ["", [Validators.required, Validators.minLength(8)]],
});

// With initial values
this.form = this.fb.group({
  title: [task.title, Validators.required],
  status: [task.status || TaskStatus.OPEN],
});

// Nested groups
this.form = this.fb.group({
  personalInfo: this.fb.group({
    name: ["", Validators.required],
    email: ["", Validators.email],
  }),
  address: this.fb.group({
    street: [""],
    city: [""],
  }),
});

// Form arrays (dynamic fields)
this.form = this.fb.group({
  tags: this.fb.array([this.fb.control(""), this.fb.control("")]),
});
```

### Custom Validators

```typescript
// Sync validator
export function taskCodeFormat(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valid = /^[A-Z]+-\d+$/.test(control.value);
    return valid ? null : { invalidTaskCode: true };
  };
}

// Usage
taskCode: ["", [Validators.required, taskCodeFormat()]];

// Async validator
export function taskCodeExists(service: TaskService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return timer(500).pipe(
      switchMap(() => service.checkTaskCodeExists(control.value)),
      map((exists) => (exists ? { taskCodeExists: true } : null)),
      catchError(() => of(null)),
    );
  };
}

// Usage
taskCode: ["", [taskCodeFormat()], [taskCodeExists(this.taskService)]];
```

### Form State Checks

```typescript
const control = this.form.get("email");

// Validation
control.valid; // All validators pass
control.invalid; // Any validator fails
control.errors; // { required: true, email: true }
control.hasError("required"); // Check specific error

// User interaction
control.pristine; // Not modified
control.dirty; // Modified
control.touched; // Blurred
control.untouched; // Not blurred

// Updates
control.value; // Get value
control.setValue("new@email.com"); // Set value (must match structure)
control.patchValue({ email: "new" }); // Partial update (nested forms)
control.updateValueAndValidity(); // Re-run validators

// Enable/Disable
control.disable();
control.enable();
```

### Template Binding

```html
<form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
  <!-- Basic input -->
  <input formControlName="title" />

  <!-- Show errors -->
  <div *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
    <span *ngIf="taskForm.get('title')?.hasError('required')"> Title is required </span>
    <span *ngIf="taskForm.get('title')?.hasError('minlength')"> Minimum 3 characters </span>
  </div>

  <!-- Nested form group -->
  <div formGroupName="personalInfo">
    <input formControlName="name" />
    <input formControlName="email" />
  </div>

  <!-- Form array -->
  <div formArrayName="tags">
    <div *ngFor="let tag of tags.controls; let i=index">
      <input [formControlName]="i" />
    </div>
  </div>

  <!-- Submit button -->
  <button type="submit" [disabled]="taskForm.invalid">Save</button>
</form>
```

---

## Performance: Quick Wins

### OnPush Change Detection

```typescript
@Component({
  selector: "app-task-card",
  changeDetection: ChangeDetectionStrategy.OnPush, // ← Add this
  template: `<div>{{ task.title }}</div>`,
})
export class TaskCardComponent {
  @Input() task!: ITask; // Only checks if reference changes
}
```

**When to use**: Presentational components, list items, anything with @Input

### TrackBy Function

```typescript
// Component
trackByTaskId(_index: number, task: ITask): string {
  return task.id; // Use unique identifier
}

// Template
<div *ngFor="let task of tasks; trackBy: trackByTaskId">
  <app-task-card [task]="task"></app-task-card>
</div>
```

**When to use**: Every `*ngFor` in production code

### Async Pipe (Auto-Unsubscribe)

```typescript
// Component
tasks$: Observable<ITask[]> = this.store.select(selectAllTasks);

// Template
<div *ngFor="let task of tasks$ | async">
  {{ task.title }}
</div>
```

**Benefits**: No manual subscription, auto-cleanup, OnPush friendly

### Pure Pipes

```typescript
@Pipe({
  name: "filterTasks",
  pure: true, // ← Caches result
})
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: ITask[], status: TaskStatus): ITask[] {
    console.log("Pipe executed"); // Only logs when tasks reference changes
    return tasks.filter((task) => task.status === status);
  }
}
```

### Lazy Loading

```typescript
const routes: Routes = [
  {
    path: "tasks",
    loadChildren: () => import("./pages/tasks/tasks.module").then((m) => m.TasksModule),
  },
];

// Preload strategy
RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules,
});
```

---

## Security: Must-Know

### XSS Prevention

```typescript
// ✅ SAFE: Angular escapes automatically
<div>{{ userInput }}</div>

// ⚠️ CAREFUL: Angular sanitizes
<div [innerHTML]="userInput"></div>

// ❌ DANGER: Bypasses security
constructor(private sanitizer: DomSanitizer) {}
trustHtml(html: string): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(html);
  // Only use if YOU control the content!
}
```

### JWT Authentication Flow

```typescript
// 1. Sign in
signin(credentials: ISignin): Observable<IAuthResponse> {
  return this.http.post<IAuthResponse>('/auth/signin', credentials).pipe(
    tap(response => {
      localStorage.setItem('access_token', response.token);
    })
  );
}

// 2. Interceptor adds token to requests
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = localStorage.getItem('access_token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next.handle(req);
}

// 3. Route guard protects pages
canActivate(): boolean {
  if (this.authService.isAuthenticated()) {
    return true;
  }
  this.router.navigate(['/auth/signin']);
  return false;
}
```

### CSRF Protection

```typescript
// ✅ HttpClient handles CSRF automatically
// Server sets cookie: XSRF-TOKEN=abc123
// Angular adds header: X-XSRF-TOKEN: abc123
this.http.post("/api/tasks", data); // CSRF token added automatically
```

---

## Architecture: Key Decisions

### Modules vs Standalone Components

| Modules                      | Standalone                        |
| ---------------------------- | --------------------------------- |
| Established, mature          | Angular's future                  |
| Clear boundaries             | Less boilerplate                  |
| More boilerplate             | Better tree-shaking               |
| Module-centric               | Component-centric                 |
| Use for: Legacy, large teams | Use for: New projects, simplicity |

### Feature Organization

```
app/
├── core/              # Singletons (guards, interceptors)
├── shared/            # Reusable components/pipes
└── pages/             # Feature modules
    ├── auth/
    └── tasks/
        ├── store/     # Feature state
        ├── services/  # Feature services
        ├── models/    # Feature models
        └── components/
```

### Dependency Injection Scopes

```typescript
// Root-level (singleton, tree-shakeable)
@Injectable({ providedIn: "root" })
export class AuthService {}

// Module-level (new instance per lazy module)
@NgModule({
  providers: [TasksService],
})
export class TasksModule {}

// Component-level (new instance per component)
@Component({
  providers: [FormService],
})
export class TaskFormComponent {}
```

---

## Common Interview Questions

### 1. "What's the difference between map and switchMap?"

**Answer**:

- **map**: Transforms values synchronously
  ```typescript
  of(1, 2, 3).pipe(map((x) => x * 2));
  // Output: 2, 4, 6
  ```
- **switchMap**: Transforms to observable, cancels previous
  ```typescript
  searchTerm$.pipe(switchMap((term) => api.search(term)));
  // Cancels previous API call when new search starts
  ```

### 2. "Why use NgRx instead of services with BehaviorSubject?"

**Answer**:

- **NgRx**: Predictable state, time-travel debugging, Redux DevTools, enforced patterns, better for complex apps
- **Services**: Simpler, less boilerplate, fine for small apps
- **Use NgRx when**: Multiple data sources, complex state, team needs structure

### 3. "Explain OnPush change detection"

**Answer**:

- Only checks component when:
  1. Input reference changes
  2. Event fires inside component
  3. Async pipe emits
  4. Manual `markForCheck()`
- Requires immutability
- Dramatically reduces checks (100x faster for lists)

### 4. "How do you prevent memory leaks in Angular?"

**Answer**:

1. Use `async` pipe (auto-unsubscribes)
2. Use `takeUntilDestroyed()` for manual subscriptions
3. Unsubscribe in `ngOnDestroy()`
4. Avoid subscribing in services (return observables)
5. Clear intervals/timeouts

### 5. "What's the purpose of TrackBy?"

**Answer**:

- Helps Angular identify items in list
- Without: Destroys/recreates all DOM on change
- With: Reuses DOM for unchanged items
- Must return unique ID (not index for dynamic lists)

### 6. "How does Angular prevent XSS?"

**Answer**:

- Automatic HTML escaping in templates
- DomSanitizer removes dangerous content
- Content Security Policy
- Never use `innerHTML` with untrusted content

### 7. "Explain async validators"

**Answer**:

- Return `Observable<ValidationErrors | null>`
- Used for server-side validation
- Best practices:
  - Debounce input (500ms)
  - Use `switchMap` to cancel previous
  - Handle errors with `catchError`
  - Provide loading state

### 8. "What's tree-shaking?"

**Answer**:

- Removes unused code from bundle
- Works with ES6 modules
- `providedIn: 'root'` makes services tree-shakeable
- Import specific functions, not entire libraries
- Enabled in production builds

---

## Code Snippets Library

### Debounced Search

```typescript
private searchTerm$ = new Subject<string>();

ngOnInit(): void {
  this.searchTerm$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(term => this.api.search(term)),
    catchError(() => of([]))
  ).subscribe(results => {
    this.searchResults = results;
  });
}

onSearch(term: string): void {
  this.searchTerm$.next(term);
}
```

### Loading State Pattern

```typescript
// Component
isLoading$ = this.store.select(selectTasksLoading);
tasks$ = this.store.select(selectAllTasks);
error$ = this.store.select(selectTasksError);

// Template
<div *ngIf="isLoading$ | async">Loading...</div>
<div *ngIf="error$ | async as error">Error: {{ error }}</div>
<div *ngIf="tasks$ | async as tasks">
  <div *ngFor="let task of tasks">{{ task.title }}</div>
</div>
```

### Form Reset Pattern

```typescript
onSave(): void {
  if (this.form.valid) {
    this.api.save(this.form.value).subscribe({
      next: () => {
        this.form.reset(); // Reset to initial values
        this.form.markAsPristine(); // Reset dirty flag
        this.form.markAsUntouched(); // Reset touched flag
      },
      error: (error) => {
        console.error('Save failed', error);
      }
    });
  }
}
```

### Conditional Validation

```typescript
this.form = this.fb.group({
  notifyByEmail: [false],
  email: [""],
});

// Add validator when checkbox checked
this.form.get("notifyByEmail")?.valueChanges.subscribe((notify) => {
  const emailControl = this.form.get("email");
  if (notify) {
    emailControl?.setValidators([Validators.required, Validators.email]);
  } else {
    emailControl?.clearValidators();
  }
  emailControl?.updateValueAndValidity();
});
```

### Parallel HTTP Calls

```typescript
// Wait for all to complete
forkJoin({
  tasks: this.api.getTasks(),
  users: this.api.getUsers(),
  projects: this.api.getProjects(),
}).subscribe(({ tasks, users, projects }) => {
  // All completed, process data
});

// Emit when any completes
combineLatest([
  this.api.getTasks(),
  this.api.getUsers(),
])subscribe(([tasks, users]) => {
  // Called when either completes or updates
});
```

### Route Data Loading

```typescript
// Resolver
@Injectable({ providedIn: 'root' })
export class TaskResolver implements Resolve<ITask> {
  constructor(private api: TaskService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITask> {
    const id = route.paramMap.get('id')!;
    return this.api.getTask(id);
  }
}

// Route config
{
  path: 'tasks/:id',
  component: TaskDetailComponent,
  resolve: { task: TaskResolver },
}

// Component
ngOnInit(): void {
  this.task$ = this.route.data.pipe(map(data => data['task']));
}
```

---

## Gotchas & Edge Cases

### 1. **Subscribing Multiple Times to Same Observable**

```typescript
// ❌ BAD: Creates 2 separate HTTP requests
<div>{{ tasks$ | async }}</div>
<div>{{ (tasks$ | async)?.length }}</div>

// ✅ GOOD: Use shareReplay or assign to variable
<div *ngIf="tasks$ | async as tasks">
  <div>{{ tasks }}</div>
  <div>{{ tasks.length }}</div>
</div>

// OR use shareReplay
tasks$ = this.api.getTasks().pipe(shareReplay(1));
```

### 2. **Async Pipe with OnPush**

```typescript
// ✅ Async pipe triggers change detection automatically
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  data$ = this.api.getData(); // Works perfectly with OnPush
}
// Template: {{ data$ | async }}
```

### 3. **NgRx Immutability Mistake**

```typescript
// ❌ BAD: Mutation doesn't trigger OnPush
on(updateTask, (state, { task }) => {
  const existing = state.tasks.find((t) => t.id === task.id);
  existing.title = task.title; // Mutation!
  return state; // Same reference
});

// ✅ GOOD: Immutable update
on(updateTask, (state, { task }) => ({
  ...state,
  tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
}));
```

### 4. **Form Array Index Issue**

```typescript
// ❌ BAD: Index changes when items removed
<div *ngFor="let control of formArray.controls; let i=index">
  <input [formControlName]="i" />
</div>

// ✅ GOOD: Use trackBy
<div *ngFor="let control of formArray.controls; let i=index; trackBy: trackByIndex">
  <input [formControlName]="i" />
</div>

trackByIndex(index: number): number {
  return index;
}
```

### 5. **Router Navigation in Constructor**

```typescript
// ❌ BAD: Services not ready
constructor(private router: Router) {
  this.router.navigate(['/tasks']); // Might fail
}

// ✅ GOOD: Use ngOnInit
ngOnInit(): void {
  this.router.navigate(['/tasks']);
}
```

### 6. **Unsubscribe Too Early**

```typescript
// ❌ BAD: Completes immediately
ngOnInit(): void {
  this.api.getData().pipe(
    take(1) // Completes after first emission
  ).subscribe(data => {
    this.data = data;
  });
  // If using takeUntilDestroyed, don't use take(1)
}

// ✅ GOOD: Let Angular handle it
ngOnInit(): void {
  this.data$ = this.api.getData(); // Use async pipe in template
}
```

### 7. **ViewChild Timing Issue**

```typescript
// ❌ BAD: undefined in ngOnInit
@ViewChild('myInput') input!: ElementRef;

ngOnInit(): void {
  console.log(this.input); // undefined!
}

// ✅ GOOD: Use ngAfterViewInit
ngAfterViewInit(): void {
  console.log(this.input); // Available now
}
```

### 8. **Production Build Breaks**

```typescript
// Common causes:
// 1. Functions in providers
providers: [
  { provide: API_URL, useValue: getApiUrl() } // ❌ Not AOT compatible
]

// ✅ Use factory
providers: [
  { provide: API_URL, useFactory: () => getApiUrl() }
]

// 2. Private dependencies in constructor
constructor(private http: HttpClient) {}
// Template uses http → AOT error

// ✅ Make public
constructor(public http: HttpClient) {}
```

---

## Final Interview Tips

### Before Interview

1. **Review your project**
   - Know your architecture decisions
   - Explain patterns you used (NgRx, FormHelper)
   - Understand trade-offs made

2. **Practice explaining**
   - OnPush change detection
   - NgRx data flow
   - RxJS operator differences
   - Security measures

3. **Prepare questions**
   - Team structure & workflows
   - Tech stack details
   - Testing practices
   - CI/CD pipeline

### During Interview

1. **Clarify requirements** before coding
2. **Think out loud** - explain your reasoning
3. **Start simple**, then optimize
4. **Discuss trade-offs** - no perfect solutions
5. **Ask questions** - shows engagement
6. **Be honest** - say "I don't know" vs guessing

### Common Topics

- ✅ RxJS operators (map, switchMap, debounceTime)
- ✅ NgRx architecture (actions, reducers, effects, selectors)
- ✅ Change detection strategies (Default vs OnPush)
- ✅ Performance optimization (lazy loading, TrackBy, virtual scrolling)
- ✅ Forms (reactive, validation, async validators)
- ✅ Security (XSS, CSRF, JWT)
- ✅ Architecture (modules, DI, clean architecture)
- ✅ Testing (unit, integration, e2e)
- ✅ Build optimization (bundle size, tree-shaking)

---

## Study Guide Index

1. **[Core Concepts](./ANGULAR-CORE-CONCEPTS.md)** - RxJS, State Management, Change Detection, Memory Management
2. **[Architecture & Organization](./ANGULAR-ARCHITECTURE.md)** - Modules vs Standalone, Clean Architecture, Feature Organization
3. **[Forms & Security](./ANGULAR-FORMS-SECURITY.md)** - Reactive Forms, Validators, XSS Prevention, Authentication
4. **[Performance](./ANGULAR-PERFORMANCE.md)** - OnPush, TrackBy, Virtual Scrolling, Bundle Optimization
5. **[Quick Reference](./ANGULAR-QUICK-REFERENCE.md)** ← You are here

---

**Good luck with your interview! 🚀**

_Remember: Confidence comes from understanding, not memorization. Explain the "why" behind your decisions._
