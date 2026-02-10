# 🎨 Task Manager - Frontend Application

> **Angular v17 application featuring advanced patterns for enterprise-grade task management**

[![Angular](https://img.shields.io/badge/Angular-v17.3.7-red?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Tests-Jest-C21325?logo=jest)](https://jestjs.io/)

---

## 📋 Overview

This is the **frontend application** of the Task Manager project, built with Angular v17 and implementing modern development patterns including NgRx state management, reactive forms with custom validators, clean architecture, and performance optimization techniques.

> **⚠️ Note**: These instructions are for running **only the frontend** in development mode. For the complete stack (Frontend + Backend + Database), see the [root README](../README.md).

---

## ✨ Features

### 🎯 Core Functionality

- **Kanban Board**: Drag-and-drop task cards across status columns
- **Task Management**: Full CRUD operations with real-time updates
- **Authentication**: Secure JWT-based sign in/sign up flow
- **Form Wizard**: Multi-step task creation with validation
- **Search & Filter**: Real-time task filtering by status, priority, category

### 🏗️ Architecture & Patterns

- **NgRx State Management**: Centralized state with actions, reducers, effects, selectors
- **FormHelper Pattern**: Reusable form abstraction with model-driven validation
- **Clean Architecture**: Core/Shared/Feature module organization
- **Custom Validators**: Sync and async validators with debouncing
- **HTTP Interceptors**: Automatic JWT token injection and error handling
- **Route Guards**: Protected routes with authentication checks
- **Smart/Dumb Components**: Clear separation of concerns

### 🚀 Performance

- **Lazy Loading**: Feature modules loaded on-demand
- **OnPush Ready**: Optimized change detection strategy
- **TrackBy Functions**: Efficient list rendering
- **Async Pipe**: Automatic subscription management
- **Memoized Selectors**: Cached state queries
- **Bundle Optimization**: Tree-shaking, AOT compilation

### 🎨 UI/UX

- **Responsive Design**: Mobile-first with adaptive layouts
- **TailwindCSS**: Utility-first styling with custom theme
- **Angular Material**: Dialog components and UI elements
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Animations**: Smooth transitions and feedback

---

## 🛠️ Tech Stack

| Technology           | Version | Purpose               |
| -------------------- | ------- | --------------------- |
| **Angular**          | v17.3.7 | Frontend framework    |
| **Angular CLI**      | v17.3.7 | Development tooling   |
| **TypeScript**       | v5.4    | Type-safe development |
| **@ngrx/store**      | v17     | State management      |
| **@ngrx/effects**    | v17     | Side effect handling  |
| **RxJS**             | v7.8    | Reactive programming  |
| **TailwindCSS**      | v3.4    | Utility-first CSS     |
| **Angular Material** | v17     | UI components         |
| **Jest**             | v29.7   | Unit testing          |
| **ESLint**           | v8      | Code linting          |

---

## 📁 Project Structure

```
task-manager-app/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services & guards
│   │   │   ├── guards/              # AuthGuard
│   │   │   ├── interceptors/        # HTTP interceptors
│   │   │   └── services/            # Global services
│   │   │
│   │   ├── shared/                  # Reusable across features
│   │   │   ├── components/          # Dumb components
│   │   │   │   ├── loading/
│   │   │   │   └── password-input/  # ControlValueAccessor example
│   │   │   ├── helpers/
│   │   │   │   ├── form.helper.ts   # FormHelper utility
│   │   │   │   └── custom-validators.helper.ts
│   │   │   ├── models/
│   │   │   │   └── model.interface.ts  # IModelInterface contract
│   │   │   └── enums/               # Shared enums
│   │   │
│   │   └── pages/                   # Feature modules
│   │       ├── auth/                # Authentication feature
│   │       │   ├── signin/
│   │       │   ├── signup/
│   │       │   ├── store/           # Auth state
│   │       │   └── auth.module.ts
│   │       │
│   │       └── tasks/               # Task management feature
│   │           ├── task-card/       # Presentation component
│   │           ├── task-detail-dialog/  # Form dialog
│   │           ├── tasks-header/    # Filters & controls
│   │           ├── store/           # Tasks state (NgRx)
│   │           │   ├── tasks.actions.ts
│   │           │   ├── tasks.reducer.ts
│   │           │   ├── tasks.effects.ts
│   │           │   └── tasks.selectors.ts
│   │           ├── models/          # Form models
│   │           │   └── task-form.model.ts
│   │           ├── services/
│   │           │   └── task.service.ts
│   │           └── tasks.module.ts
│   │
│   ├── assets/                      # Static assets
│   │   ├── fonts/
│   │   ├── img/
│   │   └── scss/                    # Global styles
│   │
│   ├── environments/                # Environment configs
│   │   ├── environment.ts           # Development
│   │   └── environment.prod.ts      # Production
│   │
│   ├── index.html                   # Entry HTML
│   ├── main.ts                      # Bootstrap file
│   └── styles.scss                  # Global styles
│
├── angular.json                     # Angular CLI config
├── tailwind.config.js              # TailwindCSS config
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **[Node.js](https://nodejs.org/)** v20.0.0 or higher
- **[npm](https://www.npmjs.com/)** v9.0.0 or higher
- **Backend API running** (see [API README](../task-manager-api/README.md))

### Installation

1. **Navigate to the app directory:**

   ```bash
   cd task-manager/task-manager-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Development Server

```bash
npm start
# or
npm run start
```

- Navigate to **[http://localhost:4200](http://localhost:4200)**
- The app will automatically reload when you change source files
- Hot Module Replacement (HMR) enabled

### Build for Production

```bash
npm run build
```

- Build artifacts will be stored in `dist/` directory
- Optimized with:
  - Minification
  - Tree-shaking
  - AOT compilation
  - Bundle optimization
  - Source maps removed

**Production build with stats:**

```bash
ng build --configuration production --stats-json
```

**Analyze bundle size:**

```bash
npx webpack-bundle-analyzer dist/task-manager-app/stats.json
```

---

## 🧪 Testing

### Unit Tests

**Run all tests:**

```bash
npm run test
# or
npm test
```

**Run tests in watch mode:**

```bash
npm run test:watch
```

**Generate coverage report:**

```bash
npm run test:coverage
```

Coverage report will be generated in `coverage/` directory.

**View coverage report:**

```bash
open coverage/lcov-report/index.html
```

### Test Structure

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── auth.service.ts
│   │       └── auth.service.spec.ts      # Unit test
│   └── pages/
│       └── tasks/
│           ├── tasks.component.ts
│           ├── tasks.component.spec.ts   # Component test
│           └── store/
│               ├── tasks.effects.spec.ts # Effect test
│               └── tasks.reducer.spec.ts # Reducer test
```

---

## 📜 Available Scripts

| Script                  | Description                                  |
| ----------------------- | -------------------------------------------- |
| `npm start`             | Start development server at `localhost:4200` |
| `npm run build`         | Build for production                         |
| `npm run build:dev`     | Build for development                        |
| `npm test`              | Run unit tests with Jest                     |
| `npm run test:watch`    | Run tests in watch mode                      |
| `npm run test:coverage` | Generate test coverage report                |
| `npm run lint`          | Lint code with ESLint                        |
| `npm run lint:fix`      | Fix linting issues automatically             |
| `npm run format`        | Format code with Prettier                    |

---

## 🔧 Configuration

### Environment Variables

**Development** (`src/environments/environment.ts`):

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:3333/api",
};
```

**Production** (`src/environments/environment.prod.ts`):

```typescript
export const environment = {
  production: true,
  apiUrl: "/api", // Relative path for production
};
```

### TailwindCSS Configuration

Custom theme configuration in `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#1976d2",
        accent: "#ff4081",
      },
    },
  },
  plugins: [],
};
```

### Angular Material Theming

Custom theme in `src/assets/scss/styles.scss`:

```scss
@use "@angular/material" as mat;

$custom-primary: mat.define-palette(mat.$indigo-palette);
$custom-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$custom-theme: mat.define-light-theme(
  (
    color: (
      primary: $custom-primary,
      accent: $custom-accent,
    ),
  )
);

@include mat.all-component-themes($custom-theme);
```

---

## 🎯 Key Architectural Patterns

### 1. NgRx State Management

**Action → Reducer → State → Selector → Component**

```typescript
// Dispatch action
this.store.dispatch(TasksActions.loadTasks());

// Select state
this.tasks$ = this.store.select(selectAllTasks);
```

### 2. FormHelper Pattern

**Model → FormHelper → FormGroup → Component**

```typescript
// Create model
const model = new TaskFormModel(task, taskService);

// Generate form
this.form = FormHelper.createForm(this.fb, model);
```

### 3. HTTP Interceptor Chain

**Request → AuthInterceptor → ErrorInterceptor → API**

```typescript
// Automatically adds JWT token
// Handles errors globally
// Transforms responses
```

### 4. Smart/Dumb Components

```typescript
// Smart (Container) - tasks.component.ts
// - Manages state
// - Dispatches actions
// - Passes data to dumb components

// Dumb (Presentation) - task-card.component.ts
// - Receives @Input()
// - Emits @Output()
// - No business logic
// - OnPush change detection ready
```

---

## 🚦 Code Quality

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Formatting

```bash
# Format code with Prettier
npm run format
```

### Pre-commit Hooks

Husky pre-commit hooks run:

- ESLint
- Prettier
- Tests for changed files

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 4200
sudo lsof -i :4200
sudo kill -9 <PID>

# Or use different port
ng serve --port 4201
```

### Node Module Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Cache Issues

```bash
# Clear Angular CLI cache
ng cache clean

# Clear npm cache
npm cache clean --force
```

### Build Failures

```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

---

## 📚 Learning Resources

### Study Guides

This project includes comprehensive Angular study guides:

- **[Master Index](../docs/README.md)** - Complete study guide overview
- **[Core Concepts](../docs/ANGULAR-CORE-CONCEPTS.md)** - RxJS, NgRx, Change Detection
- **[Architecture](../docs/ANGULAR-ARCHITECTURE.md)** - Clean Architecture, DI
- **[Forms & Security](../docs/ANGULAR-FORMS-SECURITY.md)** - Reactive Forms, Validators
- **[Performance](../docs/ANGULAR-PERFORMANCE.md)** - Optimization techniques
- **[Quick Reference](../docs/ANGULAR-QUICK-REFERENCE.md)** - Interview cheat sheet

### Official Documentation

- [Angular Documentation](https://angular.io/docs)
- [NgRx Documentation](https://ngrx.io/)
- [RxJS Documentation](https://rxjs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
