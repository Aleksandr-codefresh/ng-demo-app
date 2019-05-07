import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({ selector: '[appDropdown]' })
export class DropdownDirective {
  @HostBinding('class.open') private isOpened = false;
  @HostListener('click') toggleOpen(): void {
    this.isOpened = !this.isOpened;
  }
  @HostListener('document:click', ['$event']) onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpened = false;
    }
  }

  constructor(private elRef: ElementRef) {}
}
