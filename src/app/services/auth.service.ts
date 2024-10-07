import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { from, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth)
  isLoggedIn = new Subject<boolean>()


  constructor(private router: Router) { }

  initAuthListener() {
    const authUser = getAuth().currentUser
    if(authUser) {
      //console.log(authUser,'True')
      this.isLoggedIn.next(true)
    } else {
      //console.log(authUser,'False')
      this.isLoggedIn.next(false)
    }
  }

  signIn(authUser: any) {
    createUserWithEmailAndPassword(this.firebaseAuth, authUser.email, authUser.password)
    .then(() => {
      this.isLoggedIn.next(true);
      this.router.navigate(['']);
    })
    .catch((err) => console.log(err))
  }

  logIn(authUser: any) {
    signInWithEmailAndPassword(this.firebaseAuth, authUser.email, authUser.password)
    .then(() => {
      this.isLoggedIn.next(true);
      this.router.navigate(['']);
    })
    .catch((err) => console.log(err))
  }

  logOut() {
    this.isLoggedIn.next(false)
    signOut(this.firebaseAuth);
    this.router.navigate(['login'])
  }

  isAuth() {
    const isAuth = getAuth();
    return isAuth
  }

  


}
