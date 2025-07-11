import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-clanstva',
  standalone: false,
  templateUrl: './clanstva.component.html',
  styleUrl: './clanstva.component.css'
})
export class ClanstvaComponent implements OnInit {
constructor(private authService: AuthService) { }

ngOnInit(): void {
}
}
