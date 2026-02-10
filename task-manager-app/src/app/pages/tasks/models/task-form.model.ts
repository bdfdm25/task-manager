import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IModelInterface } from '@app/shared/models/model.interface';
import { TaskPriority } from '../enum/task-priority.enum';
import { TaskStatus } from '../enum/task-status.enum';

/**
 * TaskFormModel defines the structure and validation rules for the advanced task form.
 * Demonstrates custom validators, date validation, and format validation.
 */
export class TaskFormModel implements IModelInterface {
  constructor(
    public taskCode?: string,
    public title?: string,
    public description?: string,
    public status?: string,
    public priority?: string,
    public category?: string,
    public assignedTo?: string,
    public estimatedHours?: number,
    public deadline?: Date | null,
    public tags?: string,
    public notifyOnCompletion?: boolean,
  ) {}

  getValidationRules(): { [key: string]: ValidatorFn[] } {
    return {
      taskCode: [
        Validators.required,
        Validators.minLength(4),
        this.taskCodeFormatValidator(),
      ],
      title: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ],
      description: [Validators.maxLength(500)],
      status: [Validators.required],
      priority: [Validators.required],
      category: [Validators.required],
      assignedTo: [Validators.email],
      estimatedHours: [Validators.min(0.5), Validators.max(1000)],
      deadline: [this.futureDateValidator()],
      tags: [this.tagsFormatValidator()],
      notifyOnCompletion: [],
    };
  }

  getFieldsProperties(): {
    [key: string]: {
      value: string | number | boolean | Date | null;
      disabled: boolean;
    };
  } {
    return {
      taskCode: { value: '', disabled: false },
      title: { value: '', disabled: false },
      description: { value: '', disabled: false },
      status: { value: TaskStatus.OPEN, disabled: false },
      priority: { value: TaskPriority.MEDIUM, disabled: false },
      category: { value: '', disabled: false },
      assignedTo: { value: '', disabled: false },
      estimatedHours: { value: 0, disabled: false },
      deadline: { value: null, disabled: false },
      tags: { value: '', disabled: false },
      notifyOnCompletion: { value: false, disabled: false },
    };
  }

  /**
   * Custom validator: Ensures task code follows the pattern TASK-XXX or PROJECT-XXX
   * Format: PREFIX-NUMBER (e.g., TASK-001, PROJECT-123)
   */
  taskCodeFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Let 'required' validator handle empty values
      }

      // Pattern: Uppercase letters, hyphen, followed by numbers
      const pattern = /^[A-Z]+-\d+$/;
      const isValid = pattern.test(value);

      return !isValid ? { invalidTaskCode: { value: control.value } } : null;
    };
  }

  /**
   * Custom validator: Ensures deadline is in the future
   */
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Optional field
      }

      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selectedDate < today ? { futureDate: true } : null;
    };
  }

  /**
   * Custom validator: Ensures tags are comma-separated and properly formatted
   * Format: tag1, tag2, tag3 (no special characters except spaces)
   */
  tagsFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Optional field
      }

      // Pattern: Alphanumeric and spaces, separated by commas
      const pattern = /^[a-zA-Z0-9\s]+(,\s*[a-zA-Z0-9\s]+)*$/;
      const isValid = pattern.test(value.trim());

      return !isValid ? { invalidTagsFormat: { value: control.value } } : null;
    };
  }
}
