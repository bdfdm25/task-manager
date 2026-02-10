import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { IModelInterface } from '@app/shared/models/model.interface';

/**
 * FormHelper is a utility class for creating and managing reactive forms
 * with automatic validation setup based on a model interface.
 *
 * Components should extend this class and call super(model) in their constructor.
 */
export class FormHelper {
  public form: FormGroup = new FormGroup({});
  public errorMsg = '';
  public isSubmitting = false;

  /**
   * Constructs the FormHelper and initializes the form based on the provided model.
   * @param model - An instance of IModelInterface that provides form structure and validation rules
   */
  constructor(private readonly model: IModelInterface) {
    this.createForm(this.model);
  }

  /**
   * Creates a FormGroup based on properties and validation rules defined in the model.
   * Iterates through model properties to create FormControls and nested FormGroups if needed.
   * @param model - An instance of IModelInterface that defines the form structure
   */
  private createForm(model: IModelInterface): void {
    const validators: { [key: string]: ValidatorFn[] } =
      this.getFormValidators(model);
    const fieldsProperties = this.getFieldsProperties(model);

    const group: FormGroup = new FormGroup({});

    Object.entries(model).forEach(([key, value]) => {
      const fieldProperty = fieldsProperties[key];
      const control: FormControl = new FormControl(
        {
          value: fieldProperty?.value || '',
          disabled: fieldProperty?.disabled || false,
        },
        validators?.[key],
      );

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        !(value instanceof Date) &&
        Object.keys(value).some((innerKey) => isNaN(Number.parseInt(innerKey)))
      ) {
        const innerGroup: FormGroup = new FormGroup({});

        Object.keys(value).forEach((innerKey) => {
          const innerFieldProperty = fieldsProperties[innerKey];
          const innerControl: FormControl = new FormControl(
            {
              value: innerFieldProperty?.value || '',
              disabled: innerFieldProperty?.disabled || false,
            },
            validators?.[innerKey],
          );
          innerGroup.addControl(innerKey, innerControl);
        });

        group.addControl(key, innerGroup);
      } else {
        group.addControl(key, control);
      }
    });

    this.form = group;
  }

  /**
   * Marks all controls in the form as touched, triggering validation messages.
   * Recursively applies to nested FormGroups.
   * @param formGroup - The FormGroup to validate
   */
  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  /**
   * Toggles the enabled/disabled state of form controls based on provided exempt keys.
   * @param form - The FormGroup whose controls will be toggled
   * @param isDisabled - Boolean indicating whether to disable or enable controls
   * @param exemptKeys - Array of control names that should not be toggled
   */
  toggleFormFields(
    form: FormGroup,
    isDisabled: boolean,
    exemptKeys: string[] = [],
  ): void {
    Object.keys(form.controls).forEach((key) => {
      if (!exemptKeys.includes(key)) {
        const control = form.get(key);
        if (control instanceof FormControl) {
          isDisabled ? control.disable() : control.enable();
        } else if (control instanceof FormGroup) {
          this.toggleFormFields(control, isDisabled, exemptKeys);
        }
      }
    });
  }

  /**
   * Resets all form controls to their initial values, excluding specified exempt keys.
   * @param form - The FormGroup to reset
   * @param exemptKeys - Array of control names that should not be reset
   */
  resetAll(form: FormGroup, exemptKeys: string[] = []): void {
    Object.keys(form.controls).forEach((key) => {
      if (!exemptKeys.includes(key)) {
        const control = form.get(key);
        if (control instanceof FormControl) {
          switch (typeof control.value) {
            case 'boolean':
              control.setValue(false);
              break;
            case 'number':
              control.setValue(0);
              break;
            default:
              control.setValue('');
              break;
          }
        } else if (control instanceof FormGroup) {
          this.resetAll(control, exemptKeys);
        }
      }
    });
    this.form.reset(this.form.value);
  }

  /**
   * Marks all controls in the form as touched and dirty, triggering validation messages.
   * @param formGroup - The FormGroup to mark as touched and dirty
   */
  markAllControlsAsTouchedAndDirty(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof AbstractControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      }
    });
  }

  /**
   * Checks if a specific form control has errors and has been touched.
   * @param controlName - Name of the control to check
   * @returns True if control has errors and is touched
   */
  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Gets the error message for a specific control.
   * @param controlName - Name of the control
   * @returns Error message string or empty string if no errors
   */
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Invalid email format';
    if (errors['minlength'])
      return `Minimum length is ${errors['minlength'].requiredLength}`;
    if (errors['maxlength'])
      return `Maximum length is ${errors['maxlength'].requiredLength}`;
    if (errors['pattern']) return 'Invalid format';
    if (errors['futureDate']) return 'Date must be in the future';
    if (errors['invalidTaskCode'])
      return 'Invalid task code format (e.g., TASK-001)';
    if (errors['taskExists']) return 'Task with this code already exists';

    return 'Invalid value';
  }

  /**
   * Retrieves form validators defined in the model.
   * @param model - An instance of IModelInterface that defines form structure
   * @returns Object mapping field names to their validation functions
   */
  private getFormValidators(model: IModelInterface): {
    [key: string]: ValidatorFn[];
  } {
    try {
      return model.getValidationRules();
    } catch (err) {
      console.error(
        'Check if "' +
          model.constructor.name +
          '" class implements IModelInterface correctly',
      );
    }
    return {};
  }

  /**
   * Retrieves field properties defined in the model.
   * @param model - An instance of IModelInterface that defines form structure
   * @returns Object mapping field names to their properties (value and disabled state)
   */
  private getFieldsProperties(model: IModelInterface): {
    [key: string]: {
      value: string | number | boolean | Date | null;
      disabled: boolean;
    };
  } {
    try {
      return model.getFieldsProperties();
    } catch (err) {
      console.error(
        'Check if "' +
          model.constructor.name +
          '" class implements IModelInterface correctly',
      );
    }
    return {};
  }
}
