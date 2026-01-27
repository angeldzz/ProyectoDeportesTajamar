import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-deporte-evento',
  imports: [],
  templateUrl: './deporte-evento.component.html',
  styleUrl: './deporte-evento.component.css',
})
export class DeporteEventoComponent implements OnInit {
  public isCapitan: boolean=false;
  constructor(private _authService:AuthService) { }

  ngOnInit() {

    if(this._authService.getUserRole() == 5){
      this.isCapitan=true;
    }

  }
}
