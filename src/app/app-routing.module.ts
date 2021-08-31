import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/base/home/home.component";
import {ServicesComponent} from "./components/base/services/services.component";
import {AchievementsComponent} from "./components/base/achievements/achievements.component";
import {ContactComponent} from "./components/base/contact/contact.component";

const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "services", component: ServicesComponent
  },
  {
    path: "achievements", component: AchievementsComponent
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

export const routingComponents = [HomeComponent, ServicesComponent, AchievementsComponent, ContactComponent]
