import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_PAGES } from '../../data/enums/routers';

@Component({
  selector: 'app-main-page',
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent {
  private router = inject(Router);

  public goCatalog(): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG]);
  }
}
