import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";
import { Location } from '@angular/common';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  newUsername;
  newEmail;
  password;
  newPassword;
  error="Fields that you don't want to modify can be left blank";
  userDb;

  constructor(private afAuth: AngularFireAuth,
              private user: UserService,
              private afStore: AngularFirestore,
              private router: Router,
              public breakpointObserver: BreakpointObserver,
              private location: Location) { 
                
              }

  ngOnInit() {
    if (this.user.getUser() == undefined){
        this.router.navigate(["/login"]);
    }
  }

  async confirm(){
    try {
    this.userDb = await this.afStore.doc(`users/${this.user.getUID()}`);
    } catch(err){
      this.error = err.message;
    }

    // re authenticating the user

    if (this.password ) {
      try {
        // firebase doesnt allow you to change password if the user has been logged in too log so you have to re authenticate the user
          await this.user.reAuth(this.user.getEmail(), this.password);
        } catch (error) {
        this.error = error.message;
        }
         
      if (this.newPassword){
              try{
              await this.user.updatePassword(this.newPassword);
              this.complete();
              }catch(err){
                this.error = err.message;
              }
           }
         

      if (this.newEmail){
       try{
         if (this.newEmail !== this.user.getEmail()) {
              await this.user.updateEmail(this.newEmail); // updates it in authentication
              this.userDb.update({email: this.newEmail});
              this.complete();
        } else { this.error = "New email is same as your current email or it is badly formatted"}
      } catch (err){
          this.error = err.message;
        }
      }



      if(this.newUsername || this.newUsername !=="" ){
        if (/[A-Z]/.test(this.newUsername) || this.newUsername.includes(" ")) { 
          this.error = "Usernames should not have capital letters or spaces";
        } else { 
            try {
              if (this.newUsername !== this.user.getUsername()) {
                 await this.user.updateUsername(this.newUsername); // updates it in authentication
                 this.userDb.update({userName: this.newUsername,});
                 this.complete();
               }else {
                 this.error = "This is your current username"
                 }
            } catch (err){
                    this.error = err.message;
                 }
           }
      }



    } else {
        this.error = "You need to enter your old password to change another field";
      }
    

  }

  complete(){
    this.newEmail = "";
    this.newPassword = "";
    this.password = "";
    this.newUsername = "";
    this.error = "";

    this.dismiss();
  }

  async logout(){
    try{
     await this.afAuth.signOut() ;
     this.user.logOut();
     this.router.navigate(["/login"]);
    } catch(err){
      this.error = err.message;
    }
  }

  dismiss(){
    
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

  goBack() {
    this.location.back();
  }
}
