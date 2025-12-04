import {Component} from '@angular/core';

@Component({
  selector: 'app-contact-skeletons',
  standalone: true,
  template: `
    <div class="space-y-6">
      <!-- Name field skeleton -->
      <div>
        <div class="h-12 w-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20 {{shimmer}}"></div>
      </div>

      <!-- Email field skeleton -->
      <div>
        <div class="h-12 w-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20 {{shimmer}}"></div>
      </div>

      <!-- Message field skeleton -->
      <div>
        <div class="h-32 w-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20 {{shimmer}}"></div>
      </div>
    </div>
  `
})
export class ContactSkeletonsComponent {
  public shimmer =
    'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

}
