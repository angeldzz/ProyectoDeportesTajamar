import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {RouterOutlet} from '@angular/router';
import {ColoresService} from '../../../core/services/colores.service';
import {Colores} from '../../../models/Colores';

@Component({
  selector: 'app-panel-administrador',
  imports: [
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './panel-administrador.component.html',
  styleUrl: './panel-administrador.component.css',
})


export class PanelAdministradorComponent implements OnInit {
  numColores!:Number;


  constructor(private _coloresService: ColoresService) {
  }

  ngOnInit() {

    this._coloresService.getColores().subscribe(value => {
      this.numColores = value.length;
    })
  }

}
