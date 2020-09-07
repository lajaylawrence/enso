import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { UserService } from '../user.service';
import {BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";
import { Router } from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';



@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  email;
  password;
  conPassword;
  username;
  error;

  accountAve;

  constructor(private afAuth: AngularFireAuth,
              private user: UserService,
              public breakpointObserver: BreakpointObserver,
              public router: Router,
              private afStore: AngularFirestore) {}

  ngOnInit() {}

  // REGISTRATION ========================================================================
    // check username avilability

  async register() {
    this.accountAve = true;
    const userDb = await this.afStore.collection(`users`).get() as Observable<any>;
    userDb.subscribe(snapshot => {
      snapshot.docs
        .forEach(doc => {
          if (this.username == doc.data().userName) {
             this.accountAve = false;
          }

        });
      if (!this.accountAve) {
        this.error = "Username is already taken";
      } else { this.register2(); }
    });

    }

  async register2() {

  const { email, password, conPassword, username } = this;

    // testing if passwords match, change this to an oninput change event listener
  if (password !== conPassword) {
      this.error = "Passwords dont match";
    } else if(this.username.includes(" ")){
      this.error = "Usernames should have no spaces"
    } else {
    // registerring the user*************
      try {
        const authDb = await this.afAuth.createUserWithEmailAndPassword(email, password);

         // save users information in service  to connect user to database
        this.user.setUser({ email: email, uid: authDb.user.uid}, this.username);
        

        // Bckground triggers
        this.afStore.collection('users').doc(this.user.getUID()).set({
            email: this.user.getEmail(),
            userName: this.username
          });


        this.nav();

        // exception **********************
      } catch (err) {
        this.error = err.message;
      }
    }
  }

  // NAVIGATION ==================================================================
  // used to navigate based on screen size=====================
  nav() {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.router.navigate(["/tabs/profile/" + this.user.getUsername()]);

        } else {
          this.router.navigate(["/profile/" + this.user.getUsername()]);
        }
      });
  }

  toLogin(){
    this.router.navigate(["/login"]);
  }
}
