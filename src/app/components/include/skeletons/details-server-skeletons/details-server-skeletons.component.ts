import { Component } from '@angular/core';

@Component({
  selector: 'app-details-server-skeletons',
  imports: [],
  template: `
    <div class="max-w-4xl mx-auto shadow-lg rounded-lg p-8">
      <div class="flex justify-center">
        <div class="h-8 w-1/3 text-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 mb-6 {{ shimmer }}"></div>
      </div>

      <!-- Status -->
      <div class="text-center">
        <div class="h-6 w-1/4 bg-white/10 backdrop-blur-md rounded-full inline-block border border-white/20 {{ shimmer }}"></div>
      </div>

      <!-- Info Cards Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div class="h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 {{ shimmer }}"></div>
        <div class="h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 {{ shimmer }}"></div>
        <div class="h-24 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 {{ shimmer }}"></div>
        <div class="h-24 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 {{ shimmer }}"></div>
        <div class="h-24 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 {{ shimmer }}"></div>
        <div class="h-24 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 {{ shimmer }}"></div>
        <div class="h-24 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 {{ shimmer }}"></div>
        <div class="h-24 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 {{ shimmer }}"></div>
        <div class="h-24 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 col-span-2 {{ shimmer }}"></div>
      </div>

      <!-- Bouton Retour -->
      <div class="mt-8 text-center">
        <div class="h-10 w-1/3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 inline-block {{ shimmer }}"></div>
      </div>
    </div>
  `
})
export class DetailsServerSkeletonsComponent {
  public shimmer =
    'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

}
