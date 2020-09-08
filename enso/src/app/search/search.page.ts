import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit {
  searches = [];
  searchItem = "";
  suggestionsRef = [];

  constructor(public modalCtrl: ModalController,
              private afStore: AngularFirestore,
              private router: Router,
              public breakpointObserver: BreakpointObserver) {}

  ngOnInit() {

   this.getUsers();
  }

  async getUsers(){
    
    // getting inital searches 
    const userDb3 = await this.afStore.collection(`users`).get() as Observable<any>;
    userDb3.subscribe(snapshot => {
      const len = snapshot.docs.length;
      for (let i = 0; i < 5; i++) {
        let num = Math.floor(Math.random() * len);
        this.suggestionsRef.push(snapshot.docs[num])
      }

      this.suggestionsRef.forEach(doc => {

        if (doc.data().profileImg) {
          this.searches.push({
            searchImg: `https://firebasestorage.googleapis.com/v0/b/enso-4864f.appspot.com/o/${doc.data().profileImg}`,
            searchUsername: doc.data().userName
          });
        } else {
          this.searches.push({
            searchImg: "../../assets/profile-img.jpg",
            searchUsername: doc.data().userName
          });
        }

      })

    })
  }
  

  // search function
  async search(event){
    this.searches = [];
    const input = event.srcElement.value;

    
    // getting search results

    
    const userDb3 = await this.afStore.collection(`users`).get() as Observable<any>;
    userDb3.subscribe(snapshot => {
      const len = snapshot.docs.length;
      snapshot.docs
          .forEach(doc => {
            let searchItem: string;
            searchItem = doc.data().userName;
            
            if (searchItem !== undefined) { 
             if (searchItem.includes(input)) {

              if (doc.data().profileImg) {
                this.searches.push({
                 searchImg: `https://firebasestorage.googleapis.com/v0/b/enso-4864f.appspot.com/o/${doc.data().profileImg}`,
                 searchUsername: doc.data().userName
                   });
              } else {
                this.searches.push({
                searchImg: "../../assets/profile-img.jpg",
                searchUsername: doc.data().userName
                   });
               }    
             } 
            }
            
        });
      });
    }

  goToSearch(sUsername){
    this.dismiss();
    
    this.breakpointObserver
              .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
              .subscribe((state: BreakpointState) => {
                if (state.matches) {
                  this.router.navigate(["/tabs/profile/" + sUsername]);
                } else {
                  this.router.navigate(["/profile/" + sUsername]);
                }
              });
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
}
