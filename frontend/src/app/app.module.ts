import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginMenuComponent } from './login-menu/login-menu.component';
import { RegMenuComponent } from './reg-menu/reg-menu.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ItemCardComponent } from './main-menu/item-card/item-card.component';
import { NavbarComponent } from './main-menu/navbar/navbar.component';
import { ItemsComponent } from './main-menu/items/items.component';
import { WishlistComponent } from './main-menu/wishlist/wishlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddItemComponent } from './add-item/add-item.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginMenuComponent,
    RegMenuComponent,
    MainMenuComponent,
    ItemCardComponent,
    NavbarComponent,
    ItemsComponent,
    WishlistComponent,
    AddItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
