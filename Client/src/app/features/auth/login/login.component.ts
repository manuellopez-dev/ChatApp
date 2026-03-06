import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form:    FormGroup;
  loading = false;

  constructor(
    private fb:      FormBuilder,
    private auth:    AuthService,
    private router:  Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/chat']),
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Error al iniciar sesión';
        this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
      }
    });
  }
}