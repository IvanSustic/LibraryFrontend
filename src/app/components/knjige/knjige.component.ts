import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Knjiga } from '../../model/knjiga.model';
import { KnjigaService } from '../../services/knjiga-service.service';
import { TipKnjige } from '../../model/tip-knjige.model';
import { Zanr } from '../../model/zanr.model';
import { NgForm } from '@angular/forms';
import { TipKnjigeService } from '../../services/tip-knjige-service';
import { ZanrService } from '../../services/zanr-service';
import { AutorService } from '../../services/autor-service';
import { Autor } from '../../model/autor.model';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-knjige',
  standalone: false,
  templateUrl: './knjige.component.html',
  styleUrl: './knjige.component.css'
})
export class KnjigeComponent implements OnInit {

  filterNaslov: string = '';
  filterTip: number | null = null;
  filterZanr: number | null = null;
  filterAutor: number | null = null;
  filterCijenaMin: number | null = null;
  filterCijenaMax: number | null = null;
  filterDatumBefore: string = '';
  filterDatumAfter: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  paginatedKnjige: Knjiga[] = [];

  knjige: Knjiga[] = [];
  zanroviList: Zanr[] = [];
  tipoviKnjigaList: TipKnjige[] = [];
  autoriList: Autor[] = [];
  selectedKnjiga: Knjiga = this.getEmptyKnjiga();
  today: Date = new Date();
  selectedFile: File | null = null;
  imageUrlPreview: string | ArrayBuffer | null = null;
  imageUploadError: string | null = null;
  isUploadingImage: boolean = false;
  forDelete: string ="";


  constructor(private knjigaService: KnjigaService,
    private tipKnjigeService : TipKnjigeService,
    private zanrService: ZanrService,
    private autorService: AutorService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loadKnjiga();
    this.tipKnjigeService.getAll().subscribe(data => {
      this.tipoviKnjigaList = data
    });
    this.zanrService.getAll().subscribe(data => {
      this.zanroviList = data;
    });
    this.autorService.getAll().subscribe(data => {
      this.autoriList = data;
    });

  }

  isSlikaValid(): boolean {
  return (this.selectedKnjiga.idKnjiga ==null) && (this.selectedFile == null);
  }

getEmptyKnjiga(): Knjiga {
  return {
    naslov: '',
    datumIzdanja: new Date(),
    slika: '',
    zanr: {} as Zanr,
    tipKnjige: {} as TipKnjige,
    cijena: 0,
    autori: []
  };
}

  loadKnjiga() {
    this.knjigaService.getKnjige().subscribe(data =>{ 
      this.knjige = data;
      this.applyFiltersAndPagination();
      console.log(this.knjige);
    });
  }

  edit(knjiga: Knjiga) {
    this.selectedKnjiga = { ...knjiga };
    this.forDelete = knjiga.slika;
  }

  isDateValid(): boolean {

    if (this.selectedKnjiga.datumIzdanja == "") {
      return false;
    }
    console.log(new Date(this.selectedKnjiga.datumIzdanja) < this.today);
    return new Date(this.selectedKnjiga.datumIzdanja) < this.today;
  }

  delete(knjiga: Knjiga) {
    if (confirm('Sigurno želite obrisati knjigu?')) {
      if (!knjiga || !knjiga.idKnjiga) {
        console.error('Invalid knjiga object:', knjiga);
        return;
      }
      this.knjigaService.delete(knjiga.idKnjiga).subscribe({
                    next: (response) => {
                        this.knjigaService.deleteImage(knjiga.slika).subscribe({
                            next: (deleteResponse) => {
                                console.log('Image deleted successfully:', deleteResponse);
                            },
                            error: (deleteError) => {
                                console.error('Error deleting image:', deleteError);
                                this.snackBar.poruka('Greška pri brisanju slike.');
                            }
                        });
                        this.loadKnjiga();
                    },
                    error: (error) => {
                        console.error('Error deleting knjiga:', error);
                        this.snackBar.poruka(error.error);
                    }
        });
      
    }
  }

  cancel() {
    this.selectedKnjiga = this.getEmptyKnjiga();
    this.selectedFile = null;
    this.imageUrlPreview = null;
    this.imageUploadError = null;
    this.forDelete = "";
  }

    getAutorNames(autori: Autor[]): string {
    return autori.map(a => `${a.ime} ${a.prezime}`).join(', ');
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (!file.type.startsWith('image/')) {
        this.imageUploadError = 'Molimo odaberite datoteku slike.';
        this.selectedFile = null;
        this.imageUrlPreview = null;
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.imageUploadError = 'Veličina slike ne smije prelaziti 10MB.';
        this.selectedFile = null;
        this.imageUrlPreview = null;
        return;
      }

      this.selectedFile = file;
      this.imageUploadError = null;

      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrlPreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.imageUrlPreview = null;
      this.imageUploadError = null;
    }
  }


  async onSubmit(form: NgForm): Promise<void> {
    if (form.valid) {
        this.isUploadingImage = true;

        if (this.selectedFile) {

            try {
                const uploadResponse = await this.knjigaService.uploadImage(this.selectedFile).toPromise();
                this.selectedKnjiga.slika = uploadResponse.fileDownloadUri;
                console.log('Image uploaded successfully:', this.selectedKnjiga.slika);
                if(this.selectedKnjiga.idKnjiga){
                  console.log(this.forDelete);
                  this.knjigaService.deleteImage(this.forDelete).subscribe();
                }
            } catch (error) {
                console.error('Image upload failed:', error);
                this.imageUploadError = 'Greška pri učitavanju slike. Pokušajte ponovo.';
                this.isUploadingImage = false;
                return;
            }
        }
            this.knjigaService.saveKnjiga(this.selectedKnjiga)
                .subscribe({
                    next: (response) => {
                        console.log('Knjiga updated:', response);
                        this.isUploadingImage = false;
                        this.cancel();
                        this.loadKnjiga();
                    },
                    error: (error) => {
                        console.error('Error updating knjiga:', error);
                        this.imageUploadError = 'Greška pri spremanju knjige.';
                        this.isUploadingImage = false;
                    }
        });
    } 
}

compareById(item1: any, item2: any): boolean {
  console.log('compareById - Item1:', item1, 'Item2:', item2);

  if (item1 === item2) {
    return true;
  }
  if (!item1 || !item2) { 
    return false;
  }

  if (item1.idZanr !== undefined && item2.idZanr !== undefined) {
    return item1.idZanr === item2.idZanr;
  }
  if (item1.idAutor !== undefined && item2.idAutor !== undefined) {
    return item1.idAutor === item2.idAutor;
  }
  if (item1.idTipKnjige !== undefined && item2.idTipKnjige !== undefined) {
    return item1.idTipKnjige === item2.idTipKnjige;
  }
  if (item1.id !== undefined && item2.id !== undefined) {
    return item1.id === item2.id;
  }
  return false;
}

  isZanrEmpty(): boolean {
    return !this.selectedKnjiga.zanr || Object.keys(this.selectedKnjiga.zanr).length === 0;
  }

  isTipKnjigeEmpty(): boolean {
    return !this.selectedKnjiga.tipKnjige || Object.keys(this.selectedKnjiga.tipKnjige).length === 0;
  }


  applyFiltersAndPagination() {
  let filtered = this.knjige;

  filtered = this.knjige.filter(k => {
    return (!this.filterNaslov?.trim() || k.naslov?.toLowerCase().includes(this.filterNaslov.toLowerCase())) &&
           (!this.filterTip || k.tipKnjige?.idTipKnjige === this.filterTip) &&
           (!this.filterZanr || k.zanr?.idZanr === this.filterZanr) &&
           (!this.filterAutor || (Array.isArray(k.autori) && k.autori.some(a => a.idAutor === this.filterAutor))) &&
           (this.filterCijenaMin == null || k.cijena >= this.filterCijenaMin) &&
           (this.filterCijenaMax == null || k.cijena <= this.filterCijenaMax) &&
           (!this.filterDatumBefore || new Date(k.datumIzdanja) <= new Date(this.filterDatumBefore)) &&
           (!this.filterDatumAfter || new Date(k.datumIzdanja) >= new Date(this.filterDatumAfter));
  });

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedKnjige = filtered.slice(startIndex, endIndex);
  this.totalPages= filtered.length>0 ? Math.ceil(filtered.length / this.pageSize) : 1;
  this.currentPage = Math.min(this.currentPage, this.totalPages)
}

nextPage() {
  this.currentPage++;
  this.applyFiltersAndPagination();
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.applyFiltersAndPagination();
  }
}

hasNextPage(): boolean {
  this.applyFiltersAndPagination();
  return this.currentPage < this.totalPages;
}

resetFilters() {
  this.filterNaslov = '';
  this.filterTip = null;
  this.filterZanr = null;
  this.filterAutor = null;
  this.filterCijenaMin = null;
  this.filterCijenaMax = null;
  this.filterDatumBefore = '';
  this.filterDatumAfter = '';
  this.currentPage = 1;
  this.applyFiltersAndPagination();
}

}

