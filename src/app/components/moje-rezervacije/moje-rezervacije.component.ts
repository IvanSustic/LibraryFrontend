import { Component, OnInit } from '@angular/core';
import { Rezervacija } from '../../model/rezervacija.model';
import { RezervacijaService } from '../../services/rezervacija.service';

@Component({
  selector: 'app-moje-rezervacije',
  standalone: false,
  templateUrl: './moje-rezervacije.component.html',
  styleUrl: './moje-rezervacije.component.css'
})
export class MojeRezervacijeComponent implements OnInit {

rezervacije: Rezervacija[] = [];


  constructor(private rezervacijaService: RezervacijaService) {
    }

  ngOnInit(): void {
  this.rezervacijaService.getRezervacijeForKorisnik().subscribe(data => {
        this.rezervacije = data;
     });
  }

  otkaziRezervaciju(rezervacija: Rezervacija): void {
    if (rezervacija.idRezervacija !== undefined) {
      this.rezervacijaService.otkaziRezervaciju(rezervacija.idRezervacija).subscribe(() => {
        this.rezervacije = this.rezervacije.filter(r => r.idRezervacija !== rezervacija.idRezervacija);
      });
    } else {
      console.error('Rezervacija nema idRezervacija!');
    }
  }


}
