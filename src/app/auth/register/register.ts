import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AuthService, OrgData, UserProfile } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly hidePassword = signal(true);
  readonly hidePasswordConfirm = signal(true);

  // Form
  registerForm = this.fb.group({
    // User Data
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfirm: ['', [Validators.required]],
    role: ['vorstand' as UserProfile['role'], [Validators.required]],

    // Organization Data
    orgName: ['', [Validators.required]],
    orgType: ['sportverein' as OrgData['type'], [Validators.required]],
    fiscalYearStartMonth: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    address: [''],
    foundedYear: [null]
  }, {
    validators: this.passwordMatchValidator
  });

  // Dropdown Options
  roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'vorstand', label: 'Vorstand' },
    { value: 'kassenwart', label: 'Kassenwart' }
  ];

  orgTypeOptions = [
    { value: 'sportverein', label: 'Sportverein' },
    { value: 'foerderverein', label: 'Förderverein' },
    { value: 'chor', label: 'Chor' },
    { value: 'kulturverein', label: 'Kulturverein' },
    { value: 'ngo', label: 'NGO/Initiative' },
    { value: 'sonstige', label: 'Sonstige' }
  ];

  monthOptions = [
    { value: 1, label: 'Januar' },
    { value: 2, label: 'Februar' },
    { value: 3, label: 'März' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Dezember' }
  ];

  // Password Match Validator
  passwordMatchValidator(control: any) {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
    
    if (password && passwordConfirm && password.value !== passwordConfirm.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formValue = this.registerForm.value;
    
    const userData = {
      email: formValue.email!,
      password: formValue.password!,
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      role: formValue.role!
    };

    const orgData = {
      name: formValue.orgName!,
      type: formValue.orgType!,
      fiscalYearStartMonth: formValue.fiscalYearStartMonth!,
      address: formValue.address || undefined,
      foundedYear: formValue.foundedYear || undefined
    };
    
    const result = await this.authService.register(userData, orgData);
    
    if (result.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set(result.error || 'Registrierung fehlgeschlagen');
    }
    
    this.isLoading.set(false);
  }

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }

  togglePasswordConfirmVisibility() {
    this.hidePasswordConfirm.set(!this.hidePasswordConfirm());
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}