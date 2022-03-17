import { Injectable, OnInit } from '@angular/core';
import { Item } from './item.model';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { lastValueFrom, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private baseUrl = 'http://localhost:4000/item';
  private defaultImgUrl = "/assets/default.jpg";
  private itemFilter : Subject<string> = new Subject<string>();
  filter : string = '';

  constructor(private http: HttpClient) {}

  addItem(item: Item) : string | any {
    if(!item.imageUrl){
      item.imageUrl = this.defaultImgUrl;
    }

    return lastValueFrom(this.http.post(`${this.baseUrl}/add`, item));
  }

  setFilter(filter: string) {
    this.itemFilter.next(filter);
  }

  getFilteredItems(filter: string) {
    return lastValueFrom(this.http.get<Item[]>(`${this.baseUrl}/`,{params: {filter: filter}}));
  }

  getItemFilterAsObservable() {
    return this.itemFilter.asObservable();
  }
}
