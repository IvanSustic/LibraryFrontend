import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent  implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lozinka: ['', [Validators.required, Validators.minLength(6)]],
      lozinka2: ['', [Validators.required, Validators.minLength(6)]]
    },
    {validator: this.passwordMatch });
  }

 passwordMatch(form: FormGroup) {
        const password = form.get('lozinka')?.value;
        const confirmPassword = form.get('lozinka2')?.value;
        if (password !== confirmPassword) {
            return { passwordMismatch: true };
        }
        return null;
    }
  
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.signupForm.invalid) {
      return;
    }

    const korisnik = this.signupForm.getRawValue();

    this.authService.signup(korisnik).subscribe({
      next: () => {

        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.snackBar.poruka(error.error);
      }
    });
  }
}