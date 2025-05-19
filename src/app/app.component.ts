import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CtpApiService } from './data/services/ctp-api.service';
import { AnonymousService } from './anonymous/anonymous.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private ctpApiService = inject(CtpApiService);
  private anonymousService = inject(AnonymousService);
  private authService = inject(AuthService);

  public ngOnInit(): void {
    this.ctpApiService.init();
    if (!this.anonymousService.isAnonymousAuth && !this.authService.isAuth) {
      this.anonymousService.authenticate().subscribe();
    }
  }
}
