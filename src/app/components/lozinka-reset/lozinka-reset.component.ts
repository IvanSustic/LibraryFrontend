import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-lozinka-reset',
  standalone: false,
  templateUrl: './lozinka-reset.component.html',
  styleUrl: './lozinka-reset.component.css'
})
export class LozinkaResetComponent {
token= '';
  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: SnackBarService,
    private router: Router
  ) {}


lozinka: string = '';
lozinkaDva: string = '';

submit() {  
  this.authService.storeToken(this.token);
  this.token = this.route.snapshot.params['token'];
  this.authService.reset(this.token,this.lozinka).subscribe({
    next: () => {
      this.snackBar.poruka('Lozinka uspješno resetirana!');
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    , error: (err) => {
      this.snackBar.poruka(err.error);
    }
  });
}


}
