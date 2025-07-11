import { Component, OnInit } from '@angular/core';
import { Autor } from '../../model/autor.model';
import { AutorService } from '../../services/autor-service';
import { NgForm } from '@angular/forms';
import {formatDate} from '@angular/common';
import { SnackBarService } from '../../services/snack-bar.service';
@Component({
  selector: 'app-autori',
  standalone: false,
  templateUrl: './autori.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class AutoriComponent implements OnInit {
  autori: Autor[] = [];
  selectedAutor: Autor = this.getEmptyAutor();
  today: Date = new Date();

  filterIme: string = '';
  filterPrezime: string = '';
  filterDatumBefore: string = '';
  filterDatumAfter: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  paginatedAutor: Autor[] = [];

  constructor(private autorService: AutorService, private snackBar: SnackBarService) {}

  ngOnInit(): void {
    this.loadAutori();
  }

  getEmptyAutor(): Autor {
    return { ime: '', prezime: '', datumRodjenja: ""};
  }

  loadAutori() {
    this.autorService.getAll().subscribe(data =>{ 
      console.log('Loaded authors:', data);
      this.autori = data;
      this.applyFiltersAndPagination();
    });
  }

onSubmit(form: NgForm) {
if(this.selectedAutor.datumRodjenja instanceof Date) {
this.selectedAutor.datumRodjenja = this.selectedAutor.datumRodjenja.toISOString();
}

 this.autorService.saveAutor(this.selectedAutor).subscribe(() => {
    console.log('Autor saved!');
    form.resetForm();
    this.loadAutori();
  });
}

  edit(autor: Autor) {
    this.selectedAutor = { ...autor };
  }

  isDateValied(): boolean {

    if (this.selectedAutor.datumRodjenja == "") {
      return false;
    }
    console.log(new Date(this.selectedAutor.datumRodjenja) < this.today);
    return new Date(this.selectedAutor.datumRodjenja) < this.today;
  }

  delete(id: number) {
    if (confirm('Sigurno želite obristati autora?')) {
      this.autorService.delete(id).subscribe({
                    next: (response) => {
                        this.loadAutori();
                    },
                    error: (error) => {
                      console.log('Error deleting author:', error);
                        this.snackBar.poruka(error.error);
                    }});
    }
  }

  cancel() {
    this.selectedAutor = this.getEmptyAutor();
  }

  applyFiltersAndPagination() {
  let filtered = this.autori;

  filtered = this.autori.filter(a => {
    return (!this.filterIme?.trim() || a.ime?.toLowerCase().includes(this.filterIme.toLowerCase())) &&
           (!this.filterPrezime?.trim() || a.prezime?.toLowerCase().includes(this.filterPrezime.toLowerCase())) &&
           (!this.filterDatumBefore || new Date(a.datumRodjenja) <= new Date(this.filterDatumBefore)) &&
           (!this.filterDatumAfter || new Date(a.datumRodjenja) >= new Date(this.filterDatumAfter));
  });

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedAutor = filtered.slice(startIndex, endIndex);
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
  this.filterDatumBefore = '';
  this.filterDatumAfter = '';
  this.currentPage = 1;
  this.applyFiltersAndPagination();
}

}

