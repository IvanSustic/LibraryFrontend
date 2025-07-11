import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Autor } from '../model/autor.model';
import { TipKnjige } from '../model/tip-knjige.model';

@Injectable({ providedIn: 'root' })
export class TipKnjigeService {
private apiUrl = 'http://localhost:8080/api/tipKnjige';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipKnjige[]> {
    return this.http.get<TipKnjige[]>(this.apiUrl+"/all");
  }

  getById(id: number): Observable<TipKnjige> {
    return this.http.get<TipKnjige>(`${this.apiUrl}/${id}`);
  }

  saveTip(autor: TipKnjige): Observable<TipKnjige> {
    return this.http.post<TipKnjige>(this.apiUrl+"/dodaj", autor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


}