import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-reset',
  standalone: false,
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent {
  constructor(private authService: AuthService,
    private snackBar: SnackBarService
  ) {}

email: string = '';
disable = false;
  submit() {
    this.snackBar.poruka('Slanje emaila za resetiranje lozinke...');
    this.disable = true;
    this.authService.requestReset(this.email).subscribe({
      next: () => {
        this.snackBar.poruka('Email za resetiranje lozinke je poslan!');
        this.disable = false;
      },
      error: (err) => {
        this.disable = false;
        this.snackBar.poruka('Neuspješno slanje!');
      }
    });
  }

}
