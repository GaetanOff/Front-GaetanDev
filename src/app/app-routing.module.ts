import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/base/home/home.component";
import {AchievementsComponent} from "./components/base/achievements/achievements.component";
import {ContactComponent} from "./components/base/contact/contact.component";
import {AboutComponent} from "./components/base/about/about.component";
import {JavapluginsComponent} from "./components/base/achievements/javaplugins/javaplugins.component";
import {BlogComponent} from "./components/base/blog/blog.component";
import {HowIStartedComponent} from "./components/base/blog/how-i-started/how-i-started.component";

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
    path: "blog/how_i_started", component: HowIStartedComponent
  },
  {
    path: "achievements", component: AchievementsComponent
  },
  {
    path: "achievements/javaplugins", component: JavapluginsComponent
  },
  {
    path: "contact", component: ContactComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

export const routingComponents = [HomeComponent, AboutComponent, ContactComponent,
  BlogComponent, HowIStartedComponent,
  AchievementsComponent, JavapluginsComponent]
