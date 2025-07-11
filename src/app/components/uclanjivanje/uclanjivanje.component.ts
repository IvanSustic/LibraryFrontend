import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClanstvoService } from '../../services/clanstvo-service';
import { KorisnikService } from '../../services/korisnik.service';
import { KnjiznicaService } from '../../services/knjizica-service';
import { Clanstvo } from '../../model/clanstvo.model';
import { Knjiznica } from '../../model/knjiznica.model';
import { PdfService } from '../../services/pdf-service';

@Component({
  selector: 'app-uclanjivanje',
  standalone: false,
  templateUrl: './uclanjivanje.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class UclanjivanjeComponent  implements OnInit {
  clanstvoForm!: FormGroup;
  clanstva: Clanstvo[] = [];
  korisnici: String[] = [];
  knjiznice: Knjiznica[] = [];
  searchTerm = '';
  selectedKnjiznica = '';

  constructor(
    private fb: FormBuilder,
    private clanstvoService: ClanstvoService,
    private korisnikService: KorisnikService,
    private knjiznicaService: KnjiznicaService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.clanstvoForm = this.fb.group({
      idKorisnik: ['', Validators.required],
      idKnjiznica: ['', Validators.required],
      datumUclanjenja: [new Date(), Validators.required],
      krajUclanjenja: ['']
    });
  this.clanstvoService.getClanstvaForZaposlenik().subscribe(data => {
        this.clanstva = data;
     });
    this.korisnikService.getEmails().subscribe(korisnici => this.korisnici = korisnici);
    this.knjiznicaService.getForZaposlenik().subscribe(knjiznice => {
      this.knjiznice = knjiznice;
   }
    );
  }

  onSubmit() {
    if (this.clanstvoForm.valid) {
      this.clanstvoService.dodajClanstvo(this.clanstvoForm.value.idKorisnik, this.clanstvoForm.value.idKnjiznica).subscribe((data) => {
        this.pdfService.generateRacunPDF(data);
        this.clanstvoForm.reset();
      });
    }
  }

  produziClanstvo(clanstvo: Clanstvo) {
  this.clanstvoService.dodajClanstvo(clanstvo.email,clanstvo.idKnjiznica).subscribe((data) => {
        this.pdfService.generateRacunPDF(data);
        this.clanstvoForm.reset();
          this.clanstvoService.getClanstvaForZaposlenik().subscribe(data => {
        this.clanstva = data;
     });
      });
  }

   dodajSva() {
    if (this.clanstvoForm.valid) {
      this.clanstvoService.dodajSvaClanstva(this.clanstvoForm.value.idKorisnik).subscribe((data) => {
        this.pdfService.generateRacunPDF(data);
        this.clanstvoForm.reset();
          this.clanstvoService.getClanstvaForZaposlenik().subscribe(data => {
        this.clanstva = data;
     });
      });
    }
  }

  get filterdClanstva(): Clanstvo[] {
    return this.clanstva.filter(clanstvo => {
      const titleMatch = clanstvo.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const knjiznicaMatch = this.selectedKnjiznica ? clanstvo.nazivKnjiznice === this.selectedKnjiznica : true;
      return titleMatch && knjiznicaMatch;
    });
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedKnjiznica = '';
 }
  
}
