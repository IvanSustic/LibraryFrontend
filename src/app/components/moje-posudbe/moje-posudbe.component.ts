import { Component, OnInit } from '@angular/core';
import { Rezervacija } from '../../model/rezervacija.model';
import { RezervacijaService } from '../../services/rezervacija.service';
import { Posudba } from '../../model/posudba.model';
import { PosudbaService } from '../../services/posudba.service';

@Component({
  selector: 'app-moje-posudbe',
  standalone: false,
  templateUrl: './moje-posudbe.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class MojePosudbeComponent implements OnInit {

posudbe: Posudba[] = [];
price: number = 0;

  constructor(private posudbaService: PosudbaService) {
    }

  ngOnInit(): void {
  this.posudbaService.getPosudbaForKorisnik().subscribe(data => {
        this.posudbe = data;
     });
  }

isExpired(date: Date): boolean {
  return new Date(date) < new Date();
}

hasExpiredReservations(): boolean {
  return this.posudbe.some(r => this.isExpired(r.krajPosudbe));
}

getOverdueFee(date: Date): number {
  const danas = new Date();
  const krajPosudbe = new Date(date);
  const razlika = Math.floor(
    (danas.getTime() - krajPosudbe.getTime()) / (1000 * 60 * 60 * 24)
  );
  return razlika > 0 ? razlika * 0.10 : 0;
}
getTotalOverdueFee(): number {
  return this.posudbe
    .filter(posudba => this.isExpired(posudba.krajPosudbe))
    .map(posudba => this.getOverdueFee(posudba.krajPosudbe))
    .reduce((sum, fee) => sum + fee, 0);
}
}
