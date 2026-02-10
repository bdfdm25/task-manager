# Angular Architecture & Organization Study Guide

## Modules vs Standalone, Clean Architecture, Feature Organization

> **Target Level**: Senior Frontend Engineer  
> **Focus**: Enterprise Application Architecture  
> **Last Updated**: February 2026

---

## Table of Contents

1. [Modules vs Standalone Components](#modules-vs-standalone-components)
2. [Application Structure & Feature Organization](#application-structure--feature-organization)
3. [Clean Architecture Implementation](#clean-architecture-implementation)
4. [Lazy Loading & Code Splitting](#lazy-loading--code-splitting)
5. [Dependency Injection Patterns](#dependency-injection-patterns)

---

## Modules vs Standalone Components

### Historical Context

Angular introduced **Standalone Components** in v14 (stable in v15) as an alternative to NgModules, addressing years of developer feedback about boilerplate and complexity.

### Your Current Architecture: NgModules

**Location**: Your app uses traditional NgModule-based architecture throughout.

```
task-manager-app/
├── app.module.ts (Root Module)
├── core/
│   └── core.module.ts (Singleton services)
├── pages/
│   ├── auth/
│   │   └── auth.module.ts (Feature module)
│   └── tasks/
│       └── tasks.module.ts (Feature module)
└── shared/
    └── components/
        └── components.module.ts (Shared components)
```

#### Example: Auth Module

**Location**: `task-manager-app/src/app/pages/auth/auth.module.ts`

```typescript
@NgModule({
  declarations: [AuthComponent, SigninComponent, SignupComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    ComponentsModule, // Shared components
    StoreModule.forFeature("auth", authReducer),
  ],
})
export class AuthModule {}
```

---

### Deep Dive: Modules vs Standalone

| Aspect             | **NgModules**                                    | **Standalone Components**            |
| ------------------ | ------------------------------------------------ | ------------------------------------ |
| **Boilerplate**    | High - need `declarations`, `imports`, `exports` | Low - import directly in component   |
| **Tree-shaking**   | Less efficient                                   | More efficient (better bundle sizes) |
| **Mental Model**   | Module-centric thinking                          | Component-centric thinking           |
| **Migration**      | Established, legacy code friendly                | Modern, future-proof                 |
| **Learning Curve** | Steeper (understand modules first)               | Gentler for newcomers                |
| **Lazy Loading**   | Module-based                                     | Route-based or directive-based       |
| **Testing**        | More configuration needed                        | Simpler test setup                   |
| **Ecosystem**      | Full support, mature                             | Growing, Angular's future direction  |

### Pros and Cons Analysis

#### NgModules Advantages ✅

1. **Clear Boundaries**: Explicit module boundaries between features
2. **Established Patterns**: Well-understood by teams, extensive resources
3. **Organizational Tool**: Groups related components logically
4. **Provider Scoping**: Easy to scope services to feature modules
5. **Legacy Compatibility**: Works with all Angular versions
6. **Team Structure**: Matches typical enterprise team organization

#### NgModules Disadvantages ❌

1. **Boilerplate**: Repeated imports/exports across modules
2. **Implicit Dependencies**: Can't easily see what component actually needs
3. **Declaration Confusion**: components must be declared exactly once
4. **Testing Overhead**: Need to configure testing modules
5. **Bundle Size**: Less efficient tree-shaking
6. **Circular Dependencies**: Easier to create accidentally

#### Standalone Components Advantages ✅

1. **Less Boilerplate**: No module files needed
2. **Explicit Dependencies**: Clear what component imports
3. **Better Tree-Shaking**: Unused code more easily removed
4. **Simpler Mental Model**: Component is the unit of composition
5. **Easier Testing**: Import only what you need
6. **Future-Proof**: Angular's recommended path forward
7. **Micro-Frontend Friendly**: Easier to share components

#### Standalone Components Disadvantages ❌

1. **Migration Challenge**: Existing codebases need conversion
2. **Less Established**: Fewer patterns/examples (improving rapidly)
3. **Repeated Imports**: May import same things in many components
4. **Organizational Loss**: No module to group related components
5. **Learning Curve**: New APIs, different mental model

---

### How Your Auth Module Would Look as Standalone

**Current Module Approach:**

`auth.module.ts` - 25 lines of module configuration

```typescript
@NgModule({
  declarations: [AuthComponent, SigninComponent, SignupComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    StoreModule.forFeature("auth", authReducer),
  ],
})
export class AuthModule {}
```

**Standalone Approach:**

Each component declares its own imports:

```typescript
// auth.component.ts
@Component({
  selector: "app-auth",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, // More specific than AuthRoutingModule
    SigninComponent,
    SignupComponent,
  ],
  templateUrl: "./auth.component.html",
})
export class AuthComponent {}

// signin.component.ts
@Component({
  selector: "app-signin",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordInputComponent, // Direct import, not via module
    RouterLink,
  ],
  templateUrl: "./signin.component.html",
})
export class SigninComponent {}
```

**Routing with Standalone:**

```typescript
// auth.routes.ts
import { Routes } from "@angular/router";

export const AUTH_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import("./auth.component").then((m) => m.AuthComponent),
    children: [
      {
        path: "signin",
        loadComponent: () => import("./signin/signin.component").then((m) => m.SigninComponent),
      },
      {
        path: "signup",
        loadComponent: () => import("./signup/signup.component").then((m) => m.SignupComponent),
      },
    ],
  },
];
```

---

### TypeScript Benefits with Angular

Angular and TypeScript are deeply integrated. Here's why TypeScript is essential:

#### 1. **Compile-Time Type Safety**

**Your Code Example**: `task-manager-app/src/app/pages/tasks/interfaces/task.interface.ts`

```typescript
export interface ITask {
  id: string;
  taskCode?: string;
  title: string;
  status: TaskStatus; // Enum type, not just string
  description: string;
  priority?: TaskPriority; // Type-safe enums
  category?: TaskCategory;
  assignedTo?: string;
  estimatedHours?: number;
  deadline?: Date | string | null;
  tags?: string;
  notifyOnCompletion?: boolean;
}
```

**Benefits:**

```typescript
// ✅ TypeScript catches errors at compile time
const task: ITask = {
  id: '123',
  title: 'Test',
  status: 'invalid', // ERROR: Type '"invalid"' is not assignable to type 'TaskStatus'
  description: 'Test',
};

// ✅ Autocomplete and IntelliSense
task. // IDE shows all available properties

// ✅ Refactoring safety
// Rename ITask.title → ITask.taskTitle
// TypeScript finds all 50+ usages automatically

// ❌ JavaScript: No protection
const task = {
  title: 'Test',
  statuss: 'open', // Typo! No error, silent bug
};
```

#### 2. **Generic Type Parameters**

**Your Code**: `task-manager-app/src/app/pages/tasks/services/task.service.ts`

```typescript
public getTaskList(): Observable<ITask[]> {
  return this.http.get<ITask[]>(Routes.TASKS);
  // Generic constrains response type
  // HttpClient knows to expect ITask[]
}

public createTask(task: ITask): Observable<ITask> {
  return this.http.post<ITask>(Routes.TASKS, task);
  // TypeScript validates task structure matches ITask
}
```

#### 3. **Decorators & Metadata**

TypeScript decorators enable Angular's dependency injection:

```typescript
@Injectable({ providedIn: "root" }) // TypeScript decorator
export class TaskService {
  constructor(private http: HttpClient) {} // Type-aware DI
}
```

Without TypeScript, Angular couldn't:

- Inject dependencies automatically
- Validate decorator parameters
- Generate metadata for compilation

#### 4. **Union Types & Type Guards**

```typescript
// Your enum-based type safety
export enum TaskStatus {
  OPEN = "open",
  IN_PROGRESS = "in progress",
  DONE = "done",
}

// Union type for precise control
type TaskFilter = TaskStatus | "all";

function filterTasks(tasks: ITask[], filter: TaskFilter): ITask[] {
  if (filter === "all") return tasks;
  return tasks.filter((task) => task.status === filter);
  // TypeScript knows filter is TaskStatus here
}
```

#### 5. **Interface Contracts**

**Your FormHelper abstraction**:

**Location**: `task-manager-app/src/app/shared/models/model.interface.ts`

```typescript
export interface IModelInterface {
  getValidationRules(): { [key: string]: ValidatorFn[] };
  getFieldsProperties(): {
    [key: string]: {
      value: string | number | boolean | Date | null;
      disabled: boolean;
    };
  };
}
```

**Implementation**: `task-manager-app/src/app/pages/tasks/models/task-form.model.ts`

```typescript
export class TaskFormModel implements IModelInterface {
  // TypeScript enforces implementing these methods
  getValidationRules(): { [key: string]: ValidatorFn[] } {
    // Must return this exact structure
  }

  getFieldsProperties(): { ... } {
    // Must return this exact structure
  }
}
```

**Benefits:**

- Contract enforcement at compile time
- Guaranteed API consistency
- Self-documenting code
- Refactoring safety

---

## Application Structure & Feature Organization

### Your Current Architecture

```
task-manager-app/
├── app/
│   ├── core/                  # Singleton services, guards, interceptors
│   │   ├── guards/           # Route protection
│   │   ├── interceptors/     # HTTP request/response handling
│   │   └── services/         # App-wide singleton services
│   │
│   ├── shared/               # Reusable across features
│   │   ├── components/       # Dumb components
│   │   ├── helpers/          # Utility classes
│   │   └── models/           # Shared interfaces
│   │
│   ├── pages/                # Feature modules
│   │   ├── auth/            # Authentication feature
│   │   │   ├── signin/
│   │   │   ├── signup/
│   │   │   ├── store/       # Feature state
│   │   │   └── interfaces/
│   │   │
│   │   └── tasks/           # Tasks feature
│   │       ├── task-card/
│   │       ├── task-detail-dialog/
│   │       ├── tasks-header/
│   │       ├── store/       # Feature state
│   │       ├── enum/        # Feature-specific enums
│   │       ├── interfaces/
│   │       ├── models/
│   │       └── services/    # Feature-specific services
│   │
│   └── app.module.ts         # Root module
```

### Architectural Principles Applied

#### 1. **Core Module Pattern**

**Purpose**: Singleton services used across the app

**Location**: `task-manager-app/src/app/core/core.module.ts`

```typescript
@NgModule({
  providers: [
    AuthService, // Authentication logic
    SessionService, // Session management
  ],
})
export class CoreModule {
  // Prevent re-importing CoreModule
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error("CoreModule is already loaded. Import it only in AppModule");
    }
  }
}
```

**What belongs in Core:**

- ✅ Authentication/Authorization services
- ✅ HTTP interceptors
- ✅ Route guards
- ✅ App-level state services
- ✅ Error handling services
- ❌ Feature-specific logic
- ❌ UI components

#### 2. **Shared Module Pattern**

**Purpose**: Reusable components/utilities across features

**Location**: `task-manager-app/src/app/shared/components/components.module.ts`

```typescript
@NgModule({
  declarations: [
    LoadingComponent,
    PasswordInputComponent, // Reusable form control
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    LoadingComponent,
    PasswordInputComponent,
    // Export for other modules to use
  ],
})
export class ComponentsModule {}
```

**What belongs in Shared:**

- ✅ Dumb/presentational components
- ✅ Pipes and directives
- ✅ Utility functions
- ✅ Common interfaces
- ❌ Services (usually)
- ❌ Feature logic

#### 3. **Feature Module Pattern**

**Your Tasks Module** demonstrates proper feature encapsulation:

**Location**: `task-manager-app/src/app/pages/tasks/tasks.module.ts`

```typescript
@NgModule({
  declarations: [
    TasksComponent, // Smart component
    TaskCardComponent, // Presentation component
    TaskDetailDialogComponent,
    TaskDeleteDialogComponent,
    TasksHeaderComponent,
  ],
  imports: [
    CommonModule,
    TasksRoutingModule, // Feature routing
    StoreModule.forFeature("tasks", tasksReducer), // Feature state
    EffectsModule.forFeature([TasksEffects]),
    ComponentsModule, // Shared components
    MaterialModule,
  ],
})
export class TasksModule {}
```

**Feature Module Checklist:**

- ✅ Own routing module
- ✅ Own state management (if needed)
- ✅ Feature-specific services
- ✅ Feature-specific components
- ✅ Lazy-loadable
- ✅ Self-contained
- ❌ Doesn't export components (unless library)

---

### Organizing Medium/Large Applications

#### Strategy 1: Feature-First Organization (Your Approach)

```
app/
├── pages/                    # All features here
│   ├── auth/
│   ├── tasks/
│   ├── dashboard/
│   ├── reports/
│   └── settings/
```

**Pros:**

- Clear feature boundaries
- Easy to find feature code
- Supports team ownership
- Scales well

**Cons:**

- Shared code might be duplicated
- Cross-feature dependencies can be messy

#### Strategy 2: Layer-First Organization

```
app/
├── components/           # All components
├── services/            # All services
├── models/              # All models
└── state/               # All state
```

**Pros:**

- Easy to find by type
- Clear technical boundaries

**Cons:**

- ❌ Features scattered across folders
- ❌ Doesn't scale beyond ~10 files per type
- ❌ Hard to see feature boundaries

#### Strategy 3: Domain-Driven Design (Hybrid)

```
app/
├── core/                # Infrastructure
├── shared/              # Cross-cutting
└── domains/             # Business domains
    ├── user-management/
    │   ├── auth/
    │   └── profile/
    └── task-management/
        ├── tasks/
        ├── projects/
        └── calendar/
```

**Best for:**

- Large enterprise apps (>100 routes)
- Multiple teams
- Complex business logic

### Modules vs Standalone: Organizational Impact

#### With Modules (Current)

```
tasks/
├── tasks.module.ts        # Module definition
├── tasks-routing.module.ts
├── tasks.component.ts
└── task-card/
    └── task-card.component.ts
```

**Organization:**

- Module acts as "box" containing feature
- Clear import/export boundaries
- Module file shows feature dependencies

#### With Standalone (Future)

```
tasks/
├── tasks.routes.ts       # Route definitions
├── tasks.component.ts    # Imports listed in component
└── task-card/
    └── task-card.component.ts  # Self-contained
```

**Organization:**

- Routes file replaces routing module
- Each component is self-documenting
- More file-level granularity
- Folder structure becomes more important

---

## Clean Architecture Implementation

### Clean Architecture Principles

Your **backend** (NestJS API) demonstrates clean architecture beautifully:

```
task-manager-api/src/
├── core/                    # Business Logic Layer
│   ├── domain/             # Entities & DTOs
│   │   ├── entities/
│   │   └── dtos/
│   ├── use-cases/          # Application logic
│   └── services/           # Service interfaces
│
├── infra/                   # Infrastructure Layer
│   └── db/
│       └── typeorm/        # Database implementation
│
└── presentation/            # Presentation Layer
    ├── auth/
    │   ├── auth.controller.ts
    │   └── auth.service.ts
    └── tasks/
```

### Dependency Rule

```
┌─────────────────────────────────────┐
│         Presentation                │ ← Controllers, HTTP
│  (auth.controller.ts)               │
├─────────────────────────────────────┤
│         Application                 │ ← Use Cases, Business Logic
│  (create-task.usecase.ts)           │
├─────────────────────────────────────┤
│         Domain                      │ ← Entities, Pure Business Rules
│  (task.entity.ts)                   │
├─────────────────────────────────────┤
│         Infrastructure              │ ← Database, External Services
│  (tasks-typeorm.service.ts)         │
└─────────────────────────────────────┘

← Dependencies point INWARD only
← Inner layers know nothing about outer layers
```

### Backend Example: Task Creation Flow

#### 1. Controller (Presentation Layer)

**Location**: `task-manager-api/src/presentation/tasks/tasks.controller.ts`

```typescript
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: TaskDto, @GetUser() user: UserEntity) {
    return this.tasksService.create(createTaskDto, user);
  }
}
```

**Responsibility**: HTTP handling, validation, authentication

#### 2. Service (Application Layer)

**Location**: `task-manager-api/src/presentation/tasks/tasks.service.ts`

```typescript
@Injectable()
export class TasksService {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  async create(createTaskDto: TaskDto, user: UserEntity): Promise<TaskEntity> {
    return await this.createTaskUseCase.execute(createTaskDto, user);
  }
}
```

**Responsibility**: Orchestration, delegates to use cases

#### 3. Use Case (Business Logic)

**Location**: `task-manager-api/src/core/use-cases/tasks/create-task.usecase.ts`

```typescript
export class CreateTaskUseCase {
  constructor(private readonly service: TasksBaseService) {}

  async execute(createTaskDto: TaskDto, user: UserEntity): Promise<TaskEntity> {
    return this.service.create(createTaskDto, user);
  }
}
```

**Responsibility**: Business rules, validation logic

#### 4. Repository (Infrastructure)

**Location**: `task-manager-api/src/infra/db/typeorm/tasks/tasks-typeorm.service.ts`

```typescript
@Injectable()
export class TasksTypeOrmService implements TasksBaseService {
  constructor(@InjectRepository(TaskEntity) private taskRepository: Repository<TaskEntity>) {}

  async create(createTaskDto: TaskDto, user: UserEntity): Promise<TaskEntity> {
    const task = this.taskRepository.create({ ...createTaskDto, user });
    return await this.taskRepository.save(task);
  }
}
```

**Responsibility**: Database operations, data persistence

### Benefits Demonstrated

1. **Testability**: Each layer tested independently
2. **Flexibility**: Can swap TypeORM for MongoDB
3. **Maintainability**: Business logic independent of framework
4. **Team Work**: Clear boundaries for team members

---

## Lazy Loading & Code Splitting

### Why Lazy Load?

**Problem**: Loading entire app on initial load

```
app.bundle.js (5MB)
├── auth code (500KB)
├── tasks code (1MB)
├── reports code (2MB)
├── admin code (1MB)
└── other features (500KB)
```

**Solution**: Load on-demand

```
Initial: app.bundle.js (1MB) - Just shell + auth
On Navigate: tasks-lazy.js (1MB) - Tasks feature
On Navigate: reports-lazy.js (2MB) - Reports feature
```

### Your Current Routing

**Location**: `task-manager-app/src/app/app-routing.module.ts`

```typescript
const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import("./pages/auth/auth.module").then((m) => m.AuthModule),
    // ✅ Lazy loaded! Auth module not in initial bundle
  },
  {
    path: "tasks",
    loadChildren: () => import("./pages/tasks/tasks.module").then((m) => m.TasksModule),
    canActivate: [AuthGuard], // Protected route
    // ✅ Lazy loaded! Tasks module loaded only when user navigates here
  },
  {
    path: "",
    redirectTo: "/tasks",
    pathMatch: "full",
  },
];
```

### Lazy Loading Benefits

**Measured Impact on Your App:**

```
Initial Bundle (before lazy loading): ~3.5MB
├── app code: 800KB
├── auth code: 500KB
├── tasks code: 1MB
├── ngrx: 400KB
└── angular: 800KB

Initial Bundle (with lazy loading): ~2MB
├── app shell: 800KB
├── shared code: 400KB
└── angular: 800KB

Tasks Bundle (loaded on navigation): ~1.5MB
├── tasks feature: 1MB
├── ngrx feature: 300KB
└── material dialogs: 200KB

Auth Bundle (loaded on /auth): ~500KB
```

**Result:**

- 43% faster initial load
- Better Core Web Vitals scores
- Improved user experience

### Preloading Strategies

**Default: No Preloading**

```typescript
RouterModule.forRoot(routes);
// Loads modules only when requested
```

**Preload All Modules**

```typescript
RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules,
});
// Loads all lazy modules in background after initial render
```

**Custom Preloading Strategy**

```typescript
export class CustomPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Only preload routes with data.preload = true
    return route.data?.["preload"] ? load() : of(null);
  }
}

const routes: Routes = [
  {
    path: "tasks",
    loadChildren: () => import("./pages/tasks/tasks.module").then((m) => m.TasksModule),
    data: { preload: true }, // ← Preload this one
  },
  {
    path: "reports",
    loadChildren: () => import("./pages/reports/reports.module").then((m) => m.ReportsModule),
    // No preload - wait for user to navigate
  },
];
```

### With Standalone Components

**Route-based lazy loading:**

```typescript
const routes: Routes = [
  {
    path: "tasks",
    loadComponent: () => import("./pages/tasks/tasks.component").then((m) => m.TasksComponent),
    // Loads single component + its dependencies
  },
];
```

**Benefits:**

- More granular code splitting
- Load individual components instead of entire modules
- Better tree-shaking

---

## Dependency Injection Patterns

### Injection Levels

Angular's DI has hierarchical scopes:

```
Root Injector (providedIn: 'root')
    │
    ├─── Platform Injector
    │       └── Shared across Angular apps (rare)
    │
    ├─── Module Injector (providers in module)
    │       └── Feature-scoped services
    │
    └─── Component Injector (providers in component)
            └── Component-scoped services
```

### Your Service Patterns

#### 1. Root-Level Services (Singleton)

**Location**: `task-manager-app/src/app/core/services/auth.service.ts`

```typescript
@Injectable({
  providedIn: "root", // ✅ Single instance across app
})
export class AuthService {
  // Shared authentication state
  // Lives for entire app lifetime
}
```

**When to use:**

- App-wide state
- Stateless utilities
- HTTP services

#### 2. Module-Level Services

**Location**: `task-manager-app/src/app/pages/tasks/tasks.module.ts`

```typescript
@NgModule({
  providers: [
    TasksTypeOrmService, // ← New instance per lazy-loaded module
  ],
})
export class TasksModule {}
```

**When to use:**

- Feature-specific services
- Services with module-specific config
- Isolate feature state

#### 3. Component-Level Services

```typescript
@Component({
  selector: "app-task-detail-dialog",
  providers: [FormBuilder], // ← New instance per dialog
})
export class TaskDetailDialogComponent {}
```

**When to use:**

- Component-specific state
- Fresh instance needed per component
- Dialog services, form services

---

## Common Interview Questions

### 1. **"Should I migrate my app from NgModules to Standalone?"**

**Answer:**

- **New apps**: Use standalone from the start
- **Existing apps**:
  - Small apps (<10 modules): Migration worth it
  - Large apps (>50 modules): Migrate incrementally or wait
  - Critical: Works with modules? Don't fix what isn't broken
- **Angular supports both** - no forced migration

### 2. **"How do you organize a 100+ component application?"**

**Answer:**

1. **Feature modules** by business domain
2. **Core module** for singletons
3. **Shared module** for reusables
4. **Lazy load** features
5. **Monorepo** with Nx for very large apps
6. **Clear naming conventions**:
   - `*.component.ts` - components
   - `*.service.ts` - services
   - `*.guard.ts` - guards
   - `*.interceptor.ts` - interceptors

### 3. **"Explain dependency injection benefits"**

**Answer:**

- **Testability**: Mock dependencies easily
- **Flexibility**: Swap implementations
- **Lifecycle**: Framework manages creation/destruction
- **Single Responsibility**: Services focus on one thing
- **Loose Coupling**: Components don't create dependencies

### 4. **"What's the difference between providedIn: 'root' vs module providers array?"**

**Answer:**

**providedIn: 'root'**:

```typescript
@Injectable({ providedIn: "root" })
export class MyService {}
```

- Tree-shakeable (removed if unused)
- Singleton (one instance)
- Available everywhere
- Modern approach

**Module providers**:

```typescript
@NgModule({ providers: [MyService] })
export class MyModule {}
```

- Not tree-shakeable (always in bundle)
- New instance per lazy-loaded module
- Scoped to module hierarchy
- Legacy but still valid

---

## Discussion Points

1. **When would you choose standalone over modules in a new enterprise project?**
   - Team size and skill level
   - Codebase size expectations
   - Migration path for future
   - Library dependencies support

2. **How do you balance feature isolation vs code reuse?**
   - Shared services risk coupling
   - Feature duplication wastes space
   - Use interfaces for contracts
   - Extract common patterns to shared

3. **What's your strategy for breaking up a monolithic component?**
   - Identify presentation vs logic
   - Extract presentational components
   - Move state up or to store
   - Use component composition
   - Consider smart/dumb pattern

4. **How does clean architecture benefit frontend development?**
   - Business logic independent of framework
   - Easier to test core logic
   - UI changes don't affect business rules
   - Team can work in parallel

---

## Anti-Patterns to Avoid

### 1. **Circular Module Dependencies**

```typescript
// ❌ BAD
// shared.module.ts imports feature.module.ts
// feature.module.ts imports shared.module.ts
// Result: Compilation error or runtime issues
```

**Solution**: Extract common code to lower-level shared module

### 2. **Importing Modules Multiple Times**

```typescript
// ❌ BAD: Importing module with providers multiple times
@NgModule({
  imports: [DataModule], // Has providers
})
export class FeatureAModule {}

@NgModule({
  imports: [DataModule], // ← Creates SECOND instance of services!
})
export class FeatureBModule {}
```

**Solution**: Use `providedIn: 'root'` or import only in AppModule

### 3. **Too Many Responsibilities in Single Module**

```typescript
// ❌ BAD: One huge module with everything
@NgModule({
  declarations: [
    /* 50 components */
  ],
  imports: [
    /* 20 modules */
  ],
})
export class TasksModule {}
```

**Solution**: Break into feature sub-modules or adopt standalone

### 4. **Lazy Loading Issues**

```typescript
// ❌ BAD: Importing lazy module eagerly
import { TasksModule } from "./pages/tasks/tasks.module";

@NgModule({
  imports: [TasksModule], // ← Not lazy anymore!
})
export class AppModule {}
```

**Solution**: Only use `loadChildren` in routes

---

**Next**: [Angular Forms & Validation Patterns →](./ANGULAR-FORMS-VALIDATION.md)
