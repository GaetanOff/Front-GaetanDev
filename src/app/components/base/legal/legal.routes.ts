import { Routes } from "@angular/router";
import { LegalComponent } from "./legal.component";
import { CgvComponent } from "./cgv/cgv.component";

export const legalRoutes: Routes = [
  {
    path: '',
    component: LegalComponent
  },
  {
    path: "cgv",
    component: CgvComponent
  },
]

