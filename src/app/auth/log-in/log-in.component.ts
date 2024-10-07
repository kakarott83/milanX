import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GUIModule } from '../../forms.module';
import { PrimeNgModule } from '../../primeng.module';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [GUIModule, PrimeNgModule, RouterModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
  providers: [MessageService]
})
export class LogInComponent {

  authService = inject(AuthService)

  logInForm = this.fb.group({
    password: [''],
    email: ['']
  })

  constructor(private fb: FormBuilder, private router: Router, private msgService: MessageService) {}

  onSubmit() {
    const authUser = {
      email: this.logInForm.value.email,
      password: this.logInForm.value.password
    }
    this.authService.logIn(authUser)



  }

}
