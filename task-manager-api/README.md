# 🚀 Task Manager - Backend API

> **NestJS v10 REST API implementing Clean Architecture with TypeORM and PostgreSQL**

[![NestJS](https://img.shields.io/badge/NestJS-v10-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-Enabled-85EA2D?logo=swagger)](https://swagger.io/)
[![Jest](https://img.shields.io/badge/Tests-Jest-C21325?logo=jest)](https://jestjs.io/)

---

## 📋 Overview

This is the **backend API** of the Task Manager project, built with NestJS v10 and implementing clean architecture principles. It provides a RESTful API for user authentication and task management with JWT-based security, comprehensive validation, and Swagger documentation.

> **⚠️ Note**: These instructions are for running **only the backend** in development mode. For the complete stack (Frontend + Backend + Database), see the [root README](../README.md).

---

## ✨ Features

### 🔐 Authentication & Authorization

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **User Registration**: Email and password validation
- **Route Protection**: Guards for protected endpoints
- **User Context**: Automatic user extraction from JWT

### 📋 Task Management

- **Full CRUD**: Create, Read, Update, Delete operations
- **User Scoping**: Tasks isolated per user
- **Rich Task Model**: Support for priorities, categories, deadlines, etc.
- **Code Validation**: Unique task code validation
- **Soft Deletes**: Audit trail with timestamps

### 🏗️ Architecture

- **Clean Architecture**: Separation of concerns across layers
- **Use Case Pattern**: Business logic encapsulation
- **Repository Pattern**: Data access abstraction
- **DTO Validation**: Request/response validation with class-validator
- **Custom Decorators**: Reusable decorators (GetUser, Public)
- **Exception Filters**: Global error handling
- **Transform Interceptor**: Response normalization

### 📚 Documentation & Development

- **Swagger UI**: Interactive API documentation
- **TypeORM Integration**: Database migrations and entities
- **Schema Validation**: Environment variable validation
- **CORS Configuration**: Cross-origin support
- **Logging**: Structured logging for debugging

---

## 🛠️ Tech Stack

| Technology            | Version | Purpose                           |
| --------------------- | ------- | --------------------------------- |
| **NestJS**            | v10.3   | Backend framework                 |
| **TypeScript**        | v5.1    | Type-safe development             |
| **TypeORM**           | v0.3    | ORM for PostgreSQL                |
| **PostgreSQL**        | v16     | Relational database               |
| **Passport**          | v10     | Authentication middleware         |
| **JWT**               | v10     | JSON Web Tokens                   |
| **bcrypt**            | v5.1    | Password hashing                  |
| **Fastify**           | v4.26   | HTTP server (faster than Express) |
| **class-validator**   | v0.14   | DTO validation                    |
| **class-transformer** | v0.5    | Object transformation             |
| **Swagger**           | v7.3    | API documentation                 |
| **Jest**              | v29.7   | Testing framework                 |

---

## 📁 Project Structure

```
task-manager-api/
├── src/
│   ├── core/                        # Business Logic Layer
│   │   ├── base/                    # Base classes
│   │   │   ├── base.entity.ts
│   │   │   ├── base.service.ts
│   │   │   └── base.usecase.ts
│   │   │
│   │   ├── domain/                  # Domain layer
│   │   │   ├── entities/            # Domain entities
│   │   │   │   ├── auth/
│   │   │   │   │   └── user.entity.ts
│   │   │   │   └── tasks/
│   │   │   │       └── task.entity.ts
│   │   │   │
│   │   │   └── dtos/                # Data Transfer Objects
│   │   │       ├── auth/
│   │   │       │   ├── signup.dto.ts
│   │   │       │   └── signin.dto.ts
│   │   │       └── tasks/
│   │   │           ├── task.dto.ts
│   │   │           └── update-task.dto.ts
│   │   │
│   │   ├── use-cases/               # Application logic
│   │   │   ├── auth/
│   │   │   │   ├── signin.usecase.ts
│   │   │   │   ├── signup.usecase.ts
│   │   │   │   └── *.spec.ts        # Unit tests
│   │   │   └── tasks/
│   │   │       ├── create-task.usecase.ts
│   │   │       ├── update-task.usecase.ts
│   │   │       └── delete-task.usecase.ts
│   │   │
│   │   └── services/                # Service interfaces
│   │       ├── auth/
│   │       │   └── auth.service.ts
│   │       └── tasks/
│   │           └── tasks.service.ts
│   │
│   ├── infra/                       # Infrastructure Layer
│   │   └── db/
│   │       └── typeorm/             # Database implementation
│   │           ├── auth/
│   │           │   └── user-typeorm.service.ts
│   │           └── tasks/
│   │               └── tasks-typeorm.service.ts
│   │
│   ├── presentation/                # Presentation Layer
│   │   ├── auth/
│   │   │   ├── auth.controller.ts   # HTTP endpoints
│   │   │   ├── auth.service.ts      # Orchestration
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts      # JWT validation
│   │   │   └── dto/                 # API DTOs
│   │   │
│   │   └── tasks/
│   │       ├── tasks.controller.ts
│   │       ├── tasks.service.ts
│   │       ├── tasks.module.ts
│   │       └── dto/
│   │
│   ├── shared/                      # Shared utilities
│   │   ├── decorators/
│   │   │   └── get-user.decorator.ts  # Extract user from JWT
│   │   ├── enums/
│   │   │   ├── task-status.enum.ts
│   │   │   ├── task-priority.enum.ts
│   │   │   └── task-category.enum.ts
│   │   ├── exceptions/
│   │   │   └── custom.exception.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts  # Response wrapper
│   │   └── utils/
│   │       └── typeorm-errors.enum.ts
│   │
│   ├── app.module.ts                # Root module
│   └── main.ts                      # Bootstrap file
│
├── test/                            # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── config.schema.ts                 # Environment validation schema
├── nest-cli.json                    # NestJS CLI config
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies
├── Dockerfile                       # Docker image
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **[Node.js](https://nodejs.org/)** v20.0.0 or higher
- **[pnpm](https://pnpm.io/)** v8.0.0 or higher (or npm)
- **[PostgreSQL](https://www.postgresql.org/)** v16 or higher

### Installation

1. **Navigate to the API directory:**

   ```bash
   cd task-manager/task-manager-api
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # Server
   PORT=3333
   NODE_ENV=development

   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=task_manager

   # JWT
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

4. **Ensure PostgreSQL is running:**

   ```bash
   # Using Docker (recommended)
   docker run -d \
     --name task-manager-postgres \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=task_manager \
     -p 5432:5432 \
     postgres:16-alpine

   # Or use your local PostgreSQL installation
   ```

### Development Server

```bash
# Development mode with hot-reload
pnpm run start:dev

# Regular development mode
pnpm run start
```

- API will be available at **[http://localhost:3333/api](http://localhost:3333/api)**
- Swagger docs at **[http://localhost:3333/docs](http://localhost:3333/docs)**
- Hot-reload enabled for code changes

### Production Build

```bash
# Build for production
pnpm run build

# Run production build
pnpm run start:prod
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Generate coverage report
pnpm run test:cov
```

Coverage report will be generated in `coverage/` directory.

### E2E Tests

```bash
# Run end-to-end tests
pnpm run test:e2e
```

### Test Structure

```typescript
// Unit test example - signin.usecase.spec.ts
describe('SigninUseCase', () => {
  it('should return tokens when credentials are valid', async () => {
    // Test implementation
  });

  it('should throw error when credentials are invalid', async () => {
    // Test implementation
  });
});
```

---

## 📜 Available Scripts

| Script                | Description                        |
| --------------------- | ---------------------------------- |
| `pnpm run start`      | Start development server           |
| `pnpm run start:dev`  | Start with hot-reload (watch mode) |
| `pnpm run start:prod` | Start production build             |
| `pnpm run build`      | Build for production               |
| `pnpm test`           | Run unit tests                     |
| `pnpm run test:watch` | Run tests in watch mode            |
| `pnpm run test:cov`   | Generate coverage report           |
| `pnpm run test:e2e`   | Run end-to-end tests               |
| `pnpm run lint`       | Lint code with ESLint              |
| `pnpm run format`     | Format code with Prettier          |

---

## 📚 API Documentation

### Interactive Swagger UI

Once the server is running, visit **[http://localhost:3333/docs](http://localhost:3333/docs)** for interactive API documentation.

### Endpoints Overview

#### Authentication

```http
POST   /api/auth/signup          # Create new user account
POST   /api/auth/signin          # Sign in and get JWT token
```

**Example Request - Sign Up:**

```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecureP@ss123"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Tasks

```http
GET    /api/tasks                # List all user's tasks
POST   /api/tasks                # Create new task
GET    /api/tasks/:id            # Get task by ID
PATCH  /api/tasks/:id            # Update task
DELETE /api/tasks/:id            # Delete task
GET    /api/tasks/check-code/:taskCode  # Check task code availability
```

**Example Request - Create Task:**

```json
POST /api/tasks
Authorization: Bearer <jwt_token>
{
  "taskCode": "TASK-123",
  "title": "Implement user authentication",
  "description": "Add JWT authentication to the API",
  "status": "open",
  "priority": "high",
  "category": "development",
  "assignedTo": "developer@example.com",
  "estimatedHours": 8.5,
  "deadline": "2024-12-31T23:59:59.000Z",
  "tags": "backend,security,authentication",
  "notifyOnCompletion": true
}
```

**Response:**

```json
{
  "statusCode": 201,
  "data": {
    "id": "uuid",
    "taskCode": "TASK-123",
    "title": "Implement user authentication",
    "status": "open",
    "priority": "high",
    "category": "development",
    "createdAt": "2024-02-10T10:00:00.000Z",
    "updatedAt": "2024-02-10T10:00:00.000Z"
  }
}
```

---

## 🏗️ Architecture Layers

### 1. Presentation Layer

**Responsibility**: HTTP handling, routing, request/response

```typescript
// tasks.controller.ts
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  @Post()
  create(@Body() dto: TaskDto, @GetUser() user: UserEntity) {
    return this.tasksService.create(dto, user);
  }
}
```

### 2. Application Layer (Use Cases)

**Responsibility**: Business logic, orchestration

```typescript
// create-task.usecase.ts
export class CreateTaskUseCase {
  async execute(dto: TaskDto, user: UserEntity): Promise<TaskEntity> {
    // Validation
    // Business rules
    // Call repository
    return this.service.create(dto, user);
  }
}
```

### 3. Domain Layer

**Responsibility**: Entities, DTOs, business rules

```typescript
// task.entity.ts
@Entity('tasks')
export class TaskEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  taskCode: string;

  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;
}
```

### 4. Infrastructure Layer

**Responsibility**: Database operations, external services

```typescript
// tasks-typeorm.service.ts
@Injectable()
export class TasksTypeOrmService implements TasksBaseService {
  async create(dto: TaskDto, user: UserEntity): Promise<TaskEntity> {
    const task = this.repository.create({ ...dto, user });
    return await this.repository.save(task);
  }
}
```

---

## 🔐 Security Features

### JWT Authentication

```typescript
// jwt.strategy.ts - Validates JWT tokens
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: IJwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user; // Attached to request as req.user
  }
}
```

### Password Security

```typescript
// Password hashing with bcrypt
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Password comparison
const isValid = await bcrypt.compare(password, user.password);
```

### Route Protection

```typescript
// Protected routes require JWT
@Controller('tasks')
@UseGuards(AuthGuard()) // ← JWT required
export class TasksController {
  @Get()
  findAll(@GetUser() user: UserEntity) {
    // user automatically extracted from JWT
    return this.service.findAll(user);
  }
}
```

### Input Validation

```typescript
// DTOs with class-validator
export class TaskDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]+-\d+$/, {
    message: 'Task code must be in format: ABC-123',
  })
  taskCode?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsEmail()
  assignedTo?: string;
}
```

---

## 🔧 Configuration

### Environment Variables

Validated using Joi schema in `config.schema.ts`:

```typescript
export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3333),
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
});
```

### Database Configuration

```typescript
// TypeORM config in app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserEntity, TaskEntity],
  synchronize: true, // ⚠️ Disable in production
  logging: process.env.NODE_ENV === 'development',
}),
```

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps

# View PostgreSQL logs
docker logs task-manager-postgres

# Test connection
psql -h localhost -U postgres -d task_manager
```

### Port Already in Use

```bash
# Find process using port 3333
sudo lsof -i :3333

# Kill process
sudo kill -9 <PID>

# Or use different port in .env
PORT=3334
```

### Module Installation Issues

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Or use npm
rm -rf node_modules package-lock.json
npm install
```

### TypeORM Synchronization Issues

```bash
# Drop and recreate database
docker exec -it task-manager-postgres psql -U postgres -c "DROP DATABASE task_manager;"
docker exec -it task-manager-postgres psql -U postgres -c "CREATE DATABASE task_manager;"

# Restart API to sync schema
pnpm run start:dev
```

---

## 📚 Learning Resources

### Official Documentation

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Fastify Documentation](https://www.fastify.io/)

### Related Documentation

- **[Root README](../README.md)** - Full stack setup
- **[Frontend README](../task-manager-app/README.md)** - Angular app
- **[Study Guides](../docs/README.md)** - Angular concepts
