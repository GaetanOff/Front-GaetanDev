import {Component} from '@angular/core';

@Component({
  selector: 'app-add-ip-skeletons',
  template: `
    <div class="h-10 w-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20 {{shimmer}} mb-4"></div>
  `
})
export class AddIpSkeletonsComponent {
  public shimmer =
    'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

}
