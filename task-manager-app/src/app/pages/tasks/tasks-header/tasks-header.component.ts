import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { Pages } from '@app/shared/helpers/routes.helper';
import { TaskDetailDialogComponent } from '../task-detail-dialog/task-detail-dialog.component';
import { Store } from '@ngrx/store';
import { filterTasks, loadTasks } from '../store/tasks.actions';

@Component({
  selector: 'app-tasks-header',
  templateUrl: './tasks-header.component.html',
})
export class TasksHeaderComponent {
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    public dialog: MatDialog,
  ) {}

  @Input()
  username!: string;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  addTask() {
    this.closeMobileMenu();
    this.dialog.open(TaskDetailDialogComponent, {
      data: {
        task: null,
      },
    });
  }

  onSearchTask(event: Event) {
    const filter = (event.target as HTMLInputElement).value;
    filter
      ? this.store.dispatch(filterTasks({ filter }))
      : this.store.dispatch(loadTasks());
  }

  onLogout() {
    this.closeMobileMenu();
    this.authService.logout();
    this.router.navigate([Pages.LOGIN]);
  }
}
