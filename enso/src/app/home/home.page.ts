import { Component, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {

 @ViewChild('input') input: ElementRef;
  
  url;
  file;
  downloadURL: Observable<string>;

  constructor( private storage: AngularFireStorage) {}
  ngOnInit() {}

  
  onFileSelected(event) {
     this.file = event.target.files[0];
    
  }

  selectImage(){
    this.input.nativeElement.click();
  }



  upload(){
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
              this.url = url;
            }
            console.log(this.url);
          });
        })
      )
      .subscribe((url) => {
        if (url) {
          console.log(url);
        }
      });


  }




}
