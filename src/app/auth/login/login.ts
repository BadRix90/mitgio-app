import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly hidePassword = signal(true);

  // Form
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;
    
    const result = await this.authService.login(email!, password!);
    
    if (result.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set(result.error || 'Anmeldung fehlgeschlagen');
    }
    
    this.isLoading.set(false);
  }

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    // TODO: Implement password reset
    console.log('Password reset functionality coming soon...');
  }
}