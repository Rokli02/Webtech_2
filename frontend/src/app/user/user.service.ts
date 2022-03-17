import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Subject } from 'rxjs';
import { UserItem } from './useritem.model';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:4000/user';
  private token : string = '';
  private currentUser : User | null = null;
  hasUserChanged: Subject<boolean> = new Subject<boolean>();
  itemFilter: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  getUser() {
    return this.currentUser;
  }

  signup(username: string, email: string, pass: string, gender : string) {
    const userToSignUp = {name: username, email: email, password: pass, gender: gender};
    return lastValueFrom(this.http.post(`${this.baseUrl}/registration`, userToSignUp));
  }

  login(username: string, pass: string) {
    const userToLogin = {name: username, password: pass};
    return lastValueFrom(this.http.post<any>(`${this.baseUrl}/login`,userToLogin)).then((value)=> {
      if(!value.token) {
        return false;
      } else {
        this.token = value.token;
        this.currentUser = {uid: value.uid, name: username, email:value.email, gender: value.gender};
        return true;
      }
    });
  }

  setFilter(filter : string) {
    this.itemFilter.next(filter);
  }

  getItemFilterAsObservable() {
    return this.itemFilter.asObservable();
  }

  getUserItem(filter: string) {
    let header = new HttpHeaders().set('gamepass', this.token);

    return lastValueFrom(this.http.get<UserItem[]>(`${this.baseUrl}/wishlist`, {
      headers: header,
      params : {
        uid : this.currentUser!.uid,
        filter : filter
      }}));
    }

  addUserItemToWishlist(itemId : string) {
    let header = new HttpHeaders().set('gamepass', this.token);

    return lastValueFrom(this.http.post(`${this.baseUrl}/wishlist/add`,{},
    {headers: header,
      params: {
        uid: this.currentUser!.uid,
        id: itemId
      }}));

  }

  private removeUserItem(itemId : string, header: HttpHeaders) {
    return lastValueFrom(this.http.delete(`${this.baseUrl}/wishlist/delete`, {
      headers: header,
      params: {
        uid: this.currentUser!.uid,
        itemId: itemId
      }
    }));
  }

  updateUserItemAmount(userItem : UserItem) {
    let header = new HttpHeaders().set('gamepass', this.token);

    if(userItem.amount <= 0) {
      return this.removeUserItem(userItem.item._id, header);
    }

    return lastValueFrom(this.http.patch(`${this.baseUrl}/wishlist/update/${userItem.amount}`,{}, {
      headers: header,
      params: {
        uid: this.currentUser!.uid,
        itemId: userItem.item._id
      }
    }));
  }


  signOutUser() {
    this.currentUser = null;
    this.token = '';
    this.hasUserChanged.next(false);
  }

  hasUser() : boolean {
    return this.currentUser !== null;
  }

  getUserOnlineObservable() {
    return this.hasUserChanged.asObservable();
  }





}
