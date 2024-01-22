import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/base/home/home.component";
import {AchievementsComponent} from "./components/base/achievements/achievements.component";
import {ContactComponent} from "./components/base/contact/contact.component";
import {LegalComponent} from "./components/base/legal/legal.component";
import {CgvComponent} from "./components/base/cgv/cgv.component";
import {AboutComponent} from "./components/base/about/about.component";
import {AdminComponent} from "./components/base/admin/admin.component";
import {AuthComponent} from "./components/base/admin/auth/auth.component";
import {WhitelistComponent} from "./components/base/admin/whitelist/whitelist.component";

const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "about",
    loadChildren: () => import('./components/base/about/about.module').then(m => m.AboutModule)
  },
  {
    path: "legal",
    loadChildren: () => import('./components/base/legal/legal.module').then(m => m.LegalModule)
  },
  {
    path: "cgv",
    loadChildren: () => import('./components/base/cgv/cgv.module').then(m => m.CgvModule)
  },
  {
    path: "achievements",
    loadChildren: () => import('./components/base/achievements/achievements.module').then(m => m.AchievementsModule)
  },
  {
    path: "contact",
    loadChildren: () => import('./components/base/contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: "admin",
    loadChildren: () => import('./components/base/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: "admin/auth",
    loadChildren: () => import('./components/base/admin/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: "admin/whitelist",
    loadChildren: () => import('./components/base/admin/whitelist/whitelist.module').then(m => m.WhitelistModule)
  },
  {
    path: "**", component: HomeComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

export const routingComponents = [
  HomeComponent, AboutComponent, ContactComponent, AchievementsComponent, LegalComponent, CgvComponent, AdminComponent,
  AuthComponent, WhitelistComponent
]
