import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AchievementsComponent} from "./achievements.component";

const routes: Routes = [
  {
    path: '',
    component: AchievementsComponent
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AchievementsModule { }
