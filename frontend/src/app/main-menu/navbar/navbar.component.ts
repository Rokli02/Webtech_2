import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemService } from 'src/app/item/item.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  user !: any;
  hasUser !: boolean;
  hasUserSub !: Subscription;
  profPicPath : string = '';

  constructor(private userService: UserService,
              private itemService: ItemService,
              private router : Router) { }

  ngOnInit() {
    this.user = this.userService.getUser();

    this.hasUser = this.userService.hasUser();
    this.hasUserSub = this.userService.getUserOnlineObservable().subscribe(
      (value) => {
        this.hasUser = value;
      }
    );

    if(this.hasUser){
      this.profPicPath = this.user.gender === 'male' ? '/assets/male.jpg' : '/assets/female.jpg';
    }
  }

  ngOnDestroy() {
        this.hasUserSub.unsubscribe();
  }

  setFilter(filter : string) {
    this.itemService.setFilter(filter);
    this.userService.setFilter(filter);
  }

  logoutUser() {
    this.userService.signOutUser();
    this.hasUser = false;
    this.user = null;
    this.router.navigate(['']);
  }
}
