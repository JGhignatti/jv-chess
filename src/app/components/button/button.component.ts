import { Component, computed, input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[jv-button]',
  template: `
    <ng-content select="svg" />
    <ng-content select="span" />
  `,
  host: {
    '[class.text-sm]': 'isSizeSmall()',
  },
  styles: `
    @reference '../../../styles.css';

    :host {
      @apply flex gap-2 items-center cursor-pointer rounded-lg p-2 bg-zinc-100/5 transition-colors text-white hover:bg-zinc-100/15 outline-violet-400 outline-offset-2 focus-visible:outline-2;
    }
  `,
})
export class ButtonComponent {
  size = input<'md' | 'sm'>('md');

  protected readonly isSizeSmall = computed(() => {
    return this.size() === 'sm';
  });
}
