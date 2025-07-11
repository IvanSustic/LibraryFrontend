import { Autor } from "./autor.model";
import { TipKnjige } from "./tip-knjige.model";
import { Zanr } from "./zanr.model";

export interface Knjiga {
    idKnjiga?: number;
    naslov: string;
    datumIzdanja: Date | string;
    slika: string;
    zanr: Zanr;
    tipKnjige: TipKnjige;
    cijena: number;
    autori: Autor[];
    }