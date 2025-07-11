import { Component, OnInit } from '@angular/core';
import { Zanr } from '../../model/zanr.model';
import { ZanrService } from '../../services/zanr-service';
import { NgForm } from '@angular/forms';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-zanr',
  standalone: false,
  templateUrl: './zanr.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class ZanrComponent implements OnInit {
  filterNaziv: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  paginatedZanri: Zanr[] = [];

  zanri: Zanr[] = [];
  selectedZanr: Zanr = this.getEmptyZanr();
  constructor(private zanrService: ZanrService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loadZanri();
  }

  getEmptyZanr(): Zanr {
    return { naziv: ''};
  }

  loadZanri() {
    this.zanrService.getAll().subscribe(data =>{ 
      this.zanri = data;
      this.applyFiltersAndPagination();
    });
  }

onSubmit(form: NgForm) {
this.zanrService.saveZanr(this.selectedZanr).subscribe(() => {
    console.log('Tip knjige saved!');
    form.resetForm();
    this.loadZanri();
  });
}

  edit(zanr: Zanr) {
    this.selectedZanr = { ...zanr };
  }

  delete(id: number) {
    if (confirm('Sigurno želite obrisati žanr?')) {
      this.zanrService.delete(id).subscribe({
                    next: (response) => {
                        this.loadZanri();
                    },
                    error: (error) => {
                        this.snackBar.poruka(error.error);
                    }});
    }
  }

  cancel() {
    this.selectedZanr = this.getEmptyZanr();
  }

      applyFiltersAndPagination() {
  let filtered = this.zanri;

  filtered = this.zanri.filter(z => {
    return (!this.filterNaziv?.trim() || z.naziv?.toLowerCase().includes(this.filterNaziv.toLowerCase()));
  });

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedZanri = filtered.slice(startIndex, endIndex);
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

