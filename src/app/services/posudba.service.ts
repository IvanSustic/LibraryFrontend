import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Rezervacija } from '../model/rezervacija.model';
import { Posudba } from '../model/posudba.model';

@Injectable({ providedIn: 'root' })
export class PosudbaService {
  private apiUrl = 'http://localhost:8080/api/posudba';

  constructor(private http: HttpClient) {
    
  }

  getPosudbaForKorisnik(): Observable<Posudba[]> {
 
    return this.http.get<Posudba[]>(this.apiUrl+"/forUser");
  }

  
  getPosudbaForZaposlenik(): Observable<Posudba[]> {
    return this.http.get<Posudba[]>(this.apiUrl+"/forZaposlenik");
  }

  
  otkaziRezervaciju(idRezervacija: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idRezervacija}`);
  }

 
}