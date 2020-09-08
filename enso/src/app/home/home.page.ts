import { Component, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {


  busy=true;

  constructor( private storage: AngularFireStorage,
               private router: Router ) {}
  ngOnInit() { 
    setTimeout(() => { this.busy = false; }, 4000);
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToAbout() {
    this.router.navigate(['/about']);
  }


}
