export interface Rezervacija {
    idRezervacija?: number;
    idKorisnik: number;
    idKnjiznica: number;
    nazivKnjiznice: string;
    idKnjiga: number; 
    nazivKnjige: string;
    datumRezervacije: Date; 
    krajRezervacije: Date;
    korisnikEmail: string;
  }