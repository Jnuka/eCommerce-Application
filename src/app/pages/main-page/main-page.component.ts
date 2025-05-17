import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent {
  private router = inject(Router);

  public async goCatalog(): Promise<void> {
    await this.router.navigate(['catalog']);
  }
}
