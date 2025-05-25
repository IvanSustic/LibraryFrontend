import { Mjesto } from "./mjesto.model";

export interface Knjiznica {
    idKnjiznica?: number;
    naziv: string;
    adresa: string;
    slika: string;
    mjesto: Mjesto;
  }