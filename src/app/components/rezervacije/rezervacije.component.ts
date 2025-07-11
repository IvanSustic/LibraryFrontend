import { Component } from '@angular/core';
import { Rezervacija } from '../../model/rezervacija.model';
import { RezervacijaService } from '../../services/rezervacija.service';
import { PosudbaService } from '../../services/posudba.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarService } from '../../services/snack-bar.service';
@Component({
  selector: 'app-rezervacije',
  standalone: false,
  templateUrl: './rezervacije.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class RezervacijeComponent {
rezervacije: Rezervacija[] = [];

  searchTerm = '';
  selectedKnjiznica = '';
  knjiznice: string[] = [];

  constructor(private rezervacijaService: RezervacijaService,private snackBar: SnackBarService) {
    }

  ngOnInit(): void {
  this.rezervacijaService.getRezervacijeForZaposlenik().subscribe(data => {
        this.rezervacije = data;
        this.knjiznice = [...new Set(this.rezervacije.map(k => k.nazivKnjiznice))];
     });
  }

    get filteredRezervacije(): Rezervacija[] {
      return this.rezervacije.filter(rezervacija => {
        const titleMatch = rezervacija.korisnikEmail.toLowerCase().includes(this.searchTerm.toLowerCase());
        const knjiznicaMatch = this.selectedKnjiznica ? rezervacija.nazivKnjiznice === this.selectedKnjiznica : true;

        return titleMatch && knjiznicaMatch;
      });
    }

  resetFilters(): void {
      this.searchTerm = '';
      this.selectedKnjiznica = '';
    }

  posudiKnjigu(rezervacija: Rezervacija): void {
      if (rezervacija.idRezervacija !== undefined) {
        this.rezervacijaService.posudiRezerviranuKnjigu(rezervacija).subscribe({
          next: (response) => {
          this.rezervacije = this.rezervacije.filter(r => r.idRezervacija !== rezervacija.idRezervacija);
          this.snackBar.poruka('Knjiga uspješno posuđena korisniku: ' + rezervacija.korisnikEmail);
          },
          
         error: (response) => {
          console.log('Greška prilikom posudbe knjige:', response);
            this.snackBar.poruka( response.error); 
          }

        });
      } else {
        this.snackBar.poruka('Greška: ID rezervacije nije definiran.');
      }
  }

 
  otkaziRezervaciju(rezervacija: Rezervacija): void {
      if (rezervacija.idRezervacija !== undefined) {
        this.rezervacijaService.otkaziRezervaciju(rezervacija.idRezervacija).subscribe({
          next: (response) => {
          this.rezervacije = this.rezervacije.filter(r => r.idRezervacija !== rezervacija.idRezervacija);
          this.snackBar.poruka('Otkazana rezervacija za: ' + rezervacija.korisnikEmail);
          },
          
         error: (response) => {
            this.snackBar.poruka( 'Greška prilikom otkazivanja rezervacije:'); 
          }

        });
      } else {
        this.snackBar.poruka('Greška: ID rezervacije nije definiran.');
      }
  }
}
