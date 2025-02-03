import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/base/home/home.component";
import {AchievementsComponent} from "./components/base/achievements/achievements.component";
import {ContactComponent} from "./components/base/contact/contact.component";
import {LegalComponent} from "./components/base/legal/legal.component";
import {CgvComponent} from "./components/base/legal/cgv/cgv.component";
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
    component: AboutComponent
  },
  {
    path: "achievements",
    component: AchievementsComponent
  },
  {
    path: "contact",
    component: ContactComponent
  },
  {
    path: "legal",
    loadChildren: () => import('./components/base/legal/legal.module').then(m => m.LegalModule)
  },
  {
    path: "admin",
    loadChildren: () => import('./components/base/admin/admin.module').then(m => m.AdminModule)
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
