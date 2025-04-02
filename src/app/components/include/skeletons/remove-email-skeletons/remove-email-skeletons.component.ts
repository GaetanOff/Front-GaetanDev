import { Component } from '@angular/core';

@Component({
  selector: 'app-remove-email-skeletons',
  imports: [],
  template: `
    <div class="h-8 w-full bg-gray-300 rounded {{shimmer}} mb-4"></div>
  `
})
export class RemoveEmailSkeletonsComponent {
  public shimmer =
    'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

}
