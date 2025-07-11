import { Component, OnInit } from '@angular/core';
import { Posudba } from '../../model/posudba.model';
import { PosudbaService } from '../../services/posudba.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Racun } from '../../model/racun.model';
import { PdfService } from '../../services/pdf-service';


@Component({
  selector: 'app-posudbe',
  standalone: false,
  templateUrl: './posudbe.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class PosudbeComponent  implements OnInit {

posudbe: Posudba[] = [];

  searchTerm = '';
  selectedKnjiznica = '';
  knjiznice: string[] = [];

  constructor(private posudbaService: PosudbaService, private pdfService: PdfService) {
    }

  ngOnInit(): void {
  this.posudbaService.getPosudbaForZaposlenik().subscribe(data => {
        this.posudbe = data;
        this.knjiznice = [...new Set(this.posudbe.map(k => k.nazivKnjiznice))];
     });
  }

    get filteredPosudbe(): Posudba[] {
      return this.posudbe.filter(posudba => {
        const titleMatch = posudba.korisnikEmail.toLowerCase().includes(this.searchTerm.toLowerCase());
        const knjiznicaMatch = this.selectedKnjiznica ? posudba.nazivKnjiznice === this.selectedKnjiznica : true;

        return titleMatch && knjiznicaMatch;
      });
    }

  resetFilters(): void {
      this.searchTerm = '';
      this.selectedKnjiznica = '';
    }

  vratiKnjigu(posudba: Posudba): void{
     if (posudba.idPosudba !== undefined) {
        this.posudbaService.vratiKnjigu(posudba.idPosudba).subscribe((response) => {
          this.posudbe = this.posudbe.filter(p => p.idPosudba !== posudba.idPosudba);
          if (response.cijena){
              this.generatePDF(response);
          }
        });
      } else {
        console.error('Posudba nema idPosudba!');
      }
  }

isExpired(date: Date): boolean {
  return new Date(date) < new Date();
}

getOverdueFee(date: Date): number {
  const danas = new Date();
  const krajPosudbe = new Date(date);
  const razlika = Math.floor(
    (danas.getTime() - krajPosudbe.getTime()) / (1000 * 60 * 60 * 24)
  );
  return razlika > 0 ? razlika * 0.10 : 0;
}

generatePDF(racun: Racun): void { 
  this.pdfService.generateRacunPDF(racun);
  } 


  osetecenaKnjiga(posudba: Posudba): void{
     if (posudba.idPosudba !== undefined) {
        this.posudbaService.ostecenaKnjiga(posudba.idPosudba).subscribe((response) => {
          this.posudbe = this.posudbe.filter(p => p.idPosudba !== posudba.idPosudba);
          if (response.cijena){
              this.generatePDF(response);
          }
        });
      } else {
        console.error('Posudba nema idPosudba!');
      }
  }



}
