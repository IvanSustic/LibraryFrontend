import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private authService: AuthService) { }

  isLoggedIn = false
  isUser = false
  isKnjiznicar = false
  isVoditelj = false
  isAdmin = false
  
  ngOnInit() {
      this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.authService.isUser$.subscribe(status => {
      this.isUser = status;
    });

    this.authService.isKnjiznicar$.subscribe(status => {
      this.isKnjiznicar = status;
    });

    this.authService.isVoditelj$.subscribe(status => {
      this.isVoditelj = status;
    });

    this.authService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });
  }

  logout(){
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
        this.isLoggedIn = false;
        this.isUser = false;
        this.isKnjiznicar = false;
        this.isVoditelj = false;
        this.isAdmin = false;
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });
  }

}
