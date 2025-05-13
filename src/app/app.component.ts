import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CtpApiService } from './data/services/ctp-api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private title = 'coffee-shop';
  private ctpApiService = inject(CtpApiService);

  public ngOnInit(): void {
    this.ctpApiService.init();
  }
}
