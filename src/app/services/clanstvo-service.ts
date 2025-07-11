import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DozvoljenaKnjiga } from '../model/dozvoljenaknjiga.model';
import { Clanstvo } from '../model/clanstvo.model';

@Injectable({ providedIn: 'root' })
export class ClanstvoService {
  private apiUrl = 'http://localhost:8080/api/clanstvo';

  constructor(private http: HttpClient) {
    
  }

  getClanstvaForKorisnik(): Observable<Clanstvo[]> {
 
    return this.http.get<Clanstvo[]>(this.apiUrl+"/forUser");
  }

  
  getClanstvaForZaposlenik(): Observable<Clanstvo[]> {
 
    return this.http.get<Clanstvo[]>(this.apiUrl+"/forZaposlenik");
  }

  dodajClanstvo(email: string, idKnjiznica: number): Observable<any> {
     const params = new HttpParams()
      .set('email', email)
      .set('idKnjiznica', idKnjiznica.toString());
    return this.http.post(this.apiUrl+"/dodaj", null, {  params });
  }
  
  dodajSvaClanstva(email: string): Observable<any> {
     const params = new HttpParams()
      .set('email', email);
    return this.http.post(this.apiUrl+"/dodajSva", null, {  params });
  }



}