import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DozvoljenaKnjiga } from '../model/dozvoljenaknjiga.model';
import { Korisnik } from '../model/korisnik.model';

@Injectable({ providedIn: 'root' })
export class KorisnikService {
  private apiUrl = 'http://localhost:8080/api/korisnik';

  constructor(private http: HttpClient) {
    
  }

  getKnjigeForKorisnik(): Observable<DozvoljenaKnjiga[]> {
 
    return this.http.get<DozvoljenaKnjiga[]>(this.apiUrl+"/knjige");
  }
  
  getEmails(): Observable<String[]> {

    return this.http.get<String[]>(this.apiUrl+"/emails");
  }

     getAllKorisnici(): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(this.apiUrl+"/all");
  }

  saveKorisnik(korisnik: Korisnik): Observable<Korisnik> {
    return this.http.post<Korisnik>(this.apiUrl+"/register/korisnik", korisnik);
  }

   disableKorisnik(korisnik: Korisnik): Observable<Korisnik> {
    return this.http.put<Korisnik>(this.apiUrl+"/disableKorisnik", korisnik);
  }


}