import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { LegalComponent } from "./legal.component";
import { CgvComponent } from "./cgv/cgv.component";

const routes: Routes = [
  {
    path: '',
    component: LegalComponent
  },
  {
    path: "cgv",
    component: CgvComponent
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LegalModule {
}
