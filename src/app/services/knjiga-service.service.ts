import { Injectable } from '@angular/core';
import { Knjiga } from '../model/knjiga.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class KnjigaService {
  private apiUrl = 'http://localhost:8080/api/knjige';
  private picture: string = "";

  constructor(private http: HttpClient) {
  }

  getKnjige(): Observable<Knjiga[]> {
    return this.http.get<Knjiga[]>(this.apiUrl+"/all");
  }

  getKnjigaById(id: number): Observable<Knjiga> {
    return this.http.get<Knjiga>(`${this.apiUrl}/${id}`);
  }
 
  saveKnjiga(knjiga: Knjiga): Observable<Knjiga> {
    return this.http.post<Knjiga>(this.apiUrl+"/dodaj", knjiga);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


   uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post('http://localhost:8080/api/slika/upload', formData);
  }

     deleteImage(slika: String): Observable<any> {

    return this.http.delete('http://localhost:8080/api/slika/delete', {body: slika});
  }

}