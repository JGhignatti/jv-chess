import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

import { SideColor } from '.';
import { PieceComponent } from './piece.component';
import { Piece } from './piece';

@Component({
  selector: 'jv-promote-dialog',
  imports: [PieceComponent],
  template: `
    <div
      class="bg-violet-950 rounded-lg py-4 px-6 flex flex-col gap-2 border-2 border-violet-500"
    >
      <h1 class="text-2xl">Promote</h1>

      <div class="flex items-center gap-2">
        @for (piece of pieces; track $index) {
          <button
            class="size-24 rounded-lg border-2 border-violet-500 p-2 cursor-pointer transition-all outline-offset-2 outline-green-400 hover:outline-4 focus-within:outline-4"
            (click)="dialogRef.close(piece)"
          >
            <jv-piece [piece]="piece" />
          </button>
        }
      </div>

      <div>
        <button
          class="px-1 cursor-pointer ml-auto block text-violet-300 rounded-sm transition-all outline-offset-2 outline-green-400 hover:text-violet-400 focus-within:outline-4"
          (click)="dialogRef.close(undefined)"
        >
          ...cancel
        </button>
      </div>
    </div>
  `,
})
export class PromoteDialogComponent {
  private readonly color = inject<{ color: SideColor }>(DIALOG_DATA).color;
  protected readonly pieces: Piece[] = [
    `${'queen'}-${this.color}`,
    `${'rook'}-${this.color}`,
    `${'bishop'}-${this.color}`,
    `${'knight'}-${this.color}`,
  ];

  protected readonly dialogRef = inject<DialogRef<Piece>>(DialogRef);
}
