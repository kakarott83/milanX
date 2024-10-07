import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../primeng.module';
import { Sidebar } from 'primeng/sidebar';
import { MenuItem } from 'primeng/api/menuitem';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [PrimeNgModule, NgIf],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {

  @Input() sidebarVisible = false
  @Input() itemsList: MenuItem[] | undefined
  @Output() closeSidebar = new EventEmitter();
  isAuth = false;
  authSubscription!: Subscription

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
      this.authSubscription = this.authService.isLoggedIn.subscribe(authStatus => {
        this.isAuth = authStatus
    })
  }

  close() {
    this.closeSidebar.emit('true')
  }

}
