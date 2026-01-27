import {Component} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

  public nombre$!: Observable<string | null>;
  public role$!: Observable<number | null>;

  constructor(public _authService: AuthService) {
    //Comprobamos el estado del nombre
    this.nombre$ = this._authService.nombreUsuario$;
    this.role$ = this._authService.userRole$;
  }

  logout() {
    this._authService.logout();
  }
}
