import { Component, computed, inject } from '@angular/core';

import { BoardComponent } from './core/board/board.component';
import { GameService } from './core/game/game.service';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { ButtonComponent } from './components/button/button.component';
import { HistoryEntry } from './core/game/history';

@Component({
  selector: 'jv-root',
  imports: [BoardComponent, IconButtonComponent, ButtonComponent],
  template: `
    <div class="w-full mx-auto px-4 max-w-[var(--breakpoint-md)]">
      <header class="py-6 flex items-center justify-center gap-2">
        <h1 class="grow flex justify-center text-3xl sm:text-5xl">JV Chess</h1>

        <a
          jv-icon-button
          title="Check on GitHub"
          href="https://github.com/JGhignatti/jv-chess"
          target="_blank"
          class="rounded-lg p-2 bg-zinc-100/5 hover:bg-zinc-100/15 transition-all outline-violet-400 outline-offset-2 focus-visible:outline-2"
        >
          <svg
            class="size-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
      </header>

      <main class="flex flex-col gap-4">
        @if (previewingEntry(); as entry) {
          <div
            class="p-2 flex justify-center items-center gap-1 bg-violet-200 rounded-lg text-zinc-700 text-sm font-semibold"
          >
            <span>Previewing move:</span>
            <span>
              {{ (entry.index % 2 === 0 ? entry.index : entry.index + 1) / 2 }}.
            </span>

            <div
              class="px-1.5 py-0.5 rounded-lg {{
                (entry.index - 1) % 2 === 0
                  ? 'bg-violet-300'
                  : 'bg-violet-950/70 text-white'
              }}"
            >
              {{ entry.notation }}
            </div>

            <button
              class="px-1 underline cursor-pointer ml-2 text-sky-600 rounded-sm transition-all hover:text-sky-500 outline-violet-400 outline-offset-2 focus-visible:outline-2"
              (click)="onClearPreview()"
            >
              Clear
            </button>
          </div>
        }

        <jv-board />

        <div class="flex flex-col rounded-lg bg-zinc-800 gap-2">
          <div class="px-4 pt-2 flex items-center gap-2">
            <span class="block grow">Moves</span>

            @if (canUndo()) {
              <button jv-button size="sm" (click)="onUndoLastMove()">
                <svg
                  class="size-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"
                  />
                </svg>
                <span>Undo</span>
              </button>
            }

            <button jv-button size="sm" (click)="onRestartGame()">
              <svg
                class="size-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                />
              </svg>
              <span>Restart</span>
            </button>

            <button jv-button size="sm" (click)="onInvertBoard()">
              <svg
                class="size-4 rotate-90"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
                />
              </svg>
              <span>Invert board</span>
            </button>
          </div>
          <div class="px-2 pb-2">
            <div
              class="p-1 rounded-lg bg-zinc-600 flex flex-wrap items-center gap-0.5"
            >
              @for (
                entry of history();
                track $index;
                let index = $index;
                let odd = $odd;
                let even = $even
              ) {
                @if (even) {
                  <div class="italic">{{ (entry.index + 1) / 2 }}.</div>
                }

                <button
                  class="px-1.5 py-0.5 rounded-lg cursor-pointer transition-colors inset-shadow-green-500 outline-violet-400 outline-offset-2 focus-visible:outline-2 {{
                    index % 2 === 0
                      ? 'bg-violet-300/30 hover:bg-violet-300/40'
                      : 'bg-violet-950/30 hover:bg-violet-950/40'
                  }}"
                  [class.inset-shadow-[0_0_0_2px]]="
                    previewingEntry()?.index === entry.index
                  "
                  [class.mr-1]="odd"
                  (click)="onPreviewEntry(entry)"
                >
                  {{ entry.notation }}
                </button>
              } @empty {
                <div class="mx-auto py-0.5 text-zinc-400 italic">
                  ...play move...
                </div>
              }
            </div>
          </div>
        </div>
      </main>

      <footer class="py-8 text-center">
        <i>
          JV
          <a
            href="https://github.com/JGhignatti"
            target="_blank"
            class="px-1 text-sky-300 hover:text-sky-200 transition-all rounded-sm outline-violet-400 outline-offset-2 focus-visible:outline-2"
          >
            https://github.com/JGhignatti
          </a>
        </i>
      </footer>
    </div>
  `,
})
export class AppComponent {
  private readonly game = inject(GameService);
  protected readonly history = computed(() => {
    return this.game.state().history.slice(1);
  });
  protected readonly canUndo = computed(() => {
    return this.game.state().history.length > 1;
  });
  protected readonly previewingEntry = computed(() => {
    return this.game.state().previewingEntry;
  });

  protected onInvertBoard(): void {
    this.game.flipBoard();
  }

  protected onRestartGame(): void {
    this.game.restart();
  }

  protected onUndoLastMove(): void {
    this.game.undoLastMove();
  }

  protected onPreviewEntry(entry: HistoryEntry): void {
    this.game.previewHistoryEntry(entry);
  }

  protected onClearPreview(): void {
    this.game.previewHistoryEntry(undefined);
  }
}
