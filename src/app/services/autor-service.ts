import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Autor } from '../model/autor.model';

@Injectable({ providedIn: 'root' })
export class AutorService {
private apiUrl = 'http://localhost:8080/api/autor';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.apiUrl+"/all");
  }

  getById(id: number): Observable<Autor> {
    return this.http.get<Autor>(`${this.apiUrl}/${id}`);
  }

  saveAutor(autor: Autor): Observable<Autor> {
    return this.http.post<Autor>(this.apiUrl+"/dodaj", autor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


}