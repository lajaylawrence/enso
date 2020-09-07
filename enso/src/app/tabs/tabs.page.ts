import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.page.html",
  styleUrls: ["./tabs.page.scss"],
})
export class TabsPage implements OnInit {
  username;

  constructor(private user: UserService) {}

  ngOnInit() {
    this.username = this.user.getUsername();
  }
}
