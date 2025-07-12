import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../../model/korisnik.model';
import { KorisnikService } from '../../services/korisnik.service';
import { AuthService } from '../../services/auth-service.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-korisnik',
  standalone: false,
  templateUrl: './korisnik.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class KorisnikComponent implements OnInit {
  filterIme: string = '';
  filterPrezime: string = '';
  filterEmail: string = '';
  filterIskljucen: string = 'svi';
  filteredKorisnici: Korisnik[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;

  korisnici: Korisnik[] = [];
  selectedKorisnik: Korisnik = this.getEmptyKorisnik();
  forDelete: string ="";
  lozinkaDva?: string = '';
  paginatedKorisnici: Korisnik[] = [];


  constructor(private korisnikService: KorisnikService,
    private snackBar: SnackBarService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
      this.loadKorisnici();
  }

getEmptyKorisnik(): Korisnik {
  return {
    idKorisnik: undefined,
    ime: '',
    prezime: '',
    email: '',
    lozinka: '',
  };
}

  loadKorisnici() {
    this.korisnikService.getAllKorisnici().subscribe(data =>{ 
      this.korisnici = data;
      this.applyFiltersAndPagination();
    });
  }


  edit(korisnik: Korisnik) {
    this.selectedKorisnik = { ...korisnik };
    this.lozinkaDva = undefined;
  }

  disable(korisnik: Korisnik) {
    this.selectedKorisnik = { ...korisnik };
    if (confirm('Sigurno želite isključiti korisnika?')) {
    this.korisnikService.disableKorisnik(this.selectedKorisnik)
                .subscribe({
                    next: (response) => {
                      this.snackBar.poruka('Korisnik uspješno onemogućen');
                      this.loadKorisnici();
                    },
                    error: (error) => {
                        this.snackBar.poruka(error.error);
                    }
        });
      }
  }

  cancel() {
    this.selectedKorisnik = this.getEmptyKorisnik();
    this.lozinkaDva = '';
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (form.valid) {
            this.korisnikService.saveKorisnik(this.selectedKorisnik)
                .subscribe({
                    next: (response) => {
                        this.snackBar.poruka('Korisnik uspješno spremljen');
                        this.cancel();
                        this.loadKorisnici();
                    },
                    error: (error) => {
                        console.error('Error updating zaposlenik:', error);
                        this.snackBar.poruka(error.error);
                    }
        });
    } 
}


 applyFiltersAndPagination() {
  let filtered = this.korisnici;
  console.log(filtered)
  filtered = this.korisnici.filter(k =>
    (!this.filterIme || k.ime.toLowerCase().includes(this.filterIme.toLowerCase())) &&
    (!this.filterPrezime || k.prezime.toLowerCase().includes(this.filterPrezime.toLowerCase())) &&
    (!this.filterEmail || k.email.toLowerCase().includes(this.filterEmail.toLowerCase())) &&
    (this.filterIskljucen === 'svi' ||
     (this.filterIskljucen === 'aktivni' && !k.iskljucen) ||
     (this.filterIskljucen === 'iskljuceni' && k.iskljucen))
  );

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedKorisnici = filtered.slice(startIndex, endIndex);
  this.totalPages= filtered.length>0 ? Math.ceil(filtered.length / this.pageSize) : 1;
  this.currentPage = Math.min(this.currentPage, this.totalPages)
}


nextPage() {
  this.currentPage++;
  this.applyFiltersAndPagination();
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.applyFiltersAndPagination();
  }
}

hasNextPage(): boolean {
  this.applyFiltersAndPagination();
  return this.currentPage < this.totalPages;
}

resetFilters() {
  this.filterIme = '';
  this.filterPrezime = '';
  this.filterEmail = '';
  this.filterIskljucen = 'svi';
  this.currentPage = 1;
  this.applyFiltersAndPagination();
}


}

