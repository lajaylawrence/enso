import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";

import { ModalController } from "@ionic/angular";
import { SearchPage } from "../search/search.page";
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { Router } from '@angular/router';


@Component({
  selector: "app-feed",
  templateUrl: "./feed.page.html",
  styleUrls: ["./feed.page.scss"],
})
export class FeedPage implements OnInit {
  posts = [];
  suggestionsRef = [];
  suggestions = [];

  profileImg = "../../assets/profile-img.jpg";
  username = "username";
  firstName = "Your";
  lastName = "Name";

  // testing = "ntn";

  constructor(public breakpointObserver: BreakpointObserver,
              public modalController: ModalController,
              private afStore: AngularFirestore,
              private user: UserService,
              private router: Router) {}

  ngOnInit() {
    this.getData();
  }

  // // used to navigate based on screen size=====================
  // test() {
  //   this.breakpointObserver
  //     .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
  //     .subscribe((state: BreakpointState) => {
  //       if (state.matches) {
  //         this.testing = "small screen";
  //       } else {
  //         this.testing = "large screen";
  //       }
  //     });
  // }


  // search modal *******************************************

  async searchModal() {
    const modal = await this.modalController.create({
      component: SearchPage,
      cssClass: "searchModal",
      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: false,
    });
    return await modal.present();
  }

  async getData(){

    // getting posts
    const userDb = await this.afStore.collection(`posts`).get() as Observable<any>;
    userDb.subscribe(snapshot => {
      const snap = snapshot.docs.reverse().slice(0, 11);
      snap.forEach(doc => {
          this.posts.push({img: doc.id, author: doc.data().author});
          
        }) 
      })

    // getting suggestions
    const userDb3 = await this.afStore.collection(`users`).get() as Observable<any>;
    userDb3.subscribe(snapshot => {
      const len = snapshot.docs.length;
      for(let i=0; i<4 ; i++){
       let num = Math.floor(Math.random() * len);
       this.suggestionsRef.push(snapshot.docs[num])
      }

      this.suggestionsRef.forEach(doc => {

        if (doc.data().profileImg && doc.data().userName){
          this.suggestions.push({suggestionImg: `https://firebasestorage.googleapis.com/v0/b/enso-4864f.appspot.com/o/${doc.data().profileImg}`,
                                suggestionUsername: doc.data().userName});
        }else {
         this.suggestions.push({suggestionImg:  "../../assets/profile-img.jpg",
                                suggestionUsername: doc.data().userName}); 
        }

        })
        
    })


    // getting profile info
    const userDb2 = await this.afStore.doc(`users/${this.user.getUID()}`);

    const changes = userDb2.valueChanges() as Observable<any>;
    changes.forEach((field) => {
      
      this.username = field.userName;

      if (field.profileImg) {
        this.profileImg = `https://firebasestorage.googleapis.com/v0/b/enso-4864f.appspot.com/o/${field.profileImg}`;
      }

      if (field.profileName) {
        const fullName = field.profileName.split(" ");
        this.firstName = fullName[0];
        this.lastName = fullName[1];
      }
    });
    
     }

    goToPost(postId) {
    this.router.navigate(['/post/' + postId]);
  } 

  goToProfile(){
    this.router.navigate(['/profile/' + this.user.getUsername()]);
  }

  goToSuggestion(sUsername){
    this.router.navigate(['/profile/' + sUsername]);
  }

}
