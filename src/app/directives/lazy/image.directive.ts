import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: 'img'
})
export class ImageDirective {

  constructor({nativeElement}: ElementRef<HTMLImageElement>) {
    const supports = 'loading' in HTMLImageElement.prototype;

    if (supports) {
      nativeElement.setAttribute('loading', 'lazy');
    } else {
      // fallback to IntersectionObserver
    }
  }

}
