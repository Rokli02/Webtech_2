import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/app/item/item.model';
import { UserItem } from 'src/app/user/useritem.model';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {
  @Input() item !: Item;
  @Input() amount !: number;
  @Input() hasUser !: boolean;

  @Output() itemChanged = new EventEmitter<UserItem>();
  @Output() itemToAdd = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  appearOnWishlist() {
    return this.amount !== undefined;
  }

  decreaseAmount() {
    --this.amount;
    this.updateUserItem();
  }

  increaseAmount() {
    ++this.amount;
    this.updateUserItem();
  }

  addAsUserItem() {
    let itemId = this.item._id;
    this.itemToAdd.emit(itemId);
  }

  private updateUserItem() {
    let userItem = {uid: '', item: this.item, amount: this.amount};
    this.itemChanged.emit(userItem);
  }
}
