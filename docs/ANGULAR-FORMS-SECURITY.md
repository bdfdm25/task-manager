# Angular Forms, Validation & Security Study Guide

## Reactive Forms, Custom Validators, XSS Prevention, Authentication

> **Target Level**: Senior Frontend Engineer  
> **Focus**: Advanced Form Patterns & Security Best Practices  
> **Last Updated**: February 2026

---

## Table of Contents

1. [Reactive Forms Deep Dive](#reactive-forms-deep-dive)
2. [FormHelper Pattern Implementation](#formhelper-pattern-implementation)
3. [Custom Validators](#custom-validators)
4. [Async Validators](#async-validators)
5. [Security: XSS & CSRF Protection](#security-xss--csrf-protection)
6. [Authentication Patterns](#authentication-patterns)
7. [HTTP Interceptors](#http-interceptors)

---

## Reactive Forms Deep Dive

### Template-Driven vs Reactive Forms

| Aspect               | **Template-Driven**           | **Reactive**                         |
| -------------------- | ----------------------------- | ------------------------------------ |
| **Setup**            | In template with `ngModel`    | In component with `FormGroup`        |
| **Data Flow**        | Two-way binding `[(ngModel)]` | One-way via `[formGroup]` and events |
| **Validation**       | HTML5 + directives            | Validators in component              |
| **Testing**          | Harder (needs template)       | Easier (pure TypeScript)             |
| **Complex Logic**    | Difficult                     | Excellent                            |
| **Async Validators** | Limited support               | Full support                         |
| **Dynamic Forms**    | Challenging                   | Natural                              |
| **Best For**         | Simple forms                  | Everything else                      |

**For enterprise apps, always prefer Reactive Forms.**

---

### Your Reactive Forms Implementation

**Location**: `task-manager-app/src/app/pages/auth/signin/signin.component.ts`

```typescript
export class SigninComponent implements OnInit {
  public signinForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  onSignin(): void {
    if (this.signinForm.valid) {
      const { email, password } = this.signinForm.value;
      // Process login
    }
  }
}
```

**Template Binding**:

```html
<form [formGroup]="signinForm" (ngSubmit)="onSignin()">
  <input type="email" formControlName="email" />
  <input type="password" formControlName="password" />
  <button type="submit" [disabled]="signinForm.invalid">Sign In</button>
</form>
```

### Form Control States

Angular tracks multiple states for each form control:

```typescript
const control = this.signinForm.get("email");

// Validation States
control.valid; // true if all validators pass
control.invalid; // true if any validator fails
control.errors; // { required: true } or { email: true }

// User Interaction States
control.pristine; // true if user hasn't changed value
control.dirty; // true if user has changed value
control.touched; // true if user has focused and left field
control.untouched; // true if user hasn't focused field

// Change States
control.pending; // true if async validator running
```

**CSS Classes Applied Automatically:**

```css
.ng-valid        /* All validators pass */
.ng-invalid      /* Any validator fails */
.ng-pristine     /* Not modified */
.ng-dirty        /* Modified */
.ng-touched      /* Blurred */
.ng-untouched    /* Not blurred yet */
.ng-pending      /* Async validation in progress */
```

---

## FormHelper Pattern Implementation

### Problem Statement

Without FormHelper, forms have repetitive boilerplate:

```typescript
// ❌ Repetitive pattern across 10+ forms
export class TaskFormComponent {
  taskForm = this.fb.group({
    title: ["", [Validators.required, Validators.minLength(3)]],
    description: ["", Validators.required],
    status: ["open", Validators.required],
    priority: ["medium"],
    // ... 10 more fields
  });

  // Duplicate logic for every form
  getErrorMessage(field: string): string {
    // 30 lines of error handling logic
  }
}
```

**Repeated across:**

- Signin form
- Signup form
- Create task form
- Edit task form
- User profile form
- Settings form
- ... every form in app

---

### Solution: FormHelper + Model Pattern

**Your Implementation** introduces a clean abstraction:

```
Model (Business Logic)
   ↓
FormHelper (Form Creation)
   ↓
Component (UI Logic)
```

#### Step 1: Model Interface

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

**Purpose**: Contract that all form models must implement

#### Step 2: Task Form Model

**Location**: `task-manager-app/src/app/pages/tasks/models/task-form.model.ts`

```typescript
export class TaskFormModel implements IModelInterface {
  // Constructor accepts task to edit (or null for creation)
  constructor(
    task: ITask | null = null,
    private tasksService: TasksService,
  ) {
    if (task) {
      // Populate from existing task
      this.taskCode = task.taskCode || "";
      this.title = task.title;
      this.description = task.description;
      this.status = task.status || TaskStatus.OPEN;
      // ... all other fields
    }
  }

  // Model Properties
  public taskCode: string = "";
  public title: string = "";
  public description: string = "";
  public status: TaskStatus = TaskStatus.OPEN;
  public priority: TaskPriority | null = null;
  public category: TaskCategory | null = null;
  public assignedTo: string | null = null;
  public estimatedHours: number | null = null;
  public deadline: Date | null = null;
  public tags: string = "";
  public notifyOnCompletion: boolean = false;

  // Validation Rules
  getValidationRules(): { [key: string]: ValidatorFn[] } {
    return {
      taskCode: [CustomValidators.taskCodeFormat(), CustomValidators.taskCodeExists(this.tasksService)],
      title: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      description: [Validators.required],
      status: [Validators.required],
      priority: [],
      category: [],
      assignedTo: [Validators.email],
      estimatedHours: [Validators.min(0.5), Validators.max(1000)],
      deadline: [CustomValidators.dateNotInPast()],
      tags: [],
      notifyOnCompletion: [],
    };
  }

  // Initial Values & Disabled State
  getFieldsProperties() {
    return {
      taskCode: { value: this.taskCode, disabled: false },
      title: { value: this.title, disabled: false },
      description: { value: this.description, disabled: false },
      status: { value: this.status, disabled: false },
      priority: { value: this.priority, disabled: false },
      category: { value: this.category, disabled: false },
      assignedTo: { value: this.assignedTo, disabled: false },
      estimatedHours: { value: this.estimatedHours, disabled: false },
      deadline: { value: this.deadline, disabled: false },
      tags: { value: this.tags, disabled: false },
      notifyOnCompletion: { value: this.notifyOnCompletion, disabled: false },
    };
  }
}
```

**Benefits:**

1. ✅ Business logic separated from component
2. ✅ Reusable for create AND edit
3. ✅ Type-safe field definitions
4. ✅ Centralized validation rules
5. ✅ Testable independently

#### Step 3: FormHelper Utility

**Location**: `task-manager-app/src/app/shared/helpers/form.helper.ts`

```typescript
export class FormHelper {
  static createForm(formBuilder: FormBuilder, model: IModelInterface): FormGroup {
    const group: { [key: string]: any } = {};
    const validationRules = model.getValidationRules();
    const fieldsProperties = model.getFieldsProperties();

    // Build FormGroup dynamically
    for (const fieldName in validationRules) {
      const fieldProperty = fieldsProperties[fieldName];

      group[fieldName] = [
        {
          value: fieldProperty.value,
          disabled: fieldProperty.disabled,
        },
        {
          validators: validationRules[fieldName].filter((v): v is ValidatorFn => !(v as AsyncValidatorFn).validate),
          asyncValidators: validationRules[fieldName].filter(
            (v): v is AsyncValidatorFn => !!(v as AsyncValidatorFn).validate,
          ),
          updateOn: "blur", // Optimize performance
        },
      ];
    }

    return formBuilder.group(group);
  }
}
```

**Key Features:**

1. **Dynamic Form Creation**: Builds FormGroup from model
2. **Validator Separation**: Separates sync vs async validators
3. **Optimized Updates**: `updateOn: 'blur'` prevents excessive validation
4. **Type Safety**: TypeScript ensures correctness

#### Step 4: Component Usage

**Location**: `task-manager-app/src/app/pages/tasks/task-detail-dialog/task-detail-dialog.component.ts`

```typescript
export class TaskDetailDialogComponent implements OnInit {
  public taskForm!: FormGroup;
  private taskFormModel!: TaskFormModel;

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    @Inject(MAT_DIALOG_DATA) public data: { task: ITask | null },
  ) {}

  ngOnInit(): void {
    // Create model (pass existing task for edit, null for create)
    this.taskFormModel = new TaskFormModel(this.data.task, this.tasksService);

    // Generate form from model using helper
    this.taskForm = FormHelper.createForm(this.fb, this.taskFormModel);
  }

  onSave(): void {
    if (this.taskForm.valid) {
      const taskData: ITask = this.taskForm.value;
      // Save logic...
    }
  }
}
```

**Result**: Component code reduced from ~80 lines to ~20 lines!

---

### Comparison: Before vs After FormHelper

#### Before (Without Pattern)

```typescript
// ❌ 80+ lines of boilerplate per form
export class TaskDetailDialogComponent {
  taskForm = this.fb.group({
    taskCode: ["", [Validators.pattern(/^[A-Z]+-\d+$/), this.taskCodeValidator.bind(this)]],
    title: ["", [Validators.required, Validators.minLength(3)]],
    // ... 10 more fields with validators
  });

  private taskCodeValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    // 15 lines of async validation logic
  }

  getErrorMessage(field: string): string {
    const control = this.taskForm.get(field);
    if (control?.hasError("required")) return "Field is required";
    if (control?.hasError("email")) return "Invalid email";
    // ... 20 more error cases
  }
}
```

#### After (With Pattern)

```typescript
// ✅ 20 lines, clear separation of concerns
export class TaskDetailDialogComponent {
  public taskForm!: FormGroup;

  ngOnInit(): void {
    const model = new TaskFormModel(this.data.task, this.tasksService);
    this.taskForm = FormHelper.createForm(this.fb, model);
  }

  onSave(): void {
    if (this.taskForm.valid) {
      const task: ITask = this.taskForm.value;
      this.store.dispatch(TasksActions.createTask({ task }));
    }
  }
}
```

---

## Custom Validators

### Built-in Validators

Angular provides these out of the box:

```typescript
Validators.required; // Value must exist
Validators.requiredTrue; // Checkbox must be checked
Validators.email; // Valid email format
Validators.min(5); // Number >= 5
Validators.max(100); // Number <= 100
Validators.minLength(3); // String length >= 3
Validators.maxLength(50); // String length <= 50
Validators.pattern(/regex/); // Matches regex
```

**Location in your code**: `task-manager-app/src/app/pages/tasks/models/task-form.model.ts`

```typescript
getValidationRules() {
  return {
    title: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ],
    estimatedHours: [
      Validators.min(0.5),
      Validators.max(1000),
    ],
    assignedTo: [
      Validators.email,
    ],
  };
}
```

---

### Custom Synchronous Validators

#### 1. Task Code Format Validator

**Location**: `task-manager-app/src/app/shared/helpers/custom-validators.helper.ts`

```typescript
export class CustomValidators {
  // Factory function returns ValidatorFn
  static taskCodeFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty (required validator handles that)
      }

      const pattern = /^[A-Z]+-\d+$/;
      const valid = pattern.test(control.value);

      return valid ? null : { invalidTaskCode: { value: control.value } };
    };
  }
}
```

**Usage:**

```typescript
taskCode: [CustomValidators.taskCodeFormat()];
```

**Error Handling in Template:**

```html
<input formControlName="taskCode" />
<div *ngIf="taskForm.get('taskCode')?.hasError('invalidTaskCode')">Task code must be in format: ABC-123</div>
```

#### 2. Date Not in Past Validator

```typescript
export class CustomValidators {
  static dateNotInPast(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day

      return selectedDate < today ? { dateInPast: { selectedDate: control.value } } : null;
    };
  }
}
```

**Usage:**

```typescript
deadline: [CustomValidators.dateNotInPast()];
```

#### 3. Conditional Validator (Depends on Another Field)

```typescript
export class CustomValidators {
  // Email required only if notify checkbox is checked
  static conditionalEmailRequired(checkboxFieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;

      const checkbox = control.parent.get(checkboxFieldName);
      const emailField = control;

      if (checkbox?.value && !emailField.value) {
        return { conditionalRequired: true };
      }

      return null;
    };
  }
}
```

**Usage:**

```typescript
this.taskForm = this.fb.group({
  notifyOnCompletion: [false],
  assignedTo: ["", [CustomValidators.conditionalEmailRequired("notifyOnCompletion"), Validators.email]],
});

// Update validators when checkbox changes
this.taskForm.get("notifyOnCompletion")?.valueChanges.subscribe(() => {
  this.taskForm.get("assignedTo")?.updateValueAndValidity();
});
```

---

## Async Validators

### Problem: Backend Validation

Some validations require server-side checks:

- Username availability
- Email already registered
- **Task code uniqueness** (your case)

### Your Implementation

#### Backend Endpoint

**Location**: `task-manager-api/src/presentation/tasks/tasks.controller.ts`

```typescript
@Controller("tasks")
export class TasksController {
  @Get("check-code/:taskCode")
  async checkTaskCode(@Param("taskCode") taskCode: string, @GetUser() user: UserEntity): Promise<{ exists: boolean }> {
    const exists = await this.tasksService.checkTaskCodeExists(taskCode, user);
    return { exists };
  }
}
```

**Service Implementation**: `task-manager-api/src/presentation/tasks/tasks.service.ts`

```typescript
async checkTaskCodeExists(taskCode: string, user: UserEntity): Promise<boolean> {
  const count = await this.tasksTypeOrmService.checkTaskCodeExists(taskCode, user);
  return count > 0;
}
```

**Repository Query**: `task-manager-api/src/infra/db/typeorm/tasks/tasks-typeorm.service.ts`

```typescript
async checkTaskCodeExists(taskCode: string, user: UserEntity): Promise<number> {
  return await this.taskRepository.count({
    where: {
      taskCode,
      user: { id: user.id }, // Scoped to current user
    },
  });
}
```

#### Frontend Service

**Location**: `task-manager-app/src/app/pages/tasks/services/task.service.ts`

```typescript
export class TaskService {
  checkTaskCodeExists(taskCode: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${Routes.TASKS}/check-code/${taskCode}`).pipe(
      map((response) => response.exists),
      catchError(() => of(false)), // On error, assume not exists
    );
  }
}
```

#### Async Validator Implementation

**Location**: `task-manager-app/src/app/shared/helpers/custom-validators.helper.ts`

```typescript
export class CustomValidators {
  static taskCodeExists(tasksService: TasksService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null); // Don't validate empty
      }

      return timer(500).pipe(
        // 500ms debounce
        switchMap(() => tasksService.checkTaskCodeExists(control.value)),
        map((exists) => (exists ? { taskCodeExists: true } : null)),
        catchError(() => of(null)), // On error, pass validation
      );
    };
  }
}
```

**Key Features:**

1. **Debouncing**: `timer(500)` waits 500ms after user stops typing
   - Prevents API call on every keystroke
   - Reduces server load
   - Better UX (no flickering errors)

2. **switchMap**: Cancels previous request if new one arrives
   - User types "AB" → API call starts
   - User types "ABC" → Previous call cancelled, new call starts
   - Only latest call completes

3. **Error Handling**: `catchError(() => of(null))`
   - If API fails, don't block user
   - Fail open, not closed

4. **Null Check**: Don't validate empty values
   - `required` validator handles empty
   - Prevents unnecessary API calls

#### Usage in Model

**Location**: `task-manager-app/src/app/pages/tasks/models/task-form.model.ts`

```typescript
export class TaskFormModel implements IModelInterface {
  constructor(
    task: ITask | null = null,
    private tasksService: TasksService, // Inject service
  ) {}

  getValidationRules(): { [key: string]: ValidatorFn[] } {
    return {
      taskCode: [
        CustomValidators.taskCodeFormat(), // Sync validator (instant)
        CustomValidators.taskCodeExists(this.tasksService), // Async (debounced)
      ],
      // ...
    };
  }
}
```

#### Template Feedback

```html
<input formControlName="taskCode" placeholder="e.g., TASK-123" />

<!-- Show during async validation -->
<div *ngIf="taskForm.get('taskCode')?.pending" class="text-blue-500">Checking availability...</div>

<!-- Show if format invalid -->
<div *ngIf="taskForm.get('taskCode')?.hasError('invalidTaskCode')" class="text-red-500">
  Format must be: LETTERS-NUMBER (e.g., TASK-123)
</div>

<!-- Show if code exists -->
<div *ngIf="taskForm.get('taskCode')?.hasError('taskCodeExists')" class="text-red-500">
  This task code is already in use
</div>
```

---

### Async Validator Best Practices

#### ✅ DO:

```typescript
// Debounce user input
return timer(500).pipe(switchMap(() => apiCall));

// Cancel previous requests
switchMap(() => ...) // Not mergeMap or concatMap

// Handle errors gracefully
catchError(() => of(null))

// Check for empty values
if (!control.value) return of(null);

// Provide clear user feedback
*ngIf="control?.pending" → "Checking..."
```

#### ❌ DON'T:

```typescript
// No debounce - API called on every keystroke
return apiCall; // ← Bad!

// Using mergeMap - multiple requests in flight
mergeMap(() => apiCall); // ← Bad!

// Not handling errors - form stuck if API fails
// No catchError ← Bad!

// Validating empty values unnecessarily
// No null check ← Bad!

// No user feedback during validation
// User doesn't know what's happening ← Bad!
```

---

## Security: XSS & CSRF Protection

### Cross-Site Scripting (XSS)

**XSS Attack**: Injecting malicious JavaScript into your app

```typescript
// User input
const userInput = '<script>alert("hacked")</script>';

// ❌ DANGER: Direct HTML injection
element.innerHTML = userInput; // Script executes!

// ✅ SAFE: Angular sanitizes automatically
{
  {
    userInput;
  }
} // Displays as text, script doesn't execute
```

### Angular's Built-in XSS Protection

#### 1. **Template Interpolation** (Always Safe)

```html
<!-- ✅ Angular escapes HTML automatically -->
<div>{{ userTask.title }}</div>
<!-- If title is "<script>alert(1)</script>"
     Displays: &lt;script&gt;alert(1)&lt;/script&gt; -->
```

#### 2. **Property Binding** (Safe)

```html
<!-- ✅ Angular sanitizes dangerous properties -->
<div [innerHTML]="userTask.description"></div>
<!-- Angular's DomSanitizer removes <script> tags -->
```

#### 3. **Dangerous APIs** (Manual Sanitization Required)

```typescript
// ❌ DANGER: Bypassing Angular's safety
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

trustUserInput(html: string): SafeHtml {
  // Only use if you trust the source!
  return this.sanitizer.bypassSecurityTrustHtml(html);
}
```

### Your XSS Protection

**Location**: All your form inputs are safe by default

```html
<!-- task-detail-dialog.component.html -->
<input formControlName="title" />
<!-- User input is bound via FormControl, automatically escaped -->

<textarea formControlName="description"></textarea>
<!-- Even multiline text is safe -->
```

**Display in Template**:

```html
<!-- task-card.component.html -->
<h3>{{ task.title }}</h3>
<!-- Even if user enters <script>, it displays as text -->

<p>{{ task.description }}</p>
<!-- Angular prevents XSS automatically -->
```

---

### Cross-Site Request Forgery (CSRF)

**CSRF Attack**: Tricking user's browser into making unwanted requests

```html
<!-- Malicious site -->
<img src="https://yourbank.com/transfer?to=attacker&amount=1000" />
<!-- If user is logged into yourbank.com, this executes! -->
```

### Angular's CSRF Protection

Angular's `HttpClient` has built-in CSRF protection:

**How it works:**

1. Server sets CSRF token in cookie: `XSRF-TOKEN=abc123`
2. Angular reads cookie automatically
3. Angular adds header to requests: `X-XSRF-TOKEN: abc123`
4. Server validates token matches

**Your Implementation**:

**Location**: `task-manager-app/src/app/core/services/task.service.ts`

```typescript
// ✅ HttpClient adds CSRF token automatically
this.http.post<ITask>(Routes.TASKS, taskData);
// Request headers:
//   X-XSRF-TOKEN: abc123 ← Added automatically
```

**Backend Validation** (NestJS):

```typescript
// task-manager-api/src/main.ts
app.use(csrf()); // Enable CSRF protection middleware
```

**No additional code needed!** Angular + NestJS handle it automatically.

---

## Authentication Patterns

### JWT Token Authentication Flow

Your app uses JWT (JSON Web Tokens) for stateless authentication:

```
1. User signs in
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Client stores token (localStorage/cookie)
   ↓
5. Client sends token with every request
   ↓
6. Server validates token
   ↓
7. Request processed if valid
```

### Your Authentication Implementation

#### 1. Auth Service (Frontend)

**Location**: `task-manager-app/src/app/core/services/auth.service.ts`

```typescript
@Injectable({ providedIn: "root" })
export class AuthService {
  signin(credentials: ISignin): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>("/auth/signin", credentials).pipe(
      tap((response) => {
        this.storeToken(response.token); // Save JWT
        this.storeUser(response.user); // Save user info
      }),
    );
  }

  private storeToken(token: string): void {
    localStorage.setItem("access_token", token);
  }

  getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > expiry;
  }
}
```

#### 2. JWT Strategy (Backend)

**Location**: `task-manager-api/src/presentation/auth/jwt.strategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IJwtPayload): Promise<UserEntity> {
    const { email } = payload;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user; // Attached to request as req.user
  }
}
```

#### 3. GetUser Decorator (Backend)

**Location**: `task-manager-api/src/shared/decorators/get-user.decorator.ts`

```typescript
export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserEntity => {
  const request = ctx.switchToHttp().getRequest();
  return request.user; // User from JWT validation
});
```

**Usage in Controller**:

```typescript
@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  @Get()
  getTasks(@GetUser() user: UserEntity): Promise<TaskEntity[]> {
    return this.tasksService.findAll(user);
    // User automatically extracted from JWT token
  }
}
```

---

### Auth Guard (Frontend)

**Location**: `task-manager-app/src/app/core/guards/auth.guard.ts`

```typescript
@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // Allow access
    }

    // Redirect to signin
    this.router.navigate(["/auth/signin"], {
      queryParams: { returnUrl: state.url }, // Remember where they tried to go
    });
    return false;
  }
}
```

**Usage in Routing**:

**Location**: `task-manager-app/src/app/app-routing.module.ts`

```typescript
const routes: Routes = [
  {
    path: "tasks",
    loadChildren: () => import("./pages/tasks/tasks.module").then((m) => m.TasksModule),
    canActivate: [AuthGuard], // ← Protected route
  },
];
```

---

### Token Storage: localStorage vs Cookies

| Storage             | **localStorage**          | **httpOnly Cookie**                      |
| ------------------- | ------------------------- | ---------------------------------------- |
| **XSS Protection**  | ❌ Accessible via JS      | ✅ Not accessible via JS                 |
| **CSRF Protection** | ✅ Not sent automatically | ❌ Sent automatically (needs CSRF token) |
| **Mobile Apps**     | ✅ Works everywhere       | ❌ Doesn't work in mobile                |
| **Ease of Use**     | ✅ Simple API             | ❌ More complex setup                    |
| **Your Choice**     | ✅ Used in your app       | -                                        |

**Your Implementation** uses localStorage:

```typescript
// Storing token
localStorage.setItem("access_token", token);

// Retrieving token
const token = localStorage.getItem("access_token");

// Removing token (logout)
localStorage.removeItem("access_token");
```

**Security Recommendation**:

- ✅ Fine for most apps
- ✅ Ensure HTTPS to prevent man-in-the-middle
- ⚠️ For high-security apps (banking), use httpOnly cookies

---

## HTTP Interceptors

### What are Interceptors?

Interceptors sit between your app and the server, modifying requests/responses:

```
Component → HTTP Request → **Interceptor** → Server
Component ← HTTP Response ← **Interceptor** ← Server
```

### Common Use Cases

1. **Add auth token to every request**
2. **Handle errors globally**
3. **Log requests for debugging**
4. **Transform responses**
5. **Show loading spinner**
6. **Retry failed requests**

---

### Auth Interceptor Implementation

**Location**: `task-manager-app/src/app/core/interceptors/auth.interceptor.ts`

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get token from service
    const token = this.authService.getToken();

    // Clone request and add Authorization header
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
```

**Result**: Every HTTP request automatically includes JWT token!

```typescript
// Before interceptor:
this.http.get("/tasks");
// Request headers: (none)

// After interceptor:
this.http.get("/tasks");
// Request headers: Authorization: Bearer eyJhbGc...
```

---

### Error Handling Interceptor

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle different error types
        if (error.status === 401) {
          // Unauthorized - redirect to login
          this.router.navigate(["/auth/signin"]);
        } else if (error.status === 403) {
          // Forbidden
          this.notificationService.error("Access denied");
        } else if (error.status === 500) {
          // Server error
          this.notificationService.error("Server error occurred");
        }

        return throwError(() => error);
      }),
    );
  }
}
```

---

### Transform Interceptor (Response Wrapper)

**Your Implementation**: `task-manager-api/src/shared/interceptors/transform.interceptor.ts`

Backend wraps all responses:

```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        data, // Actual response data here
      })),
    );
  }
}
```

**Result**:

```json
// Before:
{ "id": "123", "title": "Task" }

// After:
{
  "statusCode": 200,
  "data": { "id": "123", "title": "Task" }
}
```

**Frontend needs to unwrap**:

```typescript
this.http.get<{ statusCode: number; data: ITask[] }>("/tasks").pipe(
  map((response) => response.data), // Extract data property
);
```

---

### Registering Interceptors

**Location**: `task-manager-app/src/app/app.module.ts`

```typescript
@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Multiple interceptors can exist
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
```

**Execution Order**: Same order as registered

1. AuthInterceptor (adds token)
2. ErrorInterceptor (handles errors)

---

## Common Interview Questions

### 1. **"Explain the difference between template-driven and reactive forms"**

**Answer:**

- **Template-driven**: Logic in template, two-way binding, simpler but less powerful
- **Reactive**: Logic in component, explicit FormGroup/FormControl, better for complex validation
- **Use reactive** for enterprise apps - testable, scalable, type-safe

### 2. **"How do you validate a field against another field's value?"**

**Answer:**

```typescript
// Custom validator at form level
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get("password")?.value;
  const confirmPassword = group.get("confirmPassword")?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

// Apply to form group
this.signupForm = this.fb.group(
  {
    password: ["", Validators.required],
    confirmPassword: ["", Validators.required],
  },
  { validators: passwordMatchValidator },
);
```

### 3. **"How do async validators work? When would you use them?"**

**Answer:**

- Async validators return `Observable<ValidationErrors | null>`
- Used for server-side validation (username exists, email registered)
- Best practices:
  - Debounce input to reduce API calls
  - Use `switchMap` to cancel previous requests
  - Handle errors gracefully with `catchError`
  - Provide loading state feedback

### 4. **"Explain how Angular prevents XSS attacks"**

**Answer:**

- **Automatic escaping**: `{{ }}` interpolation escapes HTML
- **DomSanitizer**: Strips dangerous content from property bindings
- **Content Security Policy**: Restricts inline scripts
- **Trusted values**: Manual bypass only when you control the source
- Don't use `innerHTML` with user input without sanitization

### 5. **"What's the difference between localStorage and httpOnly cookies for JWT storage?"**

**Answer:**

**localStorage:**

- ✅ Easy to use, works everywhere (including mobile)
- ❌ Vulnerable to XSS (malicious JS can read it)

**httpOnly Cookie:**

- ✅ Not accessible via JS (XSS protected)
- ❌ Vulnerable to CSRF (needs additional protection)
- ❌ Doesn't work in mobile apps

**Best choice:** Depends on app security requirements and platform

### 6. **"How do HTTP interceptors work?"**

**Answer:**

- Interceptors sit between app and server
- Can modify requests before sending (add auth token)
- Can modify responses before reaching component (unwrap data)
- Can handle errors globally
- Multiple interceptors execute in registration order
- Use for cross-cutting concerns (auth, logging, caching)

---

## Discussion Points

1. **When would you choose template-driven over reactive forms?**
   - Extremely simple forms (1-2 fields)
   - Rapid prototyping
   - Team unfamiliar with reactive forms
   - Most cases: Still use reactive for consistency

2. **How do you balance client-side vs server-side validation?**
   - Client: UX, instant feedback, reduce server load
   - Server: Security (never trust client), business rules
   - **Always validate both**: Client for UX, server for security

3. **What's your approach to form error messages?**
   - Centralized error message service
   - Per-field error display
   - Show on blur or submit (not while typing)
   - Consistent messaging across app

4. **How do you handle JWT token refresh?**
   - Short-lived access token (15 min)
   - Long-lived refresh token (7 days)
   - Interceptor detects 401, calls refresh endpoint
   - Retry original request with new token
   - Logout if refresh fails

---

## Anti-Patterns to Avoid

### 1. **Subscribing in Templates**

```html
<!-- ❌ BAD: Manual subscription management -->
<div *ngIf="(tasks$ | async) as tasks">{{ tasks.length }}</div>

<div>{{ (tasks$ | async)?.length }}</div>
<!-- Subscribes TWICE - two separate subscriptions! -->
```

**Solution**: Use `async` pipe once with `as`

### 2. **Not Unsubscribing from Form ValueChanges**

```typescript
// ❌ BAD: Memory leak
ngOnInit() {
  this.form.get('field')?.valueChanges.subscribe(value => {
    // Subscription never cleaned up
  });
}
```

**Solution**: Use `takeUntilDestroyed()` or store subscription

### 3. **Validating on Every Keystroke**

```typescript
// ❌ BAD: Expensive validation on every keypress
this.form = this.fb.group({
  email: ["", [Validators.email]], // Validates on every keystroke
});
```

**Solution**: Use `updateOn: 'blur'` or `updateOn: 'submit'`

### 4. **Storing Sensitive Data in localStorage**

```typescript
// ❌ BAD: Storing passwords or card numbers
localStorage.setItem('password', password'); // Visible in DevTools!
```

**Solution**: Never store passwords; encrypt sensitive data or use httpOnly cookies

### 5. **Not Handling Async Validator Errors**

```typescript
// ❌ BAD: No error handling
static checkUsername(api: ApiService): AsyncValidatorFn {
  return (control) => api.checkUsername(control.value);
  // If API fails, form stuck in pending state!
}
```

**Solution**: Always add `catchError(() => of(null))`

---

**Next**: [Angular Performance & Optimization →](./ANGULAR-PERFORMANCE.md)
