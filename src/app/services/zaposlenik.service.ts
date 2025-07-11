import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DozvoljenaKnjiga } from '../model/dozvoljenaknjiga.model';
import { Zaposlenik } from '../model/zaposlenik.model';

@Injectable({ providedIn: 'root' })
export class ZaposlenikService {
  private apiUrl = 'http://localhost:8080/api/zaposlenici';

  constructor(private http: HttpClient) {
    
  }

  getKnjigeForZaposlenik(): Observable<DozvoljenaKnjiga[]> {
    return this.http.get<DozvoljenaKnjiga[]>(this.apiUrl+"/knjige");
  }

   getZaposleniciForKnjiznicar(): Observable<Zaposlenik[]> {
    return this.http.get<Zaposlenik[]>(this.apiUrl+"/zaposleniciForKnjiznicar");
  }

     getAllZaposlenici(): Observable<Zaposlenik[]> {
    return this.http.get<Zaposlenik[]>(this.apiUrl+"/all");
  }

  saveZaposlenik(zaposlenik: Zaposlenik): Observable<Zaposlenik> {
    return this.http.post<Zaposlenik>(this.apiUrl+"/register/zaposlenik", zaposlenik);
  }

   disableZaposlenik(zaposlenik: Zaposlenik): Observable<Zaposlenik> {
    return this.http.put<Zaposlenik>(this.apiUrl+"/disableZaposlenik", zaposlenik);
  }

}