import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/item/item.model';
import { ItemService } from 'src/app/item/item.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnDestroy {
  private allItems !: Item[];
  private hasUser !: boolean;
  loadingData : boolean = false;
  hasUserSub !: Subscription;
  itemFilterSub !: Subscription;

  constructor(private userService : UserService,
              private itemService : ItemService) { }

  async ngOnInit() {
    this.setItemsLocally('');
    this.itemFilterSub = this.itemService.getItemFilterAsObservable().subscribe(
      (filter) => {
        this.setItemsLocally(filter);
      }
    );

    this.hasUser = this.userService.hasUser();
    this.hasUserSub = this.userService.getUserOnlineObservable().subscribe(
      (value) => {
        this.hasUser = value;
      }
    );
  }

  ngOnDestroy(): void {
    this.hasUserSub.unsubscribe();
    this.itemFilterSub.unsubscribe();
  }

  private async setItemsLocally(filter: string) {
    try {
      this.loadingData = true;
      this.allItems = await this.itemService.getFilteredItems(filter);
    }catch(err) {
      console.log(err);
    }
    this.loadingData = false;
  }

  filteredItems() {
  return this.allItems;
  }

  async addUserItem(itemId: string) {
    try {
      const uii = await this.userService.addUserItemToWishlist(itemId);
      alert('Item added successfully:\n'+uii);
    }catch(err) {
      alert('Item is already added!');
    }
  }

  isUserLoggedIn() : boolean {
    return this.hasUser;
  }
}
