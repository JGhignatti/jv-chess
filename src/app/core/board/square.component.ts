import { Component, computed, inject, input } from '@angular/core';

import { PieceComponent } from './piece.component';
import { GameService } from '../game/game.service';
import { getPieceColor } from './piece';

@Component({
  selector: 'jv-square',
  imports: [PieceComponent],
  template: `
    <div
      role="button"
      tabindex="-1"
      class="relative size-full transition-all outline-offset-2 hover:z-10 hover:rounded-sm hover:outline-4 focus-visible:outline-none {{
        isSquareBlack() ? 'outline-green-400' : 'outline-green-500'
      }}"
      [style.cursor]="isPreviewing() ? 'auto' : cursor()"
      (click)="onSquareClick()"
      (keydown)="onSquareKeyboardInteraction($event)"
      (keyup)="onSquareKeyboardInteraction($event)"
    >
      <div
        class="absolute inset-0.5 {{
          isSquareBlack()
            ? 'bg-violet-950 border border-violet-500'
            : 'bg-violet-300'
        }}"
      ></div>

      @if (isPreviewingFrom()) {
        <div
          class="absolute inset-1/12 rounded-lg {{
            isSquareBlack() ? 'bg-yellow-300/20' : 'bg-yellow-600/30'
          }}"
        ></div>
      } @else if (isPreviewingTo()) {
        <div
          class="absolute inset-0.5 flex justify-center items-center overflow-clip"
        >
          <div
            class="size-4/5 rounded-lg shadow-[0_0_0_16px] {{
              isSquareBlack() ? 'shadow-yellow-300/30' : 'shadow-yellow-600/40'
            }}"
          ></div>
        </div>
      }

      @if (isLastRank()) {
        <div
          class="absolute right-1 bottom-1 sm:right-1.5 sm:bottom-1.5 text-xs {{
            isSquareBlack() ? 'text-violet-300' : 'text-violet-950'
          }}"
        >
          {{ 'abcdefgh'[file() - 1] }}
        </div>
      }

      @if (isFirstFile()) {
        <div
          class="absolute left-1 top-1 sm:left-1.5 sm:top-1.5 text-xs {{
            isSquareBlack() ? 'text-violet-300' : 'text-violet-950'
          }}"
        >
          {{ rank() }}
        </div>
      }

      @if (isSquareSelected()) {
        <div
          class="absolute inset-[10%] border-4 sm:border-[6px] border-dashed rounded-full {{
            isSquareBlack() ? 'border-green-400' : 'border-green-600'
          }}"
        ></div>
      }

      @if (piece(); as _piece) {
        <div class="absolute inset-[15%] sm:inset-[10%]">
          <jv-piece [piece]="_piece" />
        </div>
      }

      @if (isAvailableMove()) {
        <div
          class="absolute inset-[40%] bg-green-400 rounded-full border border-green-200"
        ></div>
      }
    </div>
  `,
})
export class SquareComponent {
  rank = input.required<number>();
  file = input.required<number>();
  isLastRank = input.required<boolean>();
  isFirstFile = input.required<boolean>();

  protected readonly isSquareBlack = computed(() => {
    return (this.rank() + this.file()) % 2 === 0;
  });

  private readonly game = inject(GameService);
  protected readonly piece = computed(() => {
    return this.game.viewingBoard()[this.rank() - 1][this.file() - 1].piece;
  });
  protected readonly isSquareSelected = computed(() => {
    const square = this.game.state().selectedSquare.boardSquare;

    return square?.rank === this.rank() && square?.file === this.file();
  });
  protected readonly isAvailableMove = computed(() => {
    return this.game
      .state()
      .selectedSquare.availableMoves.some(
        (move) => move.rank === this.rank() && move.file === this.file(),
      );
  });
  protected readonly cursor = computed(() => {
    const piece = this.piece();

    return this.isAvailableMove() ||
      (piece && getPieceColor(piece) === this.game.sideToPlay())
      ? 'pointer'
      : 'auto';
  });
  private readonly previewingEntry = computed(() => {
    return this.game.state().previewingEntry;
  });
  protected readonly isPreviewing = computed(() => {
    return !!this.previewingEntry();
  });
  protected readonly isPreviewingFrom = computed(() => {
    const previewingEntry = this.previewingEntry();

    return (
      !!previewingEntry &&
      previewingEntry.from.rank === this.rank() &&
      previewingEntry.from.file === this.file()
    );
  });
  protected readonly isPreviewingTo = computed(() => {
    const previewingEntry = this.previewingEntry();

    return (
      !!previewingEntry &&
      previewingEntry.to.rank === this.rank() &&
      previewingEntry.to.file === this.file()
    );
  });

  protected onSquareClick(): void {
    if (this.isPreviewing()) {
      return;
    }

    this.game.selectSquare(this.rank(), this.file(), this.piece());
  }

  protected onSquareKeyboardInteraction(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
    }
  }
}
