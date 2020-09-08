import { Injectable } from '@angular/core';
import { User, auth } from "firebase";
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: "root",
})
export class UserService {
  // adding a useer object defined from fb
  private user: User; // its private so you will need methods to return its values
  private userName;
  constructor( private afAuth: AngularFireAuth) {}

  setUser(user, username?) {
    this.user = user;
    this.userName = username;
  }
  getUser(){
     return this.user;
   }
  getUID() {
     return this.user.uid;
    
  }

  getEmail() {
    return this.user.email;
  }
  getUsername() {
      return this.userName;
    
  }

  logOut(){
    this.user = undefined;
  }

  // Re authenticating the user so that they can change credentials
  async reAuth(email, password) {
    try {
      return (await this.afAuth.currentUser).reauthenticateWithCredential(
        auth.EmailAuthProvider.credential(email, password)
      ); // inorder to get the crednetional import the suth from firebase/app , then pass this fucntion with email and password
    } catch (error) {
      console.log(error);
    }
  }

  // updating user's password
  async updatePassword(newPassword) {
    return await (await this.afAuth.currentUser).updatePassword(newPassword);
  }

  // updating users email/username4
  async updateEmail(email) {
    return await (await this.afAuth.currentUser).updateEmail(email);
    this.user.email = email;
  }

  updateUsername(username) {
    this.userName = username;
  }
}
