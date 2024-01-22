import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {WhitelistComponent} from "./whitelist.component";

const routes: Routes = [
  {
    path: '',
    component: WhitelistComponent
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class WhitelistModule {
}
