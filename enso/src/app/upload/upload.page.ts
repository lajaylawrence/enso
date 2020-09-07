import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { map, finalize } from "rxjs/operators";
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from "firebase";
import { Router } from '@angular/router';
import {BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.page.html",
  styleUrls: ["./upload.page.scss"],
})
export class UploadPage implements OnInit {
  @ViewChild("input") input: ElementRef;

  imageUrl;
  displayUrl;
  file;
  description;
  title;
  error;
  downloadURL: Observable<string>;

  constructor(
    public breakpointObserver: BreakpointObserver,
    private storage: AngularFireStorage,
    private user: UserService,
    private afStore: AngularFirestore,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  selectImage() {
    this.input.nativeElement.click();
  }

  // upload to firestorage

  onFileSelected(event) {
    this.error = "";
    if (this.imageUrl) {
      this.storage.storage.refFromURL(this.imageUrl).delete();
    }

    if (this.imageUrl || !this.imageUrl) {
      this.file = event.target.files[0];
      const n = Date.now();
      const filePath = `RoomsImages/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`RoomsImages/${n}`, this.file);

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe((url) => {
              if (url) {
                this.imageUrl = url;
                this.displayUrl = this.imageUrl.slice(69);
              }
              console.log(this.imageUrl);
            });
          })
        )
        .subscribe((url) => {
          if (url) {
            console.log(url);
          }
        });
      // getting image path
      
    }

    
  }

  // upload to firestore
  upload() {
    this.error = "";
    try{
    // getting users id from service to access their databse
    const uid = this.user.getUID();
    // adding files to users databse-----------------------
    this.afStore.doc(`users/${uid}`).update({
      posts: firestore.FieldValue.arrayUnion(`${this.displayUrl}`), // store each image id inside an array called posts so we can use it as post id as well
    });

    this.afStore.doc(`posts/${this.displayUrl}`).set({
      // adding the post to the post collection, with image id used as the post id
      author: this.user.getUsername(),
      description: this.description,
      likes: [],
      user: uid,
      postTitle: this.title
    });
  } catch(err){
    this.error = err.message;
  }

  if(this.error == ""){
    this.dismiss();
  }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
