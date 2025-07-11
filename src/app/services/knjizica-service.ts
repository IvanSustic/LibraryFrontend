import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Knjiznica } from '../model/knjiznica.model';
import { Raspolaganje } from '../model/raspolaganje.model';

@Injectable({
  providedIn: 'root'
})
export class KnjiznicaService {

  private apiUrl = 'http://localhost:8080/api/knjiznica';

  constructor(private http: HttpClient) {
    
  }

  getKnjiznice(): Observable<Knjiznica[]> {
    return this.http.get<Knjiznica[]>(this.apiUrl+"/all");
  }

  getKnjiznicaById(id: number): Observable<Knjiznica> {
    return this.http.get<Knjiznica>(`${this.apiUrl}/${id}`);
  }

    getForZaposlenik(): Observable<Knjiznica[]> {
    return this.http.get<Knjiznica[]>(`${this.apiUrl}/forZaposlenik`);
  }


  saveRaspolaganje(raspolaganje: Raspolaganje): Observable<Raspolaganje> {
    return this.http.post<Raspolaganje>(this.apiUrl+"/addRaspolaganje", raspolaganje);
  }

  updateRaspolaganje(raspolaganje: Raspolaganje): Observable<Raspolaganje> {
    return this.http.put<Raspolaganje>(this.apiUrl+"/updateRaspolaganje", raspolaganje);
  }

  deleteRaspolaganje(raspolaganje: Raspolaganje): Observable<void> {
    return this.http.delete<void>(this.apiUrl+"/deleteRaspolaganje",{body: raspolaganje});
  }

    saveKnjiznica(knjizica: Knjiznica): Observable<Knjiznica> {
      return this.http.post<Knjiznica>(this.apiUrl+"/dodaj", knjizica);
    }

  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


   uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post('http://localhost:8080/api/slika/uploadKnjiznica', formData);
  }

     deleteImage(slika: String): Observable<any> {

    return this.http.delete('http://localhost:8080/api/slika/deleteKnjiznica', {body: slika});
  }
}
