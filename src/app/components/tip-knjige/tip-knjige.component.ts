import { Component, OnInit } from '@angular/core';
import { TipKnjige } from '../../model/tip-knjige.model';
import { TipKnjigeService } from '../../services/tip-knjige-service';
import { NgForm } from '@angular/forms';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-tip-knjige',
  standalone: false,
  templateUrl: './tip-knjige.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class TipKnjigeComponent  implements OnInit {
  filterNaziv: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  paginatedTipovi: TipKnjige[] = [];

  tipoviKnjiga: TipKnjige[] = [];
  selectedTipKnjige: TipKnjige = this.getEmptyTip();
  constructor(private tipKnjigeService: TipKnjigeService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loadTipovi();
  }

  getEmptyTip(): TipKnjige {
    return { naziv: ''};
  }

  loadTipovi() {
    this.tipKnjigeService.getAll().subscribe(data =>{ 
      this.tipoviKnjiga = data;
      this.applyFiltersAndPagination();
    });
  }

onSubmit(form: NgForm) {
this.tipKnjigeService.saveTip(this.selectedTipKnjige).subscribe(() => {
    console.log('Tip knjige saved!');
    form.resetForm();
    this.loadTipovi();
  });
}

  edit(tipKnjige: TipKnjige) {
    this.selectedTipKnjige = { ...tipKnjige };
  }

  delete(id: number) {
    if (confirm('Sigurno želite obrisati tip knjige?')) {
      this.tipKnjigeService.delete(id).subscribe({
                    next: (response) => {
                        this.loadTipovi();
                    },
                    error: (error) => {
                      console.log('Error deleting author:', error);
                        this.snackBar.poruka(error.error);
                    }});
    }
  }

  cancel() {
    this.selectedTipKnjige = this.getEmptyTip();
  }

    applyFiltersAndPagination() {
  let filtered = this.tipoviKnjiga;

  filtered = this.tipoviKnjiga.filter(t => {
    return (!this.filterNaziv?.trim() || t.naziv?.toLowerCase().includes(this.filterNaziv.toLowerCase()));
  });

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedTipovi = filtered.slice(startIndex, endIndex);
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
  this.filterNaziv = '';
  this.currentPage = 1;
  this.applyFiltersAndPagination();
}
}

