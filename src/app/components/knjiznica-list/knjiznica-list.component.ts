import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Knjiznica } from '../../model/knjiznica.model';
import { KnjiznicaService } from '../../services/knjizica-service';

@Component({
  selector: 'app-knjiznica-list',
  standalone: false,
  templateUrl: './knjiznica-list.component.html',
  styleUrl: './knjiznica-list.component.css'
})
export class KnjiznicaListComponent {
  title = 'libraryApp';
  cols: number = 2;
  knjiznice: Knjiznica[] = [];
  colSpan: boolean = true;
  screenWidth: number;
  constructor(private knjiznicaService: KnjiznicaService,private breakpointObserver: BreakpointObserver
    ,private destroyRef: DestroyRef, private cdr: ChangeDetectorRef) {
      this.screenWidth = window.innerWidth;
    }
  ngOnInit(): void {
    console.log('ngOnInit');
    this.knjiznicaService.getKnjiznice().subscribe(data =>{ 
      this.knjiznice = data;
    });
    this.breakpointObserver.observe('(max-width: 900px)')
    .pipe(takeUntilDestroyed(this.destroyRef
    ))
    .subscribe(result => {
      console.log(result);
      if (result.matches) {
        this.cols = 1;
      } else {
        this.cols = 2;
      }
    });


  }

}
