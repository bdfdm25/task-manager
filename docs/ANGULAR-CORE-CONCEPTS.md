# Angular Core Concepts Study Guide

## RxJS, State Management & Observables

> **Target Level**: Senior Frontend Engineer  
> **Focus**: Enterprise Applications  
> **Last Updated**: February 2026

---

## Table of Contents

1. [RxJS Fundamentals](#rxjs-fundamentals)
2. [State Management with NgRx](#state-management-with-ngrx)
3. [Change Detection Strategies](#change-detection-strategies)
4. [Memory Management & Subscriptions](#memory-management--subscriptions)

---

## RxJS Fundamentals

### What is RxJS?

RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using Observables, making it easier to compose asynchronous or callback-based code. It's the foundation of Angular's reactive programming model.

### Core Concepts in Your Code

#### 1. **Observables for HTTP Communication**

**Location**: `task-manager-app/src/app/pages/tasks/services/task.service.ts` (Lines 14-31)

```typescript
public getTaskList(): Observable<ITask[]> {
  return this.http.get<ITask[]>(Routes.TASKS);
}

public createTask(task: ITask): Observable<ITask> {
  return this.http.post<ITask>(Routes.TASKS, task);
}

public updateTask(task: ITask): Observable<ITask> {
  return this.http.patch<ITask>(`${Routes.TASKS}/${task.id}`, task);
}
```

**Why This Pattern?**

- **Cold Observables**: HTTP observables are cold - they don't execute until subscribed
- **Automatic Cleanup**: HttpClient observables complete automatically after response
- **Type Safety**: Generic types provide compile-time type checking

**Alternative Approaches:**

- **Promises**: `.toPromise()` - Simpler but loses cancellation capability
- **Signals (Angular 16+)**: New reactive primitive, but less flexible for complex async flows

#### 2. **Observable Operators and Transformation**

**Location**: `task-manager-app/src/app/pages/tasks/task-detail-dialog/task-detail-dialog.component.ts` (Lines 188-200)

```typescript
private taskCodeExistsValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;
    if (!value) {
      return of(null);
    }

    return of(value).pipe(
      debounceTime(500), // Wait for user to stop typing
      switchMap((taskCode) =>
        this.taskService.checkTaskCodeExists(taskCode).pipe(
          map((exists) => (exists ? { taskExists: true } : null)),
          catchError(() => of(null)),
        ),
      ),
    );
  };
}
```

**Key Operators Explained:**

- **`debounceTime(500)`**: Waits 500ms after last emission before proceeding - prevents excessive API calls
- **`switchMap`**: Cancels previous inner observable when new value arrives - prevents race conditions
- **`map`**: Transforms the boolean response to validation error format
- **`catchError`**: Gracefully handles errors, returns null instead of breaking the stream
- **`of(null)`**: Creates a simple observable that emits null and completes

**Why This Combination?**

- Prevents API spam during typing
- Cancels outdated requests automatically
- Handles errors without breaking validation flow
- Type-safe error handling

**Common Pitfalls:**

```typescript
// ❌ BAD: Using mergeMap instead of switchMap
mergeMap((taskCode) => this.taskService.checkTaskCodeExists(taskCode));
// Problem: Doesn't cancel previous requests, can cause race conditions

// ❌ BAD: No error handling
switchMap((taskCode) => this.taskService.checkTaskCodeExists(taskCode));
// Problem: Any error breaks the entire validation stream

// ❌ BAD: No debounce
switchMap((taskCode) => this.taskService.checkTaskCodeExists(taskCode));
// Problem: Makes API call on every keystroke
```

#### 3. **BehaviorSubject for State Management**

**Location**: `task-manager-app/src/app/core/services/session.service.ts` (Lines 8-20)

```typescript
export class SessionService {
  private userSubject$ = new BehaviorSubject<IUser | null>(null);
  public user$ = this.userSubject$.asObservable();

  setUser(user: IUser): void {
    this.userSubject$.next(user);
  }

  getUser(): IUser | null {
    return this.userSubject$.getValue();
  }
}
```

**BehaviorSubject vs Subject vs ReplaySubject:**

| Type                | Initial Value | Replays    | Use Case                           |
| ------------------- | ------------- | ---------- | ---------------------------------- |
| **Subject**         | None          | No         | Event bus, no initial state needed |
| **BehaviorSubject** | Required      | Last value | Current state (like user session)  |
| **ReplaySubject**   | None          | N values   | Cache multiple emissions           |
| **AsyncSubject**    | None          | Only last  | Single async result                |

**Why BehaviorSubject for User State?**

- Always has current user value available
- New subscribers immediately get current state
- Synchronous access via `getValue()`
- Ideal for session management

---

## State Management with NgRx

### Why NgRx Over Component State?

**Your Application Uses NgRx** for both Auth and Tasks features, demonstrating enterprise-grade state management.

#### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      COMPONENT                           │
│  - Dispatch Actions                                      │
│  - Subscribe to Selectors                                │
└───────────────┬─────────────────────┬───────────────────┘
                │                     │
                ▼                     ▼
         ┌──────────┐          ┌──────────┐
         │ ACTIONS  │          │SELECTORS │
         └────┬─────┘          └────┬─────┘
              │                     │
              ▼                     │
         ┌──────────┐               │
         │ EFFECTS  │               │
         │ (Async)  │               │
         └────┬─────┘               │
              │                     │
              ▼                     │
         ┌──────────┐               │
         │ REDUCER  │◄──────────────┘
         │ (Pure)   │
         └────┬─────┘
              │
              ▼
         ┌──────────┐
         │  STORE   │
         └──────────┘
```

### Real Implementation: Tasks Feature

#### 1. **Actions Definition**

**Location**: `task-manager-app/src/app/pages/tasks/store/tasks.actions.ts` (Lines 1-25)

```typescript
import { createAction, props } from "@ngrx/store";
import { ITask } from "../interfaces/task.interface";

// Async action pattern: Request → Success → Failure
export const loadTasks = createAction("[Tasks Page] Load Tasks");
export const loadTasksSuccess = createAction("[Tasks API] Load Tasks Success", props<{ tasks: ITask[] }>());
export const loadTasksFailure = createAction("[Tasks API] Load Tasks Failure", props<{ error: string }>());

export const addTask = createAction("[Task Dialog] Add Task", props<{ task: ITask }>());
export const addTaskSuccess = createAction("[Tasks API] Add Task Success", props<{ task: ITask }>());
```

**Action Naming Convention:**

- `[Source] Event` - Makes debugging easier
- Async operations: `load → loadSuccess → loadFailure`
- `props<T>()` - Type-safe payload definition

#### 2. **Effects for Side Effects**

**Location**: `task-manager-app/src/app/pages/tasks/store/tasks.effect.ts` (Lines 15-40)

```typescript
loadTasks$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TasksActions.loadTasks),
    switchMap(() =>
      this.taskService.getTaskList().pipe(
        map((tasks) => TasksActions.loadTasksSuccess({ tasks })),
        catchError((error) => of(TasksActions.loadTasksFailure({ error: error.message }))),
      ),
    ),
  ),
);

addTask$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TasksActions.addTask),
    switchMap((action) =>
      this.taskService.createTask(action.task).pipe(
        map((task) => TasksActions.addTaskSuccess({ task })),
        catchError((error) => of(TasksActions.addTaskFailure({ error: error.message }))),
      ),
    ),
  ),
);
```

**Effect Patterns Explained:**

- **`ofType()`**: Filters actions stream to specific action types
- **`switchMap()`**: Cancels previous HTTP request if new action arrives
- **Error Handling**: Always catch errors and return failure action
- **`createEffect()`**: Automatically subscribes/unsubscribes

**Alternative Operators:**

- **`switchMap`**: Cancel previous (best for search, GET requests)
- **`mergeMap`**: Run all concurrently (multiple POST operations)
- **`concatMap`**: Queue requests (ensure order matters)
- **`exhaustMap`**: Ignore new requests until current completes (prevent duplicate submissions)

#### 3. **Reducer for State Updates**

**Location**: `task-manager-app/src/app/pages/tasks/store/tasks.reducer.ts` (Lines 10-55)

```typescript
export interface TasksState {
  tasks: ITask[];
  error: string | null;
  loading: boolean;
}

const initialState: TasksState = {
  tasks: [],
  error: null,
  loading: false,
};

export const tasksReducer = createReducer(
  initialState,
  on(TasksActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
  })),
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(TasksActions.addTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
  })),
);
```

**Reducer Best Practices:**

- **Pure Functions**: No side effects, same input → same output
- **Immutability**: Always return new state object
- **Use Spread Operator**: `...state`, `[...state.tasks, task]`
- **Specific State Structure**: Separate loading/error from data

**Common Pitfalls:**

```typescript
// ❌ BAD: Mutating state directly
on(TasksActions.addTaskSuccess, (state, { task }) => {
  state.tasks.push(task); // MUTATION!
  return state;
});

// ❌ BAD: Side effects in reducer
on(TasksActions.loadTasksSuccess, (state, { tasks }) => {
  console.log("Tasks loaded"); // SIDE EFFECT!
  localStorage.setItem("tasks", JSON.stringify(tasks)); // SIDE EFFECT!
  return { ...state, tasks };
});

// ✅ GOOD: Pure, immutable
on(TasksActions.addTaskSuccess, (state, { task }) => ({
  ...state,
  tasks: [...state.tasks, task],
}));
```

#### 4. **Selectors for Derived State**

**Location**: `task-manager-app/src/app/pages/tasks/store/tasks.selectors.ts` (Lines 10-35)

```typescript
export const selectTasksState = createFeatureSelector<TasksState>("tasks");

export const selectAllTasks = createSelector(selectTasksState, (state: TasksState) => state.tasks);

export const selectTasksLoading = createSelector(selectTasksState, (state: TasksState) => state.loading);

// Memoized derived state - filters are computed only when tasks change
export const selectOpenTasks = createSelector(selectAllTasks, (tasks: ITask[]) =>
  tasks.filter((task) => task.status === TaskStatus.OPEN),
);

export const selectInProgressTasks = createSelector(selectAllTasks, (tasks: ITask[]) =>
  tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS),
);

export const selectDoneTasks = createSelector(selectAllTasks, (tasks: ITask[]) =>
  tasks.filter((task) => task.status === TaskStatus.DONE),
);
```

**Selector Benefits:**

- **Memoization**: Recomputes only when input state changes
- **Composition**: Build complex selectors from simpler ones
- **Performance**: Prevents unnecessary component re-renders
- **Testability**: Easy to test derived state logic

**Usage in Component:**

**Location**: `task-manager-app/src/app/pages/tasks/tasks.component.ts` (Lines 15-25)

```typescript
export class TasksComponent implements OnInit {
  openTasks$ = this.store.select(selectOpenTasks);
  inProgressTasks$ = this.store.select(selectInProgressTasks);
  doneTasks$ = this.store.select(selectDoneTasks);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadTasks());
  }
}
```

**Component Template** uses async pipe for automatic subscription management:

```html
<ng-container *ngIf="openTasks$ | async as tasks">
  <app-task-card *ngFor="let task of tasks" [task]="task"></app-task-card>
</ng-container>
```

---

## Change Detection Strategies

### Default vs OnPush

Angular offers two change detection strategies that significantly impact performance:

#### Default Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.Default // This is the default
})
```

**When it runs:**

- Any async event (setTimeout, promises, HTTP)
- User events (click, input, etc.)
- Zone.js triggers check on entire component tree
- Checks ALL components, even if unchanged

#### OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**When it runs ONLY when:**

- `@Input()` reference changes (must be new object)
- Component event triggers
- Observable used with async pipe emits
- Manual trigger via `ChangeDetectorRef.markForCheck()`

### Your Code Analysis

**Your task-card component** should use OnPush:

**Current**: `task-manager-app/src/app/pages/tasks/task-card/task-card.component.ts`

```typescript
@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  // Missing: changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent {
  @Input() task!: ITask;
}
```

**Recommended Optimization:**

```typescript
@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush, // Add this
})
export class TaskCardComponent {
  @Input() task!: ITask; // Works with OnPush because NgRx uses immutable updates
}
```

**Why it works with NgRx:**

- NgRx reducer creates new task objects: `[...state.tasks, newTask]`
- Reference changes trigger OnPush detection
- Combined with async pipe = maximum performance

### Performance Comparison

```typescript
// Without OnPush: 3 columns × 10 tasks = 30 unnecessary checks per user action
// With OnPush: Only changed task cards check themselves

// Example: User clicks one task
// Default: Checks all 30 task cards
// OnPush: Checks only 1 affected task card
```

---

## Memory Management & Subscriptions

### The Subscription Leak Problem

**BAD Practice** (Memory Leak):

```typescript
export class BadComponent implements OnInit {
  ngOnInit() {
    this.taskService.getTaskList().subscribe((tasks) => {
      this.tasks = tasks;
    }); // ❌ Subscription never cleaned up!
  }
}
```

### Solution Patterns in Your Code

#### Pattern 1: Async Pipe (Preferred)

**Location**: `task-manager-app/src/app/pages/tasks/tasks.component.ts`

```typescript
export class TasksComponent {
  // Observable exposed directly to template
  openTasks$ = this.store.select(selectOpenTasks);
}
```

```html
<!-- Async pipe handles subscription/unsubscription automatically -->
<ng-container *ngIf="openTasks$ | async as tasks">
  <app-task-card *ngFor="let task of tasks" [task]="task"></app-task-card>
</ng-container>
```

**Benefits:**

- ✅ Automatic unsubscription on component destroy
- ✅ Triggers change detection when value emits
- ✅ Handles loading states gracefully
- ✅ No memory leaks

#### Pattern 2: takeUntil + Subject

```typescript
export class ManualSubscriptionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.taskService
      .getTaskList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tasks) => {
        this.tasks = tasks;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**When to use:**

- Multiple related subscriptions
- Need to unsubscribe conditionally
- Complex subscription logic

#### Pattern 3: takeUntilDestroyed (Angular 16+)

```typescript
export class ModernComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.taskService
      .getTaskList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tasks) => {
        this.tasks = tasks;
      });
  }
  // No ngOnDestroy needed!
}
```

---

## Common Interview Questions

### 1. **"Explain the difference between map, switchMap, mergeMap, and concatMap"**

**Answer with Code Examples:**

```typescript
// map: Transform value, return simple value
of(1, 2, 3).pipe(map((x) => x * 2)); // Output: 2, 4, 6

// switchMap: Transform to Observable, cancel previous
fromEvent(input, "keyup").pipe(switchMap(() => this.http.get("/api/search"))); // Cancels previous request if user types again

// mergeMap: Transform to Observable, run all concurrently
of(1, 2, 3).pipe(mergeMap((id) => this.http.get(`/api/task/${id}`))); // All 3 requests run simultaneously

// concatMap: Transform to Observable, queue in order
of(1, 2, 3).pipe(concatMap((id) => this.http.post("/api/task", { id }))); // Requests execute one after another
```

### 2. **"Why use NgRx instead of services with BehaviorSubject?"**

**Answer:**

**NgRx Advantages:**

- ✅ Enforced unidirectional data flow
- ✅ Time-travel debugging with Redux DevTools
- ✅ Built-in side effect management (Effects)
- ✅ Immutability enforced by design
- ✅ Testability (reducers are pure functions)
- ✅ Scalability for large teams

**Service with BehaviorSubject:**

- ✅ Simpler for small apps
- ✅ Less boilerplate
- ✅ Easier learning curve
- ❌ No enforced patterns
- ❌ Can become messy in large apps

**Your app demonstrates NgRx is appropriate when:**

- Multiple features share state (auth, tasks)
- Complex async operations (CRUD operations)
- Team needs consistent patterns
- Time-travel debugging valuable

### 3. **"How do you prevent memory leaks in Angular?"**

**Answer:**

1. **Use async pipe** (automatic cleanup)
2. **takeUntil pattern** with Subject on destroy
3. **Angular 16+**: Use `takeUntilDestroyed()`
4. **Avoid** subscribing in templates
5. **Always unsubscribe** from manual subscriptions
6. **Use OnPush** change detection to reduce checks

### 4. **"Explain Hot vs Cold Observables"**

**Answer:**

**Cold Observables** (like your HTTP calls):

- Don't produce values until subscribed
- Each subscriber gets its own execution
- Example: `this.http.get()` - separate request per subscriber

```typescript
const cold$ = this.http.get("/api/tasks");
cold$.subscribe(console.log); // Executes HTTP request
cold$.subscribe(console.log); // Executes another HTTP request
```

**Hot Observables** (like your user$ in SessionService):

- Produce values regardless of subscribers
- Subscribers share same execution
- Example: `userSubject$.asObservable()`

```typescript
const hot$ = this.userSubject$.asObservable();
hot$.subscribe(console.log); // Gets current + future values
hot$.subscribe(console.log); // Gets same values, no new execution
```

**Converting Cold to Hot:**

```typescript
const shared$ = this.http.get("/api/tasks").pipe(
  shareReplay(1), // Share result, replay last value
);
```

---

## Discussion Points

1. **When would you NOT use NgRx in an Angular application?**
   - Small applications (<5 routes)
   - Simple CRUD with no shared state
   - Prototypes/MVPs where speed matters more than structure

2. **How does RxJS enable reactive programming benefits?**
   - Declarative code (what, not how)
   - Composability (combine operators)
   - Error handling as first-class citizen
   - Automatic cleanup and resource management

3. **What are the trade-offs of using OnPush change detection?**
   - Pros: Better performance, forces immutability, clearer data flow
   - Cons: More careful input management, can be counterintuitive for beginners, manual triggers needed sometimes

4. **How would you optimize a list of 1000+ items in Angular?**
   - Virtual scrolling (CDK)
   - OnPush change detection
   - TrackBy function in \*ngFor
   - Lazy loading data in chunks
   - Web Workers for heavy computations

---

## Anti-Patterns to Avoid

### 1. **Subscribing Inside Subscribe (Pyramid of Doom)**

```typescript
// ❌ BAD
this.service1.getData().subscribe((data1) => {
  this.service2.getData(data1).subscribe((data2) => {
    this.service3.getData(data2).subscribe((data3) => {
      // Nested hell
    });
  });
});

// ✅ GOOD: Use operators
this.service1
  .getData()
  .pipe(
    switchMap((data1) => this.service2.getData(data1)),
    switchMap((data2) => this.service3.getData(data2)),
  )
  .subscribe((data3) => {
    // Flat, readable
  });
```

### 2. **Forgetting to Unsubscribe**

```typescript
// ❌ BAD
ngOnInit() {
  this.interval$ = interval(1000).subscribe(console.log);
}

// ✅ GOOD
ngOnInit() {
  interval(1000)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(console.log);
}
```

### 3. **Not Using Selectors for Derived State**

```typescript
// ❌ BAD: Computing in component
get openTasks() {
  return this.tasks.filter(t => t.status === 'open'); // Recomputed on every check!
}

// ✅ GOOD: Memoized selector
openTasks$ = this.store.select(selectOpenTasks); // Computed only when tasks change
```

---

**Next**: [Angular Architecture & Organization →](./ANGULAR-ARCHITECTURE.md)
