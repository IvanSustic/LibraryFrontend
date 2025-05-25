import { Component, OnInit } from '@angular/core';
import { Posudba } from '../../model/posudba.model';
import { PosudbaService } from '../../services/posudba.service';

@Component({
  selector: 'app-posudbe',
  standalone: false,
  templateUrl: './posudbe.component.html',
  styleUrl: './posudbe.component.css'
})
export class PosudbeComponent  implements OnInit {

posudbe: Posudba[] = [];

  searchTerm = '';
  selectedKnjiznica = '';
  knjiznice: string[] = [];

  constructor(private posudbaService: PosudbaService) {
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
    const cijena = this.getOverdueFee(posudba.krajPosudbe);
    if (cijena > 0) {

    }
     if (posudba.idPosudba !== undefined) {
        this.posudbaService.otkaziRezervaciju(posudba.idPosudba).subscribe(() => {
          this.posudbe = this.posudbe.filter(p => p.idPosudba !== posudba.idPosudba);
        });
      } else {
        console.error('Posudba nema idPosudba!');
      }
  }

 getOverdueFee(date: Date): number {
  const danas = new Date();
  const krajPosudbe = new Date(date);
  const razlika = Math.floor(
    (danas.getTime() - krajPosudbe.getTime()) / (1000 * 60 * 60 * 24)
  );
  return razlika > 0 ? razlika * 0.10 : 0;
}

}
