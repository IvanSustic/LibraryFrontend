import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../services/snack-bar.service';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      lozinka: ['', Validators.required]
    });
    console.log(this.authService.getUserRole())
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    const loginData = this.loginForm.getRawValue();
  
    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.authService.storeToken(response.accessToken);
        this.authService.storeEmail(loginData.email);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.snackBar.poruka('Neuspješna prijava. Provjerite email i lozinku.');
      }
    });
    
  }


    loginZaposlenik(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    const loginData = this.loginForm.getRawValue();
  
    this.authService.loginZaposlenik(loginData).subscribe({
      next: (response) => {
        this.authService.storeToken(response.accessToken);
        this.authService.storeEmail(loginData.email);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.snackBar.poruka('Neuspješna prijava. Provjerite email i lozinku.');
      }
    });
    
  }
}
