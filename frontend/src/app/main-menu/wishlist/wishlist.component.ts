import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserItem } from 'src/app/user/useritem.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit, OnDestroy {
  userItems : UserItem[] = [];
  private hasUser !: boolean;
  loadingData : boolean = false;
  hasUserSub !: Subscription;
  itemFilterSub !: Subscription;

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.hasUser = this.userService.hasUser();
    this.hasUserSub = this.userService.getUserOnlineObservable().subscribe(
      (value) => {
        this.hasUser = value;
      }
    );
    if(!this.hasUser) {
      this.router.navigate(['']);
    } else {
      this.filteredItems('');
      this.itemFilterSub = this.userService.getItemFilterAsObservable().subscribe(
        (filter) => {
          this.filteredItems(filter);
        }
      );
    }
  }

  ngOnDestroy() {
    this.hasUserSub.unsubscribe();
    this.itemFilterSub.unsubscribe();
  }

  async filteredItems(filter: string) {
    try {
      this.loadingData = true;
      this.userItems = await this.userService.getUserItem(filter);
    } catch(err) {}
    this.loadingData = false;
  }

  isUserLoggedIn() : boolean {
    return this.hasUser;
  }

  async updateUserItem(userItem : UserItem) {
    try {
      const result = await this.userService.updateUserItemAmount(userItem);
      if(!result){

        return;
      }
      this.updateUserItemLocally(userItem);

    }catch(err) {
      console.log('Error during update\n'+(err as Error).stack);
    }
  }

  private updateUserItemLocally(userItem : UserItem) {
    let index = this.userItemIndex(userItem);
    if(index < 0){
      console.log('Item is not on the wishlist!');
      return;
    }
    if(userItem.amount <= 0){
      this.userItems.splice(index, 1);
      return;
    }
    this.userItems[index].amount = userItem.amount;
  }

  private userItemIndex(userItem: UserItem) : number {
    let index : number = -1;

    for(let i = 0; i < this.userItems.length; i++) {
      if(this.userItems[i].item._id == userItem.item._id){
        index = i;
        break;
      }
    }

    return index;
  }
}
