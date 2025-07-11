import { Component, OnInit } from '@angular/core';
import { Raspolaganje } from '../../model/raspolaganje.model';
import { DozvoljenaKnjiga } from '../../model/dozvoljenaknjiga.model';
import { Knjiga } from '../../model/knjiga.model';
import { Knjiznica } from '../../model/knjiznica.model';
import { KnjigaService } from '../../services/knjiga-service.service';
import { TipKnjigeService } from '../../services/tip-knjige-service';
import { ZanrService } from '../../services/zanr-service';
import { AutorService } from '../../services/autor-service';
import { ZaposlenikService } from '../../services/zaposlenik.service';
import { KnjiznicaService } from '../../services/knjizica-service';
import { NgForm } from '@angular/forms';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-raspolozive',
  standalone: false,
  templateUrl: './raspolozive.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class RaspoloziveComponent implements OnInit {

  filterNaslov: string = '';
  filterNaziv: string = '';
  filterKolicinaMin: number | null = null;
  filterKolicinaMax: number | null = null;
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  paginatedRaspolaganja: DozvoljenaKnjiga[] = [];

  selectedRaspolaganje: Raspolaganje = this.getEmptyRaspolaganje();
  raspolaganja: DozvoljenaKnjiga[] = [];
  knjigaList: Knjiga[] = [];
  knjiznicaList: Knjiznica[] = [];
  today: Date = new Date();
  isEditing: boolean =false;


  constructor(private knjigaService: KnjigaService,
  private zaposlenikService: ZaposlenikService,
  private knjiznicaService: KnjiznicaService,
  private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loadKnjiga();
    this.knjigaService.getKnjige().subscribe(data => {
      this.knjigaList = data
    });
    this.knjiznicaService.getForZaposlenik().subscribe(data => {
      this.knjiznicaList = data;
    });
  }

getEmptyRaspolaganje(): Raspolaganje {
  return {
    idKnjiga: undefined,
    idKnjiznica: undefined,
    kolicina: 0
  };
}

  loadKnjiga() {
    this.zaposlenikService.getKnjigeForZaposlenik().subscribe(data =>{ 
      this.raspolaganja = data;
      this.applyFiltersAndPagination();
    });
  }

  edit(knjiga: DozvoljenaKnjiga) {
    this.selectedRaspolaganje = { idKnjiga: knjiga.idKnjiga, idKnjiznica: knjiga.idKnjiznica, kolicina: knjiga.kolicina };
    this.isEditing = true;
  }


  delete(knjiga: DozvoljenaKnjiga) {
    if (confirm('Želite li sigurno obrisati ovo raspolaganje?')) {
      if (!knjiga || !knjiga.idKnjiga || !knjiga.idKnjiznica) {
        console.error('Invalid knjiga object:', knjiga);
        return;
      }
      this.selectedRaspolaganje = { idKnjiga: knjiga.idKnjiga, idKnjiznica: knjiga.idKnjiznica, kolicina: knjiga.kolicina };
      this.knjiznicaService.deleteRaspolaganje(this.selectedRaspolaganje).subscribe({
                    next: (response) => {
                        this.cancel();
                        this.loadKnjiga();
                    },
                    error: (error) => {
                        console.error('Error deleting knjiga:', error);
                        this.cancel();
                        this.snackBar.poruka(error.error);
                    }
        });
    }
  }

  cancel() {
    this.selectedRaspolaganje = this.getEmptyRaspolaganje();
    this.isEditing = false;
  }


  async onSubmit(form: NgForm): Promise<void> {
    if (form.valid) {
      if(this.isEditing){
      this.knjiznicaService.updateRaspolaganje(this.selectedRaspolaganje)
                .subscribe({
                    next: (response) => {
                        console.log('Raspolaganje spremljeno:', response);
                        this.cancel();
                        this.loadKnjiga();
                    },
                    error: (error) => {
                        console.error('Error updating knjiga:', error);
                        this.snackBar.poruka(error.error);
                    }
        });
      } else{
      this.knjiznicaService.saveRaspolaganje(this.selectedRaspolaganje)
                .subscribe({
                    next: (response) => {
                        console.log('Raspolaganje spremljeno:', response);
                        this.cancel();
                        this.loadKnjiga();
                    },
                    error: (error) => {
                        console.error('Error updating knjiga:', error);
                        this.cancel();
                        this.snackBar.poruka(error.error);
                    }
        });
      }
        
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

  if (item1.idKnjiga !== undefined && item2.idKnjiga !== undefined) {
    return item1.idKnjiga === item2.idKnjiga;
  }
  if (item1.idKnjiznica !== undefined && item2.idKnjiznica !== undefined) {
    return item1.idKnjiznica === item2.idKnjiznica;
  }
  if (item1.id !== undefined && item2.id !== undefined) {
    return item1.id === item2.id;
  }
  return false;
}


  applyFiltersAndPagination() {
  let filtered = this.raspolaganja;

  filtered = this.raspolaganja.filter(r => {
    return (!this.filterNaslov?.trim() || r.naslov?.toLowerCase().includes(this.filterNaslov.toLowerCase())) &&
           (!this.filterNaziv?.trim() || r.nazivKnjiznice?.toLowerCase().includes(this.filterNaziv.toLowerCase())) &&
           (this.filterKolicinaMin == null || r.kolicina >= this.filterKolicinaMin) &&
           (this.filterKolicinaMax == null || r.kolicina <= this.filterKolicinaMax);
  });

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedRaspolaganja = filtered.slice(startIndex, endIndex);
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
  this.filterNaslov = '';
  this.filterNaziv='';
  this.filterKolicinaMax = null;
  this.filterKolicinaMin = null;
  this.currentPage = 1;
  this.applyFiltersAndPagination();
}
}




