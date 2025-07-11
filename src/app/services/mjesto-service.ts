import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Mjesto } from '../model/mjesto.model';


@Injectable({ providedIn: 'root' })
export class MjestoService {
private apiUrl = 'http://localhost:8080/api/mjesto';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mjesto[]> {
    return this.http.get<Mjesto[]>(this.apiUrl+"/all");
  }

  getById(id: number): Observable<Mjesto> {
    return this.http.get<Mjesto>(`${this.apiUrl}/${id}`);
  }

  saveMjesto(mjesto: Mjesto): Observable<Mjesto> {
    return this.http.post<Mjesto>(this.apiUrl+"/dodaj", mjesto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


}