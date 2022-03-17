import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItemComponent } from './add-item/add-item.component';
import { LoginMenuComponent } from './login-menu/login-menu.component';
import { ItemsComponent } from './main-menu/items/items.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { WishlistComponent } from './main-menu/wishlist/wishlist.component';
import { RegMenuComponent } from './reg-menu/reg-menu.component';

const routes: Routes = [
  {
    path:"",
    component: MainMenuComponent,
    children: [
      {
        path:"",
        component: ItemsComponent
      },
      {
        path:"wishlist",
        component: WishlistComponent
      }
    ]
  },
  {
    path:"login",
    component: LoginMenuComponent
  },
  {
    path:"sign-up",
    component: RegMenuComponent
  },
  {
    path:"add-item",
    component: AddItemComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
