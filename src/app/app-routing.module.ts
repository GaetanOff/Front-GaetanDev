import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/base/home/home.component";
import {AchievementsComponent} from "./components/base/achievements/achievements.component";
import {ContactComponent} from "./components/base/contact/contact.component";
import {AboutComponent} from "./components/base/about/about.component";
import {JavapluginsComponent} from "./components/base/achievements/javaplugins/javaplugins.component";

const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "about", component: AboutComponent
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

export const routingComponents = [HomeComponent, AboutComponent, AchievementsComponent, ContactComponent, JavapluginsComponent]
