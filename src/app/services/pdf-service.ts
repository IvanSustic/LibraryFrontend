import { Injectable } from '@angular/core';
import { Racun } from '../model/racun.model';
import html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  generateRacunPDF(racun: Racun): void {
   const logoUrl = '/images/logo.png';
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .receipt {
          font-family: 'Segoe UI', sans-serif;
          max-width: 700px;
          padding: 30px;
          border: 1px solid #ccc;
          margin: auto;
          color: #2c3e50;
          background: #fff;
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo img {
          max-height: 80px;
        }
        .title {
          text-align: center;
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 30px;
          color: #1a1a1a;
        }
        .section {
          margin-bottom: 20px;
        }
        .section h2 {
          font-size: 16px;
          margin-bottom: 5px;
          color: #555;
        }
        .section p {
          font-size: 14px;
          margin: 4px 0;
        }
        .section span {
          font-weight: 600;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          color: #1a1a1a;
          padding-top: 10px;
          border-top: 2px dashed #aaa;
        }
        hr {
          border: none;
          border-top: 1px solid #ddd;
          margin: 20px 0;
        }
      </style>

      <div class="receipt">
        <div class="logo">
          <img src="${logoUrl}" alt="Company Logo" />
        </div>

        <div class="title">Račun</div>
     <hr />
        <div class="section">
          <p><span>Datum:</span> ${new Date(racun.datum).toLocaleString('hr-HR')}</p>
          <p><span>Tip računa:</span> ${racun.tipRacuna}</p>
        </div>

        <hr />

        <div class="section">
          <h2>Zaposlenik</h2>
          <p>${racun.imeZaposlenik} ${racun.prezimeZaposlenika}</p>
        </div>
     <hr />
        <div class="section">
          <h2>Korisnik</h2>
          <p>${racun.imeKorisnika} ${racun.prezimeKorisnika}</p>
        </div>

        <hr />

        <div class="section">
          <h2>Opis</h2>
          <p>${racun.opis}</p>
        </div>

        <div class="section total">
          <p><span>Ukupna cijena:</span> ${racun.cijena.toFixed(2)} EUR</p>
        </div>
      </div>
    `;

    const options = {
      margin: 0.5,
      filename: `racun-${racun.imeKorisnika}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(container).set(options).save();
  }
}