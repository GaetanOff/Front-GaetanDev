import { Component, Input } from '@angular/core';

export type SkeletonVariant = 'input' | 'input-small' | 'list' | 'details' | 'text-area' | 'panel';

@Component({
     selector: 'app-skeleton',
     templateUrl: './skeleton.component.html',
})
export class SkeletonComponent {
     @Input() variant: SkeletonVariant = 'input';

     protected readonly shimmer =
          'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';
}
