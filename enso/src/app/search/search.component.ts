import { Component, OnInit } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {

  suggestions = [1, 2, 3];

  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
}
