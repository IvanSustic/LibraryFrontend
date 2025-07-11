import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Autor } from '../model/autor.model';
import { Zanr } from '../model/zanr.model';

@Injectable({ providedIn: 'root' })
export class ZanrService {
private apiUrl = 'http://localhost:8080/api/zanr';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Zanr[]> {
    return this.http.get<Zanr[]>(this.apiUrl+"/all");
  }

  getById(id: number): Observable<Zanr> {
    return this.http.get<Zanr>(`${this.apiUrl}/${id}`);
  }

  saveZanr(zanr: Zanr): Observable<Zanr> {
    return this.http.post<Zanr>(this.apiUrl+"/dodaj", zanr);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


}