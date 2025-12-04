import {Routes} from "@angular/router";
import {HomeComponent} from "./components/base/home/home.component";
import {AchievementsComponent} from "./components/base/achievements/achievements.component";
import {ContactComponent} from "./components/base/contact/contact.component";
import {LegalComponent} from "./components/base/legal/legal.component";
import {CgvComponent} from "./components/base/legal/cgv/cgv.component";
import {AboutComponent} from "./components/base/about/about.component";
import {ErrorComponent} from "./components/base/error/error.component";
import {LanguageGuard} from "./guards/language.guard";

export const routes: Routes = [
  {
    path: "",
    canActivate: [LanguageGuard],
    component: HomeComponent
  },
  {
    path: "about",
    canActivate: [LanguageGuard],
    component: AboutComponent
  },
  {
    path: "achievements",
    canActivate: [LanguageGuard],
    component: AchievementsComponent
  },
  {
    path: "contact",
    canActivate: [LanguageGuard],
    component: ContactComponent
  },
  {
    path: "legal",
    canActivate: [LanguageGuard],
    loadChildren: () => import('./components/base/legal/legal.routes').then(m => m.legalRoutes)
  },
  {
    path: "fr",
    canActivate: [LanguageGuard],
    children: [
      {
        path: "",
        component: HomeComponent
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
        loadChildren: () => import('./components/base/legal/legal.routes').then(m => m.legalRoutes)
      }
    ]
  },
  {
    path: "en",
    canActivate: [LanguageGuard],
    children: [
      {
        path: "",
        component: HomeComponent
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
        loadChildren: () => import('./components/base/legal/legal.routes').then(m => m.legalRoutes)
      }
    ]
  },
  {
    path: "admin",
    loadChildren: () => import('./components/base/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: "**",
    component: ErrorComponent
  }
]
