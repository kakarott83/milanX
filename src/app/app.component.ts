import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PrimeNgModule } from './primeng.module';
import { MenuComponent } from './menu/menu.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, PrimeNgModule, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'milan';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.initAuthListener()
  }


}
