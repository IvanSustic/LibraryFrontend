import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Rezervacija } from '../model/rezervacija.model';

@Injectable({ providedIn: 'root' })
export class RezervacijaService {
  private apiUrl = 'http://localhost:8080/api/rezervacije';

  constructor(private http: HttpClient) {
    
  }

  getRezervacijeForKorisnik(): Observable<Rezervacija[]> {
 
    return this.http.get<Rezervacija[]>(this.apiUrl+"/forUser");
  }

  reserveKnjiga(rezervacija:  any): Observable<any> {
    return this.http.post(this.apiUrl+"/rezerviraj", rezervacija);
  }

  otkaziRezervaciju(idRezervacija: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idRezervacija}`);
  }

}