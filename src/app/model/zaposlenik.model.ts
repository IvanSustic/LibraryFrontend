import { Knjiznica } from "./knjiznica.model";
import { RadnoMjesto } from "./radno-mjesto.model";

export interface Zaposlenik {
    idZaposlenik?: number;
    ime: string;
    prezime: string;
    email: string;
    lozinka?: string;
    radnaMjesta: RadnoMjesto[];
    knjiznice: Knjiznica[];
    iskljucen?: boolean;
  }