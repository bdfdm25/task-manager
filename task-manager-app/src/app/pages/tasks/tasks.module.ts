import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@app/core/core.module';
import { ComponentsModule } from '@app/shared/components/components.module';
import { StoreModule } from '@ngrx/store';
import { TaskService } from './services/task.service';
import { tasksReducer } from './store/tasks.reducer';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskDetailDialogComponent } from './task-detail-dialog/task-detail-dialog.component';
import { TasksHeaderComponent } from './tasks-header/tasks-header.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { EffectsModule } from '@ngrx/effects';
import { TasksEffects } from './store/tasks.effect';
import { TaskDeleteDialogComponent } from './task-delete-dialog/task-delete-dialog.component';

@NgModule({
  declarations: [
    TasksComponent,
    TaskCardComponent,
    TasksHeaderComponent,
    TaskDetailDialogComponent,
    TaskDeleteDialogComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TasksRoutingModule,
    StoreModule.forFeature('tasks', tasksReducer),
    EffectsModule.forFeature([TasksEffects]),
  ],
  providers: [TaskService],
})
export class TasksModule {}
