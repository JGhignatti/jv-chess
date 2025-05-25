import { Component, computed, inject } from '@angular/core';
import { CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

import { SquareComponent } from './square.component';
import { GameService } from '../game/game.service';

@Component({
  selector: 'jv-board',
  imports: [CdkDropList, CdkDropListGroup, SquareComponent],
  template: `
    <div
      class="grid grid-cols-8 grid-rows-8 border-violet-400/60 border-8 rounded-lg p-1"
      cdkDropListGroup
    >
      @for (
        _ of rankFileArray;
        track $index;
        let rankIndex = $index;
        let lastRank = $last
      ) {
        @for (
          _ of rankFileArray;
          track $index;
          let fileIndex = $index;
          let firstFile = $first
        ) {
          @let rank = isOrientationStandard() ? 8 - rankIndex : rankIndex + 1;
          @let file = isOrientationStandard() ? fileIndex + 1 : 8 - fileIndex;

          <div class="w-full aspect-square" cdkDropList>
            <jv-square
              [rank]="rank"
              [file]="file"
              [isLastRank]="lastRank"
              [isFirstFile]="firstFile"
            />
          </div>
        }
      }
    </div>
  `,
})
export class BoardComponent {
  protected readonly rankFileArray = Array(8).fill(0);

  private readonly game = inject(GameService);
  protected readonly isOrientationStandard = computed(() => {
    return this.game.state().boardOrientation === 'standard';
  });
}
