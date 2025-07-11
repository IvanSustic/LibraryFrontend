import { Component, OnInit } from '@angular/core';
import { Clanstvo } from '../../model/clanstvo.model';
import { ClanstvoService } from '../../services/clanstvo-service';

@Component({
  selector: 'app-moja-clanstva',
  standalone: false,
  templateUrl: './moja-clanstva.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class MojaClanstvaComponent implements OnInit {

clanstva: Clanstvo[] = [];

  constructor(private clanstvoService: ClanstvoService) {
    }

  ngOnInit(): void {
  this.clanstvoService.getClanstvaForKorisnik().subscribe(data => {
        this.clanstva = data;
     });
  }

isExpired(date: Date): boolean {
  return new Date(date) < new Date();
}

hasExpiredClanstvo(): boolean {
  return this.clanstva.some(r => this.isExpired(r.krajUclanjenja));
}

}

