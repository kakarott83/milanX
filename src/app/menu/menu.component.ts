import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimeNgModule } from '../primeng.module';
import { MenuItem } from 'primeng/api';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MaterialModule, PrimeNgModule, SidenavComponent,NgIf, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, OnDestroy {

  items: MenuItem[] | undefined;
  showSidebar = false;
  isAuth = false;
  authSubscription!: Subscription

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {

    console.log('Init')

    this.authSubscription = this.authService.isLoggedIn.subscribe(authStatus => {
      this.isAuth = authStatus
    })

    this.items = [
      {
        label: 'Home',
        icon: 'fas fa-user',
        routerLink: '',
        command: () => {
          this.router.navigate([''])
        }
      },
      {
        label: 'Reise',
        icon: 'fas fa-plane-departure',
        routerLink: '/travel',
        command: () => {
          this.router.navigate(['/travel'])
        }
      }
    ]
  }

  logOut() {
    this.authService.logOut()
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe()
  }

  isClosed() {
    console.log('Close')
  }

  

}
