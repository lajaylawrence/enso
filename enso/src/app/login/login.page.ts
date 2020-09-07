import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { UserService } from '../user.service';
import {BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";
import { Router } from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email;
  password;
  error;
  username;
  authDb;

 
  constructor(private afAuth: AngularFireAuth,
              private user: UserService,
              public breakpointObserver: BreakpointObserver,
              public router: Router,
              private afStore: AngularFirestore,
              ) {}

  ngOnInit() {}

  // LOGIN ========================================================================

  async login() {

    this.error = "";
    const { email, password } = this;

  
   
      // Login the user*************
    try {
        this.authDb = await this.afAuth.signInWithEmailAndPassword(email, password);

        // getting username
        
        const userDb = await this.afStore.collection(`users`).get() as Observable<any>;
        userDb.subscribe(snapshot => {
        snapshot.docs
          .forEach(doc => {
            if (doc.id == this.authDb.user.uid) {
              
              if (doc.data().userName == this.username && doc.data().email == this.email ) {
              this.setUser();
              this.nav();
            }else{ this.error = "Incorrect username or email"}

          }
        });
    });
        
      


        

        // exception **********************
      } catch (err) {
        this.error = err.message;
      }

  }

  setUser(){
    this.user.setUser({ email: this.email, uid: this.authDb.user.uid }, this.username);
    
  }

  // NAVIGATION ==================================================================
  // used to navigate based on screen size=====================
  nav() {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.router.navigate(["/tabs/feed"]);

        } else {
          this.router.navigate(["/feed"]);
        }
      });
  }

  async resetPassword(){
    this.error = "";

    if(this.email){
      try{
     await this.afAuth.sendPasswordResetEmail(this.email);
     this.error = "Check your email for a reset link";

      }catch (err){ this.error = err.message;}
    }else {
      this.error = "Please enter your email then click \" Forgot password\" ";
    }
  }

  toRegister(){
    this.router.navigate(["/register"]);
  }

  






}
