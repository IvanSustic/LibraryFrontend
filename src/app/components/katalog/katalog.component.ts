import { Component, OnInit } from '@angular/core';
import { Knjiga } from '../../model/knjiga.model';
import { KnjigaService } from '../../services/knjiga-service.service';
import { Zanr } from '../../model/zanr.model';
import { TipKnjige } from '../../model/tip-knjige.model';
import { Autor } from '../../model/autor.model';

@Component({
  selector: 'app-katalog',
  standalone: false,
  templateUrl: './katalog.component.html',
  styleUrl: './katalog.component.css'
})
export class KatalogComponent implements OnInit {

  knjige: Knjiga[] = [];


  currentPage: number = 1;
  itemsPerPage: number = 15;


  searchTerm = '';
  selectedZanr = '';
  selectedTip = '';
  selectedAutor = '';

  autoriList: string[] = [];
  zanrovi: string[] = [];
  tipoviKnjiga: string[] = [];


  constructor(private knjigaService: KnjigaService) {
    }


    ngOnInit(): void {
      this.knjigaService.getKnjige().subscribe(data =>{ 
        this.knjige = data;
        this.zanrovi = [...new Set(this.knjige.map(k => k.zanr.naziv))];
        this.tipoviKnjiga = [...new Set(this.knjige.map(k => k.tipKnjige.naziv))];
        const allAutori = this.knjige.flatMap(k => k.autori.map(a => `${a.ime} ${a.prezime}`));
        this.autoriList = [...new Set(allAutori)];
      });
     
    }
  
    get filteredKnjige(): Knjiga[] {
      return this.knjige.filter(knjiga => {
        const titleMatch = knjiga.naslov.toLowerCase().includes(this.searchTerm.toLowerCase());
        const zanrMatch = this.selectedZanr ? knjiga.zanr.naziv === this.selectedZanr : true;
        const tipMatch = this.selectedTip ? knjiga.tipKnjige.naziv === this.selectedTip : true;
        const autorMatch = this.selectedAutor
          ? knjiga.autori.some(a => `${a.ime} ${a.prezime}` === this.selectedAutor)
          : true;
    
        return titleMatch && zanrMatch && tipMatch && autorMatch;
      });
    }
  
    resetFilters(): void {
      this.searchTerm = '';
      this.selectedZanr = '';
      this.selectedTip = '';
      this.selectedAutor = '';
      this.currentPage = 1;
    }

get totalPages(): number {
  return Math.ceil(this.filteredKnjige.length / this.itemsPerPage);
}

get paginatedKnjige(): Knjiga[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredKnjige.slice(start, start + this.itemsPerPage);
}

changePage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}


}
