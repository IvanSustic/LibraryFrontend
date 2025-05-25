import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DozvoljenaKnjiga } from '../model/dozvoljenaknjiga.model';

@Injectable({ providedIn: 'root' })
export class KorisnikService {
  private apiUrl = 'http://localhost:8080/api/korisnik';

  constructor(private http: HttpClient) {
    
  }

  getKnjigeForKorisnik(): Observable<DozvoljenaKnjiga[]> {
 
    return this.http.get<DozvoljenaKnjiga[]>(this.apiUrl+"/knjige");
  }


}