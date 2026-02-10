import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordInputComponent } from './password-input.component';

describe('PasswordInputComponent', () => {
  let component: PasswordInputComponent;
  let fixture: ComponentFixture<PasswordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
  });

  it('should handle input changes', () => {
    const mockEvent = {
      target: { value: 'test-password' },
    } as unknown as Event;

    let capturedValue = '';
    component.registerOnChange((value) => {
      capturedValue = value;
    });

    component.onInput(mockEvent);

    expect(component.value).toBe('test-password');
    expect(capturedValue).toBe('test-password');
  });

  it('should call onTouched when blurred', () => {
    let touched = false;
    component.registerOnTouched(() => {
      touched = true;
    });

    component.onBlur();

    expect(touched).toBe(true);
  });
});
