import { Component, OnInit } from '@angular/core';
import { Racun } from '../../model/racun.model';
import { RacunService } from '../../services/racun-service.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { PdfService } from '../../services/pdf-service';

@Component({
  selector: 'app-racuni',
  standalone: false,
  templateUrl: './racuni.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class RacuniComponent implements OnInit {
  racuni: Racun[] = [];

  filterImeZaposlenika: string = ''
  filterPrezimeZaposlenika: string = '';
  filterImeKorisnika: string = ''
  filterPrezimeKorisnikaa: string = '';
  filterOpis: string = '';
  filterCijenaMin: number | null = null;
  filterCijenaMax: number | null = null;
  filterDatumBefore: string = '';
  filterDatumAfter: string = '';
  filterTipRacuna: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  paginatedRacuni: Racun[] = [];

  constructor(private racunService: RacunService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.racunService.getAll().subscribe(data =>{ 
      this.racuni = data;
      this.applyFiltersAndPagination();
    });
  }

  ispisi(racun: Racun): void {
  this.pdfService.generateRacunPDF(racun);
  }

  applyFiltersAndPagination() {
  let filtered = this.racuni;

  filtered = this.racuni.filter(r => {
    return (!this.filterImeKorisnika?.trim() || r.imeKorisnika?.toLowerCase().includes(this.filterImeKorisnika.toLowerCase())) &&
           (!this.filterPrezimeKorisnikaa?.trim() || r.prezimeKorisnika?.toLowerCase().includes(this.filterPrezimeKorisnikaa.toLowerCase())) &&
           (!this.filterPrezimeZaposlenika?.trim() || r.prezimeZaposlenika?.toLowerCase().includes(this.filterPrezimeZaposlenika.toLowerCase())) &&
           (!this.filterImeZaposlenika?.trim() || r.imeZaposlenik?.toLowerCase().includes(this.filterImeZaposlenika.toLowerCase())) &&
           (!this.filterTipRacuna?.trim() || r.tipRacuna?.toLowerCase().includes(this.filterTipRacuna.toLowerCase())) &&
           (!this.filterOpis?.trim() || r.opis?.toLowerCase().includes(this.filterOpis.toLowerCase())) &&
           (this.filterCijenaMin == null || r.cijena >= this.filterCijenaMin) &&
           (this.filterCijenaMax == null || r.cijena <= this.filterCijenaMax) &&
           (!this.filterDatumBefore || new Date(r.datum) <= new Date(this.filterDatumBefore)) &&
           (!this.filterDatumAfter || new Date(r.datum) >= new Date(this.filterDatumAfter));
  });

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedRacuni = filtered.slice(startIndex, endIndex);
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
  this.filterImeKorisnika = '';
  this.filterPrezimeKorisnikaa = '';
  this.filterImeZaposlenika = '';
  this.filterPrezimeZaposlenika = '';
  this.filterTipRacuna = '';
  this.filterCijenaMin = null;
  this.filterCijenaMax = null;
  this.filterDatumBefore = '';
  this.filterDatumAfter = '';
  this.filterOpis= '';
  this.currentPage = 1;
  this.applyFiltersAndPagination();
}

  
}
  

