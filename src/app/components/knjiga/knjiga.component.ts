import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Knjiga } from '../../model/knjiga.model';
import { KnjigaService } from '../../services/knjiga-service.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-knjiga',
  templateUrl: './knjiga.component.html',
  styleUrls: ['./knjiga.component.css'],
  standalone: false,
})
export class KnjigaComponent implements OnInit {
  knjiga!: Knjiga;

  constructor(
    private route: ActivatedRoute,
    private knjigaService: KnjigaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.knjigaService.getKnjigaById(id).subscribe(knjiga => {
      this.knjiga = knjiga;
    });
  }

  get autoriString(): string {
  return this.knjiga?.autori?.map(a => a.ime + ' ' + a.prezime).join(', ') || '';
}
}

