import { Injectable } from '@angular/core';
import { Racun } from '../model/racun.model';
import html2pdf from 'html2pdf.js';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
    constructor(private snackBar: MatSnackBar) {}

    poruka(poruka: string): void {
  this.snackBar.open(poruka, 'Zatvori', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['success-snackbar']
  });
}
}