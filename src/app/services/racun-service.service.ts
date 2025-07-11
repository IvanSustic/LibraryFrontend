import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Knjiznica } from '../model/knjiznica.model';
import jsPDF from 'jspdf';
import { Racun } from '../model/racun.model';
@Injectable({
  providedIn: 'root'
})
export class RacunService {

  private apiUrl = 'http://localhost:8080/api/racun';

  constructor(private http: HttpClient) {
    
  }


  getAll(): Observable<Racun[]> {
    return this.http.get<Racun[]>(this.apiUrl+"/all");
  }

  
}
