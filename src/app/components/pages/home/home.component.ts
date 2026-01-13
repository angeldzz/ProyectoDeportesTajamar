import {Component} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  constructor(private _authService: AuthService) { }


  logout() {
    this._authService.logout();
  }

}
