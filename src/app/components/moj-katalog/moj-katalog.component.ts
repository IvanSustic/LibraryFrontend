import { Component, OnInit } from '@angular/core';
import { Knjiga } from '../../model/knjiga.model';
import { KnjigaService } from '../../services/knjiga-service.service';
import { DozvoljenaKnjiga } from '../../model/dozvoljenaknjiga.model';
import { KorisnikService } from '../../services/korisnik.service';
import { RezervacijaService } from '../../services/rezervacija.service';
import { Rezervacija } from '../../model/rezervacija.model';

@Component({
  selector: 'app-moj-katalog',
  standalone: false,
  templateUrl: './moj-katalog.component.html',
  styleUrl: './moj-katalog.component.css'
})
export class MojKatalogComponent implements OnInit {

  knjige: DozvoljenaKnjiga[] = [];


currentPage: number = 1;
itemsPerPage: number = 15;
rezervacije: Rezervacija[] = [];
rezervacijeSize: number = 0;
  searchTerm = '';
  selectedZanr = '';
  selectedTip = '';
  selectedAutor = '';
  selectedKnjiznica = '';

  autoriList: string[] = [];
  zanrovi: string[] = [];
  tipoviKnjiga: string[] = [];
  knjiznice: string[] = [];

  constructor(private korisnikService: KorisnikService, private rezervacijaService: RezervacijaService) {
    }


    ngOnInit(): void {
      this.korisnikService.getKnjigeForKorisnik().subscribe(data =>{ 
        this.knjige = data;
        this.zanrovi = [...new Set(this.knjige.map(k => k.zanr))];
        this.tipoviKnjiga = [...new Set(this.knjige.map(k => k.tipKnjige))];
        const allAutori = this.knjige.flatMap(k => k.autori.map(a => `${a.ime} ${a.prezime}`));
        this.autoriList = [...new Set(allAutori)];
        this.knjiznice = [...new Set(this.knjige.map(k => k.nazivKnjiznice))];
        this.selectedKnjiznica = this.knjiznice.length > 0 ? this.knjiznice[0] : '';
      });
     this.rezervacijaService.getRezervacijeForKorisnik().subscribe(data => {
        this.rezervacije = data;
        this.rezervacijeSize = this.rezervacije.length;
     });
    }
  
    get filteredKnjige(): DozvoljenaKnjiga[] {
      return this.knjige.filter(knjiga => {
        const titleMatch = knjiga.naslov.toLowerCase().includes(this.searchTerm.toLowerCase());
        const zanrMatch = this.selectedZanr ? knjiga.zanr === this.selectedZanr : true;
        const tipMatch = this.selectedTip ? knjiga.tipKnjige === this.selectedTip : true;
        const autorMatch = this.selectedAutor
          ? knjiga.autori.some(a => `${a.ime} ${a.prezime}` === this.selectedAutor)
          : true;
        const knjiznicaMatch = this.selectedKnjiznica ? knjiga.nazivKnjiznice === this.selectedKnjiznica : true;

        return titleMatch && zanrMatch && tipMatch && autorMatch && knjiznicaMatch;
      });
    }
  
    resetFilters(): void {
      this.searchTerm = '';
      this.selectedZanr = '';
      this.selectedTip = '';
      this.selectedAutor = '';
      this.currentPage = 1;
    }

  
    rezerviraj(knjiga: DozvoljenaKnjiga,): void {
      const novaRezervacija: any = {
        idKnjiga: knjiga.idKnjiga,
        idKnjiznica: knjiga.idKnjiznica
      };
      this.rezervacijaService.reserveKnjiga(novaRezervacija).subscribe({
        next: (response: Rezervacija) => {
          console.log('Rezervacija uspješna:', response); 
          this.rezervacije.push(response);
          this.rezervacijeSize = this.rezervacije.length;
          knjiga.kolicina -= 1;
          
        },
        error: (error: any) => {
          console.error('Greška prilikom rezervacije:', error);
        }
      });
    }


get totalPages(): number {
  return Math.ceil(this.filteredKnjige.length / this.itemsPerPage);
}

get paginatedKnjige(): DozvoljenaKnjiga[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredKnjige.slice(start, start + this.itemsPerPage);
}

changePage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

}
