import {Component, Input, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SideItem} from '../../../models/SideItem';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {

  @Input() sideItems!: SideItem[];

  ngOnInit() {
    this.updateSidebarState();
    window.addEventListener('resize', () => {
      this.updateSidebarState();
    });
  }
  sidebarOpen = true;
  updateSidebarState() {
    if (window.innerWidth >= 992) {
      // Desktop → siempre visible
      this.sidebarOpen = true;
    } else {
      // Mobile → cerrado por defecto
      this.sidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth < 992) {
      this.sidebarOpen = false;
    }
  }
}
