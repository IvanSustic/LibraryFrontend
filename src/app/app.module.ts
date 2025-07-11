import { NgModule } from '@angular/core';

import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {HttpClient, HTTP_INTERCEPTORS, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BookListComponent } from './components/book-list/book-list.component'
import { KnjigaComponent } from './components/knjiga/knjiga.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { LayoutModule } from '@angular/cdk/layout';
import { HomeComponent } from './components/home/home.component';
import { PosudbeComponent } from './components/posudbe/posudbe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {provideHttpClient} from '@angular/common/http';
import { KnjiznicaListComponent } from './components/knjiznica-list/knjiznica-list.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authInterceptor } from './interceptors/auth-interceptor';
import { KatalogComponent } from './components/katalog/katalog.component';
import { KnjiznicaFullListComponent } from './components/knjiznica-full-list/knjiznica-full-list.component';
import { KnjiznicaComponent } from './components/knjiznica/knjiznica.component';
import { ClanstvaComponent } from './components/clanstva/clanstva.component';
import { RezervacijeComponent } from './components/rezervacije/rezervacije.component';
import { MojKatalogComponent } from './components/moj-katalog/moj-katalog.component';
import { MojeRezervacijeComponent } from './components/moje-rezervacije/moje-rezervacije.component';
import { MojePosudbeComponent } from './components/moje-posudbe/moje-posudbe.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MojaClanstvaComponent } from './components/moja-clanstva/moja-clanstva.component';
import { UclanjivanjeComponent } from './components/uclanjivanje/uclanjivanje.component';
import { PosudbeKatalogComponent } from './components/posudbe-katalog/posudbe-katalog.component';
import { AutoriComponent } from './components/autori/autori.component';
import { TipKnjigeComponent } from './components/tip-knjige/tip-knjige.component';
import { ZanrComponent } from './components/zanr/zanr.component';
import { KnjigeComponent } from './components/knjige/knjige.component';
import { ZaposlenikComponent } from './components/zaposlenik/zaposlenik.component';
import { RaspoloziveComponent } from './components/raspolozive/raspolozive.component';
import { KnjizniceComponent } from './components/knjiznice/knjiznice.component';
import { MjestoComponent } from './components/mjesto/mjesto.component';
import { KorisnikComponent } from './components/korisnik/korisnik.component';
import { RacuniComponent } from './components/racuni/racuni.component';
import { ResetComponent } from './components/reset/reset.component';
import { LozinkaResetComponent } from './components/lozinka-reset/lozinka-reset.component';

@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    NavbarComponent,
    KnjigaComponent,
    HomeComponent,
    PosudbeComponent,
    KnjiznicaListComponent,
    LoginComponent,
    SignupComponent,
    KatalogComponent,
    KnjiznicaFullListComponent,
    KnjiznicaComponent,
    ClanstvaComponent,
    RezervacijeComponent,
    MojKatalogComponent,
    MojeRezervacijeComponent,
    MojePosudbeComponent,
    MojaClanstvaComponent,
    UclanjivanjeComponent,
    PosudbeKatalogComponent,
    AutoriComponent,
    TipKnjigeComponent,
    ZanrComponent,
    KnjigeComponent,
    ZaposlenikComponent,
    RaspoloziveComponent,
    KnjizniceComponent,
    MjestoComponent,
    KorisnikComponent,
    RacuniComponent,
    ResetComponent,
    LozinkaResetComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,       
    MatGridListModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
        MatSnackBarModule,
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule { }
