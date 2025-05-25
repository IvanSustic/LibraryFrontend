import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class KnjigaService {
  private apiUrl = 'http://localhost:8080/api/knjige';

  constructor(private http: HttpClient) {
  }

  getKnjige(): Observable<Knjiga[]> {
    return this.http.get<Knjiga[]>(this.apiUrl+"/all");
  }

  getKnjigaById(id: number): Observable<Knjiga> {
    return this.http.get<Knjiga>(`${this.apiUrl}/${id}`);
  }


}