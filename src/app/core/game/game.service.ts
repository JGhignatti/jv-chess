import { computed, inject, Injectable, signal } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

import {
  createHistoryEntry,
  HistoryEntry,
  initialHistoryEntry,
} from './history';
import { calculateLegalMovesFor, makeMove, Move } from '../moves';
import { BoardSquare, SideColor } from '../board';
import { getPieceColor, Piece } from '../board/piece';
import { isPawnPromoting } from '../moves/pawn';
import { PromoteDialogComponent } from '../board/promote-dialog.component';

type GameState = {
  history: HistoryEntry[];
  boardOrientation: 'standard' | 'inverted';
  selectedSquare: {
    boardSquare: BoardSquare | undefined;
    availableMoves: Move[];
  };
  previewingEntry: HistoryEntry | undefined;
};

const initialState: GameState = {
  history: [initialHistoryEntry],
  boardOrientation: 'standard',
  selectedSquare: {
    boardSquare: undefined,
    availableMoves: [],
  },
  previewingEntry: undefined,
};

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly _state = signal<GameState>(initialState);
  readonly state = this._state.asReadonly();
  readonly board = computed(() => {
    return this.state().history.at(-1)?.board ?? initialHistoryEntry.board;
  });
  readonly viewingBoard = computed(() => {
    return this.state().previewingEntry?.board ?? this.board();
  });
  readonly sideToPlay = computed<SideColor>(() => {
    return (this.state().history.at(-1)?.index ?? 0) % 2 === 0
      ? 'white'
      : 'black';
  });

  private readonly lastIndex = computed(() => {
    return this._state().history.at(-1)?.index ?? 0;
  });

  private readonly dialog = inject(Dialog);

  flipBoard(): void {
    this._state.update((state) => {
      return {
        ...state,
        boardOrientation:
          state.boardOrientation === 'standard' ? 'inverted' : 'standard',
      };
    });
  }

  restart(): void {
    this._state.set(initialState);
  }

  undoLastMove(): void {
    this._state.update((state) => {
      return {
        ...state,
        history: state.history.slice(0, -1),
        selectedSquare: {
          boardSquare: undefined,
          availableMoves: [],
        },
      };
    });
  }

  selectSquare(rank: number, file: number, piece: Piece | undefined): void {
    const move = this.state().selectedSquare.availableMoves.find(
      (move) => move.rank === rank && move.file === file,
    );
    if (move) {
      this.registerMove(move);
    } else if (piece && this.sideToPlay() === getPieceColor(piece)) {
      this.selectValidPiece(rank, file, piece);

      return;
    }

    this._state.update((state) => {
      return {
        ...state,
        selectedSquare: {
          boardSquare: undefined,
          availableMoves: [],
        },
      };
    });
  }

  previewHistoryEntry(entry: HistoryEntry | undefined): void {
    this._state.update((state) => {
      return {
        ...state,
        previewingEntry: entry,
      };
    });
  }

  private selectValidPiece(rank: number, file: number, piece: Piece) {
    const availableMoves = calculateLegalMovesFor(rank, file, piece, {
      board: this.board(),
      history: this._state().history,
    });

    this._state.update((state) => {
      return {
        ...state,
        selectedSquare: {
          boardSquare: {
            rank,
            file,
            piece,
          },
          availableMoves,
        },
      };
    });
  }

  private registerMove(move: Move): void {
    const selectedSquare = this.state().selectedSquare.boardSquare;
    if (!selectedSquare) {
      return;
    }

    if (isPawnPromoting(move, selectedSquare)) {
      const promotionDialogRef = this.dialog.open<Piece>(
        PromoteDialogComponent,
        {
          disableClose: true,
          data: {
            color: this.sideToPlay(),
          },
        },
      );

      promotionDialogRef.closed.subscribe((piece) => {
        if (!piece) {
          return;
        }

        this._registerMove(move, selectedSquare, { replace: piece });
      });
    } else {
      this._registerMove(move, selectedSquare);
    }
  }

  private _registerMove(
    move: Move,
    selectedSquare: BoardSquare,
    extra?: { replace?: Piece },
  ): void {
    const newBoard = makeMove(this.board(), move, selectedSquare, extra);
    const newEntry = createHistoryEntry(
      this.lastIndex(),
      {
        rank: selectedSquare.rank,
        file: selectedSquare.file,
      },
      {
        rank: move.rank,
        file: move.file,
      },
      move.action,
      newBoard,
      extra,
    );

    this._state.update((state) => {
      return {
        ...state,
        history: [...state.history, newEntry],
      };
    });
  }
}
