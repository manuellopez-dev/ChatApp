import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form:     FormGroup;
  loading   = false;
  avatars   = ['😊','😎','🤖','👾','🦊','🐱','🦁','🐸','🎭','🚀','⚡','🔥'];
  selected  = '😊';

  constructor(
    private fb:       FormBuilder,
    private auth:     AuthService,
    private router:   Router,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      avatar:   ['😊'],
    });
  }

  selectAvatar(a: string): void {
    this.selected = a;
    this.form.patchValue({ avatar: a });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/chat']),
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Error al registrarse';
        this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
      }
    });
  }
}