import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import L from 'leaflet';
import { Knjiznica } from '../../model/knjiznica.model';
import { KnjiznicaService } from '../../services/knjizica-service';

@Component({
  selector: 'app-knjiznica',
  standalone: false,
  templateUrl: './knjiznica.component.html',
  styleUrl: './knjiznica.component.css'
})
export class KnjiznicaComponent implements OnInit {
 knjiznica!: Knjiznica;

  constructor(
    private route: ActivatedRoute,
    private knjiznicaService: KnjiznicaService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.knjiznicaService.getKnjiznicaById(id).subscribe(data => {
    
        this.knjiznica = data;
        this.loadMap(this.knjiznica.adresa + ', ' + this.knjiznica.mjesto.naziv);
      
    });
  }

  loadMap(fullAddress: string) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const lat = data[0].lat;
          const lon = data[0].lon;

          const map = L.map('map').setView([lat, lon], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          L.marker([lat, lon]).addTo(map)
            .bindPopup(this.knjiznica.naziv)
            .openPopup();
        }
      });
  }
}
