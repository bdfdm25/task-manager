import { ValidatorFn } from '@angular/forms';

/**
 * Interface that defines the contract for form models.
 * Used with FormHelper to create reactive forms with validation rules.
 */
export interface IModelInterface {
  id?: number | string;

  /**
   * Returns validation rules for each form field.
   * @returns Object mapping field names to arrays of validator functions
   */
  getValidationRules(): { [key: string]: ValidatorFn[] };

  /**
   * Returns initial properties for each form field.
   * @returns Object mapping field names to their initial value and disabled state
   */
  getFieldsProperties(): {
    [key: string]: {
      value: string | number | boolean | Date | null;
      disabled: boolean;
    };
  };
}
