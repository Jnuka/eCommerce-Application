import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CtpApiService } from './data/services/ctp-api.service';
import { AnonymousService } from './anonymous/anonymous.service';
import { AuthService } from './auth/auth.service';
import { UserDataService } from './data/services/user-data.service';

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
  private userDataService = inject(UserDataService);

  public ngOnInit(): void {
    this.ctpApiService.init();
    if (this.authService.isAuth) {
      const login$ = this.userDataService.autoLogin();
      if (login$) {
        login$.subscribe();
      }
    } else if (!this.anonymousService.isAnonymousAuth) {
      this.anonymousService.authenticate().subscribe();
    }
  }
}
