import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GUIModule } from '../../forms.module';
import { PrimeNgModule } from '../../primeng.module';
import { Route, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../../model/authUser';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [GUIModule,PrimeNgModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  providers: [MessageService]
})
export class SignInComponent {

  authService = inject(AuthService)

  signInForm = this.fb.group({
    password: [''],
    userName: [''],
    email: ['']
  })

  constructor(private fb: FormBuilder, private router: Router, private msgService: MessageService) {}

  onSubmit() {
    const authUser = {
      email: this.signInForm.value.email,
      password: this.signInForm.value.password
    }
    this.authService.signIn(authUser)
  }





}
