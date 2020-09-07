import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UploadPage } from '../upload/upload.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { EditProfilePage } from '../edit-profile/edit-profile.page';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  posts = [];
  subscribe;
  userProfileId;
  hide;
  hide2;
  userProfile;
  error;

  profileImg = '../../assets/profile-img.jpg';
  firstName = 'Your';
  lastName = 'Name';
  username = 'username';

  constructor(
    public modalController: ModalController,
    private afStore: AngularFirestore,
    private user: UserService,
    public breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute
  ) {


  }

  ngOnInit() {
    this.userProfileId = this.route.snapshot.paramMap.get('id');
    this.userAuth();
    this.getData();
  }

  // checking user
  async userAuth() {
    const userDb = await this.afStore.collection(`users`).get() as Observable<any>;
    userDb.subscribe(snapshot => {
      snapshot.docs
        .forEach(doc => {
          if (this.userProfileId === doc.data().userName) {
            this.error = "";
            if (this.user.getUser() !== undefined){

              if (doc.id == this.user.getUID()) {
                console.log('user is authenticated');
              } else { this.hide = 'hide'; }

            } else { this.hide2 = 'hide'; this.hide = 'hide'; }
            

          } 

        });
    });
    }

  async getData() {

    // updating page real time ---------------------------------------------------------------------
    // const userDb = await this.afStore.doc(`users/${this.user.getUID()}`);

    // const changes = userDb.valueChanges() as Observable<any>;
    // changes.forEach((field) => {
    //   this.posts = field.posts;
    //   this.username = field.userName;

    //   if (field.profileImg) {
    //     this.profileImg = `https://firebasestorage.googleapis.com/v0/b/enso-4864f.appspot.com/o/${field.profileImg}`;
    //   }

    //   if (field.profileName) {
    //     const fullName = field.profileName.split(" ");
    //     this.firstName = fullName[0];
    //     this.lastName = fullName[1];
    //   }
    // });

    const userDb = await this.afStore.collection(`users`).valueChanges() as Observable<any>;
    userDb.forEach((doc) => {
      doc.forEach((Doc) => {
        if (this.userProfileId == Doc.userName) {
           this.userProfile = 'found';
           
           this.posts = Doc.posts;
           this.username = Doc.userName;

           if (Doc.profileImg) {
               this.profileImg = `https://firebasestorage.googleapis.com/v0/b/enso-4864f.appspot.com/o/${Doc.profileImg}`;
             }

           if (Doc.profileName) {
               const fullName = Doc.profileName.split(' ');
               this.firstName = fullName[0];
               this.lastName = fullName[1];
             }
         }
      });
      if (this.userProfile !== 'found') {
       this.error = 'USER NOT FOUND';
       this.hide = 'hide'; 
       this.hide2 = "hide2";
       }

  });


  }

  // edit modal
  async editModal() {
    const modal = await this.modalController.create({
      component: EditProfilePage,
      cssClass: 'searchModal',
      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: true,
    });
    return await modal.present();
  }

  // upload modal
  async uploadModal() {
    const modal = await this.modalController.create({
      component: UploadPage,
      cssClass: 'searchModal',
      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: true,
    });
    return await modal.present();
  }

  // NAVIGATION ==================================================================
  // used to navigate based on screen size=====================
  nav() {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.router.navigate(['/tabs/settings']);
        } else {
          this.router.navigate(['/settings']);
        }
      });
  }

  goToPost(postId) {
    this.router.navigate(['/post/' + postId]);
  }

  goToFeed() {
    this.router.navigate(['/feed']);
  }
}
