import {Component} from '@angular/core';

@Component({
  selector: 'app-contact-skeletons',
  standalone: false,
  template: `
    <div class="space-y-8">
      <div class="h-10 w-full bg-gray-300 rounded {{shimmer}}"></div>
      <div class="h-10 w-full bg-gray-300 rounded {{shimmer}}"></div>
      <div class="h-32 w-full bg-gray-300 rounded {{shimmer}}"></div>
    </div>
    <div class="h-12 w-full bg-gray-300 rounded {{shimmer}} mt-8"></div>
  `
})
export class ContactSkeletonsComponent {
  public shimmer =
    'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

}
