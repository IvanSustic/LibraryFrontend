import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { HomeComponent } from './components/home/home.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { KatalogComponent } from './components/katalog/katalog.component';
import { KnjiznicaFullListComponent } from './components/knjiznica-full-list/knjiznica-full-list.component';
import { KnjiznicaComponent } from './components/knjiznica/knjiznica.component';
import { KnjigaComponent } from './components/knjiga/knjiga.component';
import { ClanstvaComponent } from './components/clanstva/clanstva.component';
import { MojKatalogComponent } from './components/moj-katalog/moj-katalog.component';
import { MojeRezervacijeComponent } from './components/moje-rezervacije/moje-rezervacije.component';
import { MojePosudbeComponent } from './components/moje-posudbe/moje-posudbe.component';
import { RoleGuard } from './guard/role.guard';
import { PosudbeComponent } from './components/posudbe/posudbe.component';
import { RezervacijeComponent } from './components/rezervacije/rezervacije.component';
import { MojaClanstvaComponent } from './components/moja-clanstva/moja-clanstva.component';
import { UclanjivanjeComponent } from './components/uclanjivanje/uclanjivanje.component';
import { PosudbeKatalogComponent } from './components/posudbe-katalog/posudbe-katalog.component';
import { AutoriComponent } from './components/autori/autori.component';
import { TipKnjigeComponent } from './components/tip-knjige/tip-knjige.component';
import { ZanrComponent } from './components/zanr/zanr.component';
import { KnjigeComponent } from './components/knjige/knjige.component';
import { RaspoloziveComponent } from './components/raspolozive/raspolozive.component';
import { ZaposlenikComponent } from './components/zaposlenik/zaposlenik.component';
import { KnjizniceComponent } from './components/knjiznice/knjiznice.component';
import { MjestoComponent } from './components/mjesto/mjesto.component';
import { KorisnikComponent } from './components/korisnik/korisnik.component';
import { RacuniComponent } from './components/racuni/racuni.component';
import { ResetComponent } from './components/reset/reset.component';
import { LozinkaResetComponent } from './components/lozinka-reset/lozinka-reset.component';

const routes: Routes = [{ path: '', component: HomeComponent }, 
  { path: 'login', component: LoginComponent}, 
  { path: 'signup', component: SignupComponent},
  { path: 'katalog', component: KatalogComponent},
  { path: 'knjiznice', component: KnjiznicaFullListComponent},
{ path: 'knjiznica/:id', component: KnjiznicaComponent },
{ path: 'knjiga/:id', component: KnjigaComponent },
{ path: 'reset-password/:token', component: LozinkaResetComponent },
{ path: 'clanstva', component: ClanstvaComponent },
{ path: 'reset', component: ResetComponent },
{ path: 'mojKatalog', component: MojKatalogComponent, canActivate:[RoleGuard],  data: { roles: ['ROLE_USER'] } },
 { path: 'mojeRezervacije', component: MojeRezervacijeComponent, canActivate:[RoleGuard],data: { roles: ['ROLE_USER'] } }, 
 { path: 'mojePosudbe', component: MojePosudbeComponent, canActivate:[RoleGuard],data: { roles: ['ROLE_USER'] }},
  { path: 'mojaClanstva', component: MojaClanstvaComponent, canActivate:[RoleGuard],data: { roles: ['ROLE_USER'] }},
 { path: 'posudbe', component: PosudbeComponent, canActivate:[RoleGuard],data: { roles: ['Knjižničar'] }},
 { path: 'rezervacije', component: RezervacijeComponent, canActivate:[RoleGuard],data: { roles: ['Knjižničar'] }},
 { path: 'uclanjivanje', component: UclanjivanjeComponent, canActivate:[RoleGuard],data: { roles: ['Knjižničar'] }},
 { path: 'posudbeKatalog', component: PosudbeKatalogComponent, canActivate:[RoleGuard],data: { roles: ['Knjižničar'] }},
 { path: 'autori', component: AutoriComponent, canActivate:[RoleGuard],data: { roles: ['Voditelj knjižnice','Admin'] }}, 
 { path: 'tipKnjige', component: TipKnjigeComponent, canActivate:[RoleGuard],data: { roles: ['Voditelj knjižnice','Admin'] }},   
 { path: 'zanr', component: ZanrComponent, canActivate:[RoleGuard],data: { roles: ['Voditelj knjižnice','Admin'] }},
 { path: 'knjige', component: KnjigeComponent, canActivate:[RoleGuard],data: { roles: ['Voditelj knjižnice','Admin'] }},
 { path: 'raspolaganja', component: RaspoloziveComponent, canActivate:[RoleGuard],data: { roles: ['Voditelj knjižnice'] }},
 { path: 'knjiznicari', component: ZaposlenikComponent, canActivate:[RoleGuard],data: { roles: ['Voditelj knjižnice','Admin'] }}, 
  { path: 'racuni', component: RacuniComponent, canActivate:[RoleGuard],data: { roles: ['Voditelj knjižnice','Admin'] }}, 
 { path: 'knjizniceAdmin', component: KnjizniceComponent, canActivate:[RoleGuard],data: { roles: ['Admin'] }},
 { path: 'mjesta', component: MjestoComponent, canActivate:[RoleGuard],data: { roles: ['Admin'] }},
 { path: 'korisnici', component: KorisnikComponent, canActivate:[RoleGuard],data: { roles: ['Admin'] }},        ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
