import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './loading/loading.component';
import { PasswordInputComponent } from './password-input/password-input.component';

@NgModule({
  declarations: [LoadingComponent, PasswordInputComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [LoadingComponent, PasswordInputComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
