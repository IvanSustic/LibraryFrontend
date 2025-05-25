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

const routes: Routes = [{ path: '', component: HomeComponent }, 
  { path: 'login', component: LoginComponent}, 
  { path: 'signup', component: SignupComponent},
  { path: 'katalog', component: KatalogComponent},
  { path: 'knjiznice', component: KnjiznicaFullListComponent},
{ path: 'knjiznica/:id', component: KnjiznicaComponent },
{ path: 'knjiga/:id', component: KnjigaComponent },
{ path: 'clanstva', component: ClanstvaComponent },
{ path: 'mojKatalog', component: MojKatalogComponent, canActivate:[RoleGuard],  data: { roles: ['ROLE_USER'] } },
 { path: 'mojeRezervacije', component: MojeRezervacijeComponent, canActivate:[RoleGuard],data: { roles: ['ROLE_USER'] } }, 
 { path: 'mojePosudbe', component: MojePosudbeComponent, canActivate:[RoleGuard],data: { roles: ['ROLE_USER'] }},
 { path: 'posudbe', component: PosudbeComponent, canActivate:[RoleGuard],data: { roles: ['Knjižničar'] }},  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
