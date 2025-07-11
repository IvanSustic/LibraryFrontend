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

    posudiKnjigu(posudba:  any): Observable<any> {
    return this.http.post(this.apiUrl+"/posudi", posudba);
  }

  vratiKnjigu(idRezervacija: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${idRezervacija}`);
  }

  ostecenaKnjiga(idRezervacija: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ostecena/${idRezervacija}`);
  }
 
}