import { Component, DestroyRef} from '@angular/core';
import { Knjiga } from '../../model/knjiga.model';
import { KnjigaService } from '../../services/knjiga-service.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  standalone: false,
})
export class BookListComponent {
title = 'libraryApp';
knjige: Knjiga[] = [];
currentIndex = 0;
imagesPerPage = 3;
cols = 5;

constructor(private knjigaService: KnjigaService) {
  }

ngOnInit(): void {
  this.knjigaService.getKnjige().subscribe(data =>{ 
    this.knjige = data;
    if (this.knjige.length < 3) {
      this.cols = 2 + this.knjige.length;
    }
  });
}

get slicedKnjige() {
  return this.knjige.slice(this.currentIndex, this.currentIndex + this.imagesPerPage);
}

next() {
  if (this.currentIndex + this.imagesPerPage < this.knjige.length) {
    this.currentIndex += this.imagesPerPage;
    if (this.currentIndex + this.imagesPerPage > this.knjige.length) {
      this.cols = 1+(this.currentIndex + this.imagesPerPage - this.knjige.length);
    }
  }
}

prev() {
  if (this.currentIndex - this.imagesPerPage >= 0) {
    this.currentIndex -= this.imagesPerPage;
    this.cols = 5;
  }
}
}