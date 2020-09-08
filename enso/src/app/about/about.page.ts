import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from "firebase";
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private afStore: AngularFirestore,
              private router: Router
              ) { this.add();}

  ngOnInit() { 

  }

  goToLogin() {
    this.router.navigate(['/login']);
  }


  add(){
    // let i =0;
    // while (i<630) {
    //   i++;
      
    //   // this.afStore.doc('posts/EnsoImages%2F1599565735499?alt=media&token=c5bdbf4f-ae35-44b6-b466-136e43d6ea25').update({
    //   //   likes: firestore.FieldValue.arrayUnion(`added${i}`),
    //   // })
    // }
  }

}
