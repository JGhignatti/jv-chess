import { Component, input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[jv-icon-button],a[jv-icon-button]',
  template: `<ng-content select="svg" />`,
  styles: `
    @reference '../../../styles.css';

    :host {
      @apply cursor-pointer rounded-lg p-2 bg-zinc-100/5 transition-colors text-white hover:bg-zinc-100/15 outline-violet-400 outline-offset-2 focus-visible:outline-2;
    }
  `,
  host: {
    title: 'title()',
    '[attr.aria-label]': 'title()',
  },
})
export class IconButtonComponent {
  title = input.required<string>();
}
