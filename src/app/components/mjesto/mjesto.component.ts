import { Component, OnInit } from '@angular/core';
import { Mjesto } from '../../model/mjesto.model';
import { MjestoService } from '../../services/mjesto-service';
import { SnackBarService } from '../../services/snack-bar.service';
import { NgForm } from '@angular/forms';
import { TipKnjige } from '../../model/tip-knjige.model';

@Component({
  selector: 'app-mjesto',
  standalone: false,
  templateUrl: './mjesto.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class MjestoComponent implements OnInit {
  mjesta: Mjesto[] = [];
  selectedMjesto: Mjesto = this.getEmptyMjesto();

  filterNaziv: string = '';
  filterPostanskiBroj: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  paginatedMjesta: Mjesto[] = [];

  constructor(private mjestoService: MjestoService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loadMjesta();
  }

  getEmptyMjesto(): Mjesto {
    return { naziv: '',
            postanskiBroj: 0
    };
  }

  loadMjesta() {
    this.mjestoService.getAll().subscribe(data =>{ 
      this.mjesta = data;
      this.applyFiltersAndPagination();
    });
  }

onSubmit(form: NgForm) {
this.mjestoService.saveMjesto(this.selectedMjesto).subscribe(() => {

    form.resetForm();
    this.loadMjesta();
  });
}

  edit(mjesto: Mjesto) {
    this.selectedMjesto = { ...mjesto };
  }

  delete(id: number) {
    if (confirm('Sigurno želite obrisati mjesto?')) {
      this.mjestoService.delete(id).subscribe({
                    next: (response) => {
                        this.loadMjesta();
                    },
                    error: (error) => {
                        this.snackBar.poruka(error.error);
                    }});
    }
  }

  cancel() {
    this.selectedMjesto = this.getEmptyMjesto();
  }

    applyFiltersAndPagination() {
  let filtered = this.mjesta;

  filtered = this.mjesta.filter(m => {
    return (!this.filterNaziv?.trim() || m.naziv?.toLowerCase().includes(this.filterNaziv.toLowerCase())) &&
           (this.filterPostanskiBroj?.trim() == null || m.postanskiBroj.toString()?.includes(this.filterPostanskiBroj));
  });

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedMjesta = filtered.slice(startIndex, endIndex);
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
  this.filterPostanskiBroj = "";
  this.currentPage = 1;
  this.applyFiltersAndPagination();
}
}

