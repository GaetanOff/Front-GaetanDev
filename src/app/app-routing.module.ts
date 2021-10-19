import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/base/home/home.component";
import {AchievementsComponent} from "./components/base/achievements/achievements.component";
import {ContactComponent} from "./components/base/contact/contact.component";
import {AboutComponent} from "./components/base/about/about.component";
import {JavapluginsComponent} from "./components/base/achievements/javaplugins/javaplugins.component";
import {AdminComponent} from "./components/base/admin/admin.component";
import {TrackerComponent} from "./components/base/tracker/tracker.component";
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
  },
  {
    path: "admin", component: AdminComponent
  },
  {
    path: "tracker", component: TrackerComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

export const routingComponents = [HomeComponent, AboutComponent,
  BlogComponent, HowIStartedComponent,
  AchievementsComponent, ContactComponent, JavapluginsComponent, AdminComponent, TrackerComponent]
