import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SideItem} from '../../../models/SideItem';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

  @Input() sideItems!: SideItem[];

}
