import { Component, OnInit } from '@angular/core';
import { DozvoljenaKnjiga } from '../../model/dozvoljenaknjiga.model';
import { Rezervacija } from '../../model/rezervacija.model';
import { KorisnikService } from '../../services/korisnik.service';
import { RezervacijaService } from '../../services/rezervacija.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { ZaposlenikService } from '../../services/zaposlenik.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PosudbaService } from '../../services/posudba.service';

@Component({
  selector: 'app-posudbe-katalog',
  standalone: false,
  templateUrl: './posudbe-katalog.component.html',
  styleUrl: './posudbe-katalog.component.css'
})
export class PosudbeKatalogComponent implements OnInit {

  knjige: DozvoljenaKnjiga[] = [];
  posudbaForm!: FormGroup;

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
  emails: String[] = [];

  constructor(private korisnikService: KorisnikService, private zaposlenikService: ZaposlenikService,
    private posudbaService: PosudbaService,
    private snackBar: SnackBarService,  private fb: FormBuilder
  ) {
    }


    ngOnInit(): void {
          this.posudbaForm = this.fb.group({
      korisnik: ['', Validators.required],
    });
      this.zaposlenikService.getKnjigeForZaposlenik().subscribe(data =>{ 
        this.knjige = data;
        this.zanrovi = [...new Set(this.knjige.map(k => k.zanr))];
        this.tipoviKnjiga = [...new Set(this.knjige.map(k => k.tipKnjige))];
        const allAutori = this.knjige.flatMap(k => k.autori.map(a => `${a.ime} ${a.prezime}`));
        this.autoriList = [...new Set(allAutori)];
        this.knjiznice = [...new Set(this.knjige.map(k => k.nazivKnjiznice))];
        this.selectedKnjiznica = this.knjiznice.length > 0 ? this.knjiznice[0] : '';
      });
      this.korisnikService.getEmails().subscribe(korisnici => {
      this.emails = korisnici;
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

  
    
  onSubmit(knjiga: DozvoljenaKnjiga){
    if (this.posudbaForm.valid) {

      this.posudbaService.posudiKnjigu(
        {korisnikEmail: this.posudbaForm.value.korisnik,idKnjiga: knjiga.idKnjiga,idKnjiznica: knjiga.idKnjiznica}
      ).subscribe({
        next: (response) => {
          knjiga.kolicina -= 1;
          this.snackBar.poruka('Knjiga uspješno posuđena korisniku: ' + this.posudbaForm.value.korisnik);
          this.posudbaForm.reset();
          },
          
         error: (response) => {
          console.log('Greška prilikom posudbe knjige:', response);
            this.snackBar.poruka( response.error); 
          }

      });
    }
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