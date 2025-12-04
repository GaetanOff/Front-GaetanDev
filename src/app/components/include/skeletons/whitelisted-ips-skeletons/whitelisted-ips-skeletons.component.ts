import {Component} from '@angular/core';

@Component({
  selector: 'app-whitelisted-ips-skeletons',
  template: `
    <div>
      <div class="h-8 bg-white/10 backdrop-blur-md rounded-xl mb-2 border border-white/20 {{shimmer}}"></div>
      <div class="h-8 bg-white/10 backdrop-blur-md rounded-xl mb-2 border border-white/20 {{shimmer}}"></div>
      <div class="h-8 bg-white/10 backdrop-blur-md rounded-xl mb-2 border border-white/20 {{shimmer}}"></div>
    </div>
  `
})
export class WhitelistedIpsSkeletonsComponent {
  public shimmer =
    'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

}
