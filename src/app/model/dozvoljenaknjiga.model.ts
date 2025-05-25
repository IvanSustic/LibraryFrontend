import { Autor } from "./autor.model";
import { TipKnjige } from "./tip-knjige.model";
import { Zanr } from "./zanr.model";

export interface DozvoljenaKnjiga {
    idKnjiga?: number;
    naslov: string;
    datumIzdanja: Date;
    slika: string;
    kolicina: number;
    idKnjiznica: number;
    nazivKnjiznice: string;
    zanr: string;
    tipKnjige: string;
    autori: Autor[];
}