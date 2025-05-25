import { Component } from '@angular/core';
import { KnjzinicaService } from '../../services/knjzinica-service.service';
import { Knjiznica } from '../../model/knjiznica.model';

@Component({
  selector: 'app-knjiznica-full-list',
  standalone: false,
  templateUrl: './knjiznica-full-list.component.html',
  styleUrl: './knjiznica-full-list.component.css'
})
export class KnjiznicaFullListComponent {
 knjiznice: Knjiznica[] = [];

  searchTerm = '';
  selectedMjesto = '';

  mjesta: string[] = [];
  constructor(private knjiznicaService: KnjzinicaService){}

    ngOnInit(): void {
      this.knjiznicaService.getKnjiznice().subscribe(data =>{ 
        this.knjiznice = data;
        this.mjesta = [...new Set(this.knjiznice.map(k => k.mjesto.naziv))];
      });
     
    }
  
    get filteredKnjiznice(): Knjiznica[] {
      return this.knjiznice.filter(knjiznica => {
        const nazivMatch = knjiznica.naziv.toLowerCase().includes(this.searchTerm.toLowerCase());
        const mjestoMatch = this.selectedMjesto ? knjiznica.mjesto.naziv === this.selectedMjesto : true;
    
        return nazivMatch && mjestoMatch;
      });
    }
  
    resetFilters(): void {
      this.searchTerm = '';
      this.selectedMjesto = '';
    }

  
}
