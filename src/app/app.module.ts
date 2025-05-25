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


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,       
    MatGridListModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule { }
