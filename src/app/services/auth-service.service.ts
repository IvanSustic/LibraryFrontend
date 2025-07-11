import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode'
import { BehaviorSubject, tap } from 'rxjs';
import { Korisnik } from '../model/korisnik.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private email = 'email';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private isUserSubject = new BehaviorSubject<boolean>(this.isUser());
  public isUser$ = this.isUserSubject.asObservable();
  private isKnjiznicarSubject = new BehaviorSubject<boolean>(this.isKnjiznicar());
  public isKnjiznicar$ = this.isKnjiznicarSubject.asObservable();
  private isVoditeljSubject = new BehaviorSubject<boolean>(this.isVoditelj());
  public isVoditelj$ = this.isVoditeljSubject.asObservable();
  private isAdminSubject = new BehaviorSubject<boolean>(this.isAdmin());
  public isAdmin$ = this.isAdminSubject.asObservable();


  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; lozinka: string }) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<{ accessToken: string}>('http://localhost:8080/auth/login/user', credentials, { headers, withCredentials: true });
  }

  loginZaposlenik(credentials: { email: string; lozinka: string }) {
        const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<{ accessToken: string}>('http://localhost:8080/auth/login/zaposlenik', credentials, { headers, withCredentials: true });
  }

  signup(data: { korisnik: Korisnik }) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<{ token: string }>('http://localhost:8080/auth/register/user', data, {headers});
  }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedInSubject.next(this.isLoggedIn());
    this.isUserSubject.next(this.isUser());
    this.isKnjiznicarSubject.next(this.isKnjiznicar());
    this.isVoditeljSubject.next(this.isVoditelj());
    this.isAdminSubject.next(this.isAdmin());
  }

  storeEmail(email: string): void {
    localStorage.setItem(this.email, email);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
    this.isLoggedInSubject.next(this.isLoggedIn());
    this.isUserSubject.next(this.isUser());
    this.isKnjiznicarSubject.next(this.isKnjiznicar());
    this.isVoditeljSubject.next(this.isVoditelj());
    this.isAdminSubject.next(this.isAdmin());
    return this.http.post('http://localhost:8080/auth/logout', {}, {
      withCredentials: true
    });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }

  getUserRole(): string | null {
    const payload = this.getUserPayload();
    return payload?.roles || null;
  }

  isUser(): boolean {
    return this.getUserRole()?.includes('ROLE_USER') || false;
  }

 isKnjiznicar(): boolean {
    return this.getUserRole()?.includes('Knjižničar') || false;
  }

   isVoditelj(): boolean {
    return this.getUserRole()?.includes('Voditelj knjižnice') || false;
  }

  isAdmin(): boolean {
    return this.getUserRole()?.includes('Admin') || false;
  }



  refreshToken() {
    if (this.isUser()) {
    return this.http.post<{ accessToken: string }>('http://localhost:8080/auth/refresh/user', {}, {withCredentials: true});
    } else{
      return this.http.post<{ accessToken: string }>('http://localhost:8080/auth/refresh/zaposlenik', {}, {withCredentials: true});
    }
  }

  requestReset(email: string) {
   return this.http.post('http://localhost:8080/auth/request-reset', { email });
  }

reset(token: string, newLozinka: string) {
  return this.http.post('http://localhost:8080/auth/reset-password', {
    token: token,
    newLozinka: newLozinka
  });
}


}
