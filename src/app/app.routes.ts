import { Routes } from "@angular/router";
import { HomeComponent } from "./components/base/home/home.component";
import { AchievementsComponent } from "./components/base/achievements/achievements.component";
import { ContactComponent } from "./components/base/contact/contact.component";
import { AboutComponent } from "./components/base/about/about.component";
import { ErrorComponent } from "./components/base/error/error.component";
import { LanguageGuard } from "./guards/language.guard";

const createPublicChildren = (): Routes => [
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
  },
];

export const routes: Routes = [
  ...createPublicChildren().map(route => ({
    ...route,
    canActivate: [LanguageGuard],
  })),
  {
    path: "fr",
    canActivate: [LanguageGuard],
    children: createPublicChildren()
  },
  {
    path: "en",
    canActivate: [LanguageGuard],
    children: createPublicChildren()
  },
  {
    path: "admin",
    loadChildren: () => import('./components/base/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: "**",
    component: ErrorComponent
  }
];
