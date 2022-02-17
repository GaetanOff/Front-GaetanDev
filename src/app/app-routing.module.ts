import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/base/home/home.component";
import {AchievementsComponent} from "./components/base/achievements/achievements.component";
import {ContactComponent} from "./components/base/contact/contact.component";
import {AboutComponent} from "./components/base/about/about.component";
import {BlogComponent} from "./components/base/blog/blog.component";
import {HowIStartedComponent} from "./components/base/blog/how-i-started/how-i-started.component";
import {LegalComponent} from "./components/base/legal/legal.component";
import {CgvComponent} from "./components/base/cgv/cgv.component";

const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "about", component: AboutComponent
  },
  {
    path: "blog", component: BlogComponent
  },
  {
    path: "legal", component: LegalComponent
  },
  {
    path: "cgv", component: CgvComponent
  },
  {
    path: "blog/how_i_started", component: HowIStartedComponent
  },
  {
    path: "achievements", component: AchievementsComponent
  },
  {
    path: "contact", component: ContactComponent
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
  HomeComponent, AboutComponent, ContactComponent, AchievementsComponent, LegalComponent, CgvComponent,
  BlogComponent, HowIStartedComponent
]
