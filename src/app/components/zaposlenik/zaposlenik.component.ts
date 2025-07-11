import { Component, OnInit } from '@angular/core';
import { Zaposlenik } from '../../model/zaposlenik.model';
import { Knjiznica } from '../../model/knjiznica.model';
import { ZaposlenikService } from '../../services/zaposlenik.service';
import { KnjiznicaService } from '../../services/knjizica-service';
import { SnackBarService } from '../../services/snack-bar.service';
import { RadnoMjesto } from '../../model/radno-mjesto.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-zaposlenik',
  standalone: false,
  templateUrl: './zaposlenik.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class ZaposlenikComponent implements OnInit {

  filterIme: string = '';
  filterPrezime: string = '';
  filterEmail: string = '';
  filterRadnoMjesto: number | null = null;
  filterKnjiznice: number | null = null;
  filterIskljucen: string = 'svi';
  paginatedZaposlenici: Zaposlenik[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;

  zaposlenici: Zaposlenik[] = [];
  knjizniceList: Knjiznica[] = [];
  selectedZaposlenik: Zaposlenik = this.getEmptyZaposlenik();
  forDelete: string ="";
  lozinkaDva?: string = '';
  isAdmin: boolean = false;
  nedostupneKnjiznice: Knjiznica[] = [];

radnaMjesta: RadnoMjesto[] =[{
    idRadnoMjesto: 1,
    naziv: 'Knjizničar',
  }]


  constructor(private zaposlenikService: ZaposlenikService,
    private knjiznicaService : KnjiznicaService,
    private snackBar: SnackBarService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });
    if (this.isAdmin) {
      this.loadZaposleniciAdmin();
          this.knjiznicaService.getKnjiznice().subscribe(data => {
      this.knjizniceList = data
            this.radnaMjesta =[{
    idRadnoMjesto: 1,
    naziv: 'Knjizničar',
  },{
    idRadnoMjesto: 2,
    naziv: 'Voditelj knjižnice',
  },{
    idRadnoMjesto: 3,
    naziv: 'Admin',
  }]
      
    });
    } else {
      this.loadZaposlenici();
          this.knjiznicaService.getForZaposlenik().subscribe(data => {
      this.knjizniceList = data;
this.radnaMjesta =[{
    idRadnoMjesto: 1,
    naziv: 'Knjizničar',
  }]
    });
    }

  }

getEmptyZaposlenik(): Zaposlenik {
  return {
    idZaposlenik: undefined,
    ime: '',
    prezime: '',
    email: '',
    lozinka: '',
    knjiznice: [],
    radnaMjesta: []
  };
}

  loadZaposlenici() {
    this.zaposlenikService.getZaposleniciForKnjiznicar().subscribe(data =>{ 
      this.zaposlenici = data;
      this.applyFiltersAndPagination();
    });
  }

  loadZaposleniciAdmin() {
    this.zaposlenikService.getAllZaposlenici().subscribe(data =>{ 
      this.zaposlenici = data;
      this.applyFiltersAndPagination();
    });
  }

  edit(zaposlenik: Zaposlenik) {
    this.selectedZaposlenik = { ...zaposlenik };
    console.log(this.knjizniceList);
    if (!this.isAdmin) {
    this.nedostupneKnjiznice = zaposlenik.knjiznice.filter(k => !this.knjizniceList.some(kl => kl.idKnjiznica === k.idKnjiznica));
    }

    console.log('Nedostupne knjižnice:', this.nedostupneKnjiznice);
    this.lozinkaDva = undefined;
  }

  disable(zaposlenik: Zaposlenik) {
    this.selectedZaposlenik = { ...zaposlenik };
    this.zaposlenikService.disableZaposlenik(this.selectedZaposlenik)
                .subscribe({
                    next: (response) => {
                        console.log('Zaposlenik disable-an:', response);
                    },
                    error: (error) => {
                        this.snackBar.poruka(error.error);
                    }
        });
  }

  cancel() {
    this.selectedZaposlenik = this.getEmptyZaposlenik();
    this.lozinkaDva = '';
  }

  getKnjiznicaNaziv(knjiznice: Knjiznica[]): string {
    return knjiznice.map(a => `${a.naziv}`).join(', ');
  }

  getRadnaMjestaNaziv(radnaMjesta: RadnoMjesto[]): string {
    return radnaMjesta.map(a => `${a.naziv}`).join(', ');
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (form.valid) {
      if (this.selectedZaposlenik.idZaposlenik && !this.isAdmin) {
        this.selectedZaposlenik.knjiznice.push(...this.nedostupneKnjiznice);
      }
            this.zaposlenikService.saveZaposlenik(this.selectedZaposlenik)
                .subscribe({
                    next: (response) => {
                        console.log('Zaposlenik updatean:', response);
                        this.cancel();
                        if (this.isAdmin) {
                        this.loadZaposleniciAdmin();
                        }
                        else {
                        this.loadZaposlenici();
                        }
                    },
                    error: (error) => {
                        console.error('Error updating zaposlenik:', error);
                        this.snackBar.poruka(error.error);
                    }
        });
    } 
}

compareById(item1: any, item2: any): boolean {
  console.log('compareById - Item1:', item1, 'Item2:', item2);

  if (item1 === item2) {
    return true;
  }
  if (!item1 || !item2) { 
    return false;
  }

  if (item1.idKnjiznica !== undefined && item2.idKnjiznica !== undefined) {
    return item1.idKnjiznica === item2.idKnjiznica;
  }
  if (item1.idRadnoMjesto !== undefined && item2.idRadnoMjesto !== undefined) {
    return item1.idRadnoMjesto === item2.idRadnoMjesto;
  }
  if (item1.id !== undefined && item2.id !== undefined) {
    return item1.id === item2.id;
  }
  return false;
}


 applyFiltersAndPagination() {
  let filtered = this.zaposlenici;

  filtered = this.zaposlenici.filter(z =>
    (!this.filterIme || z.ime.toLowerCase().includes(this.filterIme.toLowerCase())) &&
    (!this.filterPrezime || z.prezime.toLowerCase().includes(this.filterPrezime.toLowerCase())) &&
    (!this.filterEmail || z.email.toLowerCase().includes(this.filterEmail.toLowerCase())) &&
    (this.filterIskljucen === 'svi' ||
     (this.filterIskljucen === 'aktivni' && !z.iskljucen) ||
     (this.filterIskljucen === 'iskljuceni' && z.iskljucen)) && 
  (!this.filterKnjiznice || (Array.isArray(z.knjiznice) && z.knjiznice.some(a => a.idKnjiznica === this.filterKnjiznice))) &&
  (!this.filterRadnoMjesto || (Array.isArray(z.radnaMjesta) && z.radnaMjesta.some(a => a.idRadnoMjesto === this.filterRadnoMjesto))));

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedZaposlenici = filtered.slice(startIndex, endIndex);
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

