import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Knjiznica } from '../model/knjiznica.model';

@Injectable({
  providedIn: 'root'
})
export class KnjzinicaService {

  private apiUrl = 'http://localhost:8080/api/knjiznica';

  constructor(private http: HttpClient) {
    
  }

  getKnjiznice(): Observable<Knjiznica[]> {
    return this.http.get<Knjiznica[]>(this.apiUrl+"/all");
  }

  getKnjiznicaById(id: number): Observable<Knjiznica> {
    return this.http.get<Knjiznica>(`${this.apiUrl}/${id}`);
  }

}
