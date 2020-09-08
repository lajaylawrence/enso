import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from "rxjs";
import { UserService } from '../user.service';
import { firestore } from "firebase";
import { Location } from "@angular/common";
import { AngularFireStorage } from '@angular/fire/storage';
import {BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  postId;
  userDb;

  workTitle;
  likes;
  authorName;
  description;
  heartType = 'heart-outline';
  hide;
  hide2;

  found;
  error;


  constructor( private route: ActivatedRoute,
               private router: Router,
               private afStore: AngularFirestore,
               private user: UserService,
               private location: Location,
               private storage: AngularFireStorage,
               public breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
     this.postId = this.route.snapshot.paramMap.get('id');
     this.userAuth();
     this.getData();
  }

  // checking user
  async userAuth() {
    const userDb = await this.afStore.collection(`posts`).get() as Observable<any>;
    userDb.subscribe(snapshot => {
      snapshot.docs
        .forEach(doc => {
          if (doc.id == this.postId) {
              
            if (this.user.getUser() !== undefined) {

              if (doc.data().user == this.user.getUID()) {
                console.log('user is authenticated');
              } else { this.hide = 'hide'; }

            } else { this.hide2 = 'hide'; this.hide = 'hide' }


          }

        });
    });
  }

  // getting data

  async getData(){
    this.userDb = await this.afStore.doc(`posts/${this.postId}`);
    const changes = this.userDb.valueChanges() as Observable<any>;
    changes.forEach((field) => {
      if(field){
      this.workTitle = field.postTitle;
      this.likes = field.likes.length;
      this.authorName = field.author;
      this.description = field.description;
      this.found = 'found';

      this.heartType = field.likes.includes(this.user.getUID()) ? 'heart' : 'heart-outline';
      } else {
        this.error = 'POST NOT FOUND: May have been deleted';
        this.hide = 'hide';
        this.hide2 = "hide2";
      }
    });
  }

  like(){
    if (this.heartType == "heart-outline") {
      this.userDb.update({
        likes: firestore.FieldValue.arrayUnion(this.user.getUID()), 
      });
    } else {
      this.userDb.update({
        likes: firestore.FieldValue.arrayRemove(this.user.getUID()),
      });
    }
  }

  goToProfile(){
    
      this.breakpointObserver
        .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
        .subscribe((state: BreakpointState) => {
          if (state.matches) {
           this.router.navigate(["/tabs/profile/" + this.authorName]);
          } else {
           this.router.navigate(["/profile/" + this.authorName]);
          }
        });    
  }
  
  goBack() {
    this.location.back();
  }

  delete(){
    try {
      // getting users id from service to access their databse
      const uid = this.user.getUID();

      // remove from user db-----------------------
      this.afStore.doc(`users/${uid}`).update({
      posts: firestore.FieldValue.arrayRemove(`${this.postId}`), 
      });
      // remolve form posts db
      this.afStore.doc(`posts/${this.postId}`).delete();
      // remove from storage
      this.storage.storage.refFromURL(`https://firebasestorage.googleapis.com/v0/b/enso-4864f.appspot.com/o/${this.postId}`).delete();

      this.goBack();
    } catch (err) {
      console.log(err);
    }
  }
}
