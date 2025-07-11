import { Component, OnInit } from '@angular/core';
import { Mjesto } from '../../model/mjesto.model';
import { Knjiznica } from '../../model/knjiznica.model';
import { KnjiznicaService } from '../../services/knjizica-service';
import { MjestoService } from '../../services/mjesto-service';
import { SnackBarService } from '../../services/snack-bar.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-knjiznice',
  standalone: false,
  templateUrl: './knjiznice.component.html',
  styleUrl: '../knjige/knjige.component.css'
})
export class KnjizniceComponent implements OnInit {
  mjesta: Mjesto[] = [];
  knjiznice: Knjiznica[] = [];
  selectedKnjiznica: Knjiznica = this.getEmptyKnjiznica();
  selectedFile: File | null = null;
  imageUrlPreview: string | ArrayBuffer | null = null;
  imageUploadError: string | null = null;
  isUploadingImage: boolean = false;
  forDelete: string ="";

  filterNaziv: string = '';
  filterAdresa: string = '';
  filterMjesto: number | null = null;
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  paginatedKnjiznice: Knjiznica[] = [];


  constructor(private knjiznicaService: KnjiznicaService,
    private mjestoService : MjestoService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loadKnjiznica();
    this.mjestoService.getAll().subscribe(data => {
      this.mjesta = data
    });
  }

  isSlikaValid(): boolean {
  return (this.selectedKnjiznica.idKnjiznica ==null) && (this.selectedFile == null);
  }

getEmptyKnjiznica(): Knjiznica {
  return {
    naziv: '',
    adresa: '',
    slika: '',
    mjesto: {} as Mjesto
  };
}

  loadKnjiznica() {
    this.knjiznicaService.getKnjiznice().subscribe(data =>{ 
      this.knjiznice = data;
      this.applyFiltersAndPagination();
    });
  }

  edit(knjiznica: Knjiznica) {
    this.selectedKnjiznica = { ...knjiznica };
    this.forDelete = knjiznica.slika;
  }


  delete(knjiznica: Knjiznica) {
    if (confirm('Sigurno želite obrisati knjigu?')) {
      if (!knjiznica || !knjiznica.idKnjiznica) {
        console.error('Invalid knjiga object:', knjiznica);
        return;
      }
      this.knjiznicaService.delete(knjiznica.idKnjiznica).subscribe({
                    next: (response) => {
                        this.knjiznicaService.deleteImage(knjiznica.slika).subscribe({
                            next: (deleteResponse) => {
                                console.log('Image deleted successfully:', deleteResponse);
                            },
                            error: (deleteError) => {
                                console.error('Error deleting image:', deleteError);
                                this.snackBar.poruka('Greška pri brisanju slike.');
                            }
                        });
                        this.loadKnjiznica();
                    },
                    error: (error) => {
                        console.error('Error deleting knjiznica:', error);
                        this.snackBar.poruka(error.error);
                    }
        });
      
    }
  }

  cancel() {
    this.selectedKnjiznica = this.getEmptyKnjiznica();
    this.selectedFile = null;
    this.imageUrlPreview = null;
    this.imageUploadError = null;
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
                const uploadResponse = await this.knjiznicaService.uploadImage(this.selectedFile).toPromise();
                this.selectedKnjiznica.slika = uploadResponse.fileDownloadUri;
                console.log('Image uploaded successfully:', this.selectedKnjiznica.slika);
                if(this.selectedKnjiznica.idKnjiznica){
                  console.log(this.forDelete);
                  this.knjiznicaService.deleteImage(this.forDelete).subscribe();
                }
            } catch (error) {
                console.error('Image upload failed:', error);
                this.imageUploadError = 'Greška pri učitavanju slike. Pokušajte ponovo.';
                this.isUploadingImage = false;
                return;
            }
        }
            this.knjiznicaService.saveKnjiznica(this.selectedKnjiznica)
                .subscribe({
                    next: (response) => {
                        console.log('Knjiga updated:', response);
                        this.isUploadingImage = false;
                        this.cancel();
                        this.loadKnjiznica();
                    },
                    error: (error) => {
                        console.error('Error updating knjiznica:', error);
                        this.imageUploadError = 'Greška pri spremanju knjiznica.';
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
  if (item1.idKnjiznica !== undefined && item2.idKnjiznica !== undefined) {
    return item1.idKnjiznica === item2.idKnjiznica;
  }
  if (item1.idMjesto !== undefined && item2.idMjesto !== undefined) {
    return item1.idMjesto === item2.idMjesto;
  }
  return false;
}

isMjestoEmpty(){
  return !this.selectedKnjiznica.mjesto || Object.keys(this.selectedKnjiznica.mjesto).length === 0;
}


  applyFiltersAndPagination() {
  let filtered = this.knjiznice;

  filtered = this.knjiznice.filter(k => {
    return (!this.filterNaziv?.trim() || k.naziv?.toLowerCase().includes(this.filterNaziv.toLowerCase())) &&
           (!this.filterMjesto || k.mjesto?.idMjesto === this.filterMjesto) &&
           (!this.filterAdresa?.trim() || k.adresa?.toLowerCase().includes(this.filterAdresa.toLowerCase()));
  });

  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedKnjiznice = filtered.slice(startIndex, endIndex);
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
  this.filterNaziv = '';
  this.filterAdresa = '';
  this.filterMjesto = null;
  this.currentPage = 1;
  this.applyFiltersAndPagination();
}
}

