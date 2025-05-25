export interface Posudba {
    idPosudba?: number;
    idKorisnik: number;
    idKnjiznica: number;
    nazivKnjiznice: string;
    idKnjiga: number; 
    nazivKnjige: string;
    datumPosudbe: Date; 
    krajPosudbe: Date;
    korisnikEmail: string;
  }