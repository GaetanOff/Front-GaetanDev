import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/base/home/home.component";
import {AchievementsComponent} from "./components/base/achievements/achievements.component";
import {ContactComponent} from "./components/base/contact/contact.component";
import {LegalComponent} from "./components/base/legal/legal.component";
import {CgvComponent} from "./components/base/cgv/cgv.component";
import {AboutComponent} from "./components/base/about/about.component";

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
  HomeComponent, AboutComponent, ContactComponent, AchievementsComponent, LegalComponent, CgvComponent
]
