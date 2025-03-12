import { Component } from '@angular/core';

@Component({
  selector: 'app-corrector-text-skeletons',
  standalone: false,
  template: `
    <div class="h-40 w-full bg-gray-300 rounded-lg relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"></div>
  `
})
export class CorrectorTextSkeletonsComponent {
  public shimmer =
    'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

}
