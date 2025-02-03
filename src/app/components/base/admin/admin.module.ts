import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AdminComponent} from "./admin.component";
import {AuthComponent} from "./auth/auth.component";
import {WhitelistComponent} from "./whitelist/whitelist.component";
import {AuthGuard} from "../../../guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "auth",
    component: AuthComponent,
  },
  {
    path: "whitelist",
    component: WhitelistComponent,
    canActivate: [AuthGuard]
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule {
}
