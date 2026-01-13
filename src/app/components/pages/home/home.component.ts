import {Component} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  constructor(private _authService: AuthService) { }


  logout() {
    this._authService.logout();
  }

}
