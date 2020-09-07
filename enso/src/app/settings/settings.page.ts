import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';


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
  error;
  userDb;

  constructor(private afAuth: AngularFireAuth,
              private user: UserService,
              private afStore: AngularFirestore,
              private router: Router) { }

  ngOnInit() {
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
      
      if(this.newPassword){
      await this.user.updatePassword(this.newPassword);
      }
    } else {

      this.error = "You need to enter your old password";
    }

    try{
    if (this.newEmail !== this.user.getEmail() && this.newEmail !== "") {
      await this.user.updateEmail(this.newEmail); // updates it in authentication
      this.userDb.update({
        email: this.newEmail,
      });
    }
  } catch (err){
    this.error = err.message;
  }

    try {
    if (this.newUsername !== this.user.getUsername() && this.newEmail !== "") {
      await this.user.updateUsername(this.newUsername); // updates it in authentication
      this.userDb.update({
        userName: this.newUsername,
      });
    }
  } catch (err){
    this.error = err.message;
  }

    this.newEmail = "";
    this.newPassword = "";
    this.password = "";
    this.newUsername = "";
    this.error = "";

    this.router.navigate(["/profile/" + this.user.getUsername()]);

  }

  async logout(){
    try{
     await this.afAuth.signOut() ;
     this.router.navigate(["/login"]);
    } catch(err){
      this.error = err.message;
    }
  }

  dismiss(){
    this.router.navigate(["/profile/" + this.user.getUsername()]);
  }
}
