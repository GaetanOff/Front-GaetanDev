import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AuthComponent } from "./auth/auth.component";
import { WhitelistComponent } from "./whitelist/whitelist.component";
import { AuthGuard } from "../../../guards/auth.guard";
import { ProxiesComponent } from "./proxies/proxies.component";
import { DetailserverComponent } from "./proxies/detailserver/detailserver.component";
import { EmailComponent } from "./email/email.component";

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
  {
    path: "email",
    component: EmailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "proxies",
    component: ProxiesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "proxies/details/:id",
    component: DetailserverComponent,
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
