import { Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

import { BehaviorSubject, map, Observable, pluck } from 'rxjs';

import { BoardMap, GameState } from '../models/game-state.model';
import { Colors } from '../models/colors.enum';
import { Pieces } from '../models/pieces.enum';
import { Move, MoveActions } from '../models/move.model';
import {
  PromoteDialogComponent,
} from '../components/promote-dialog/promote-dialog.component';
import { boardInitialPosition, squareNumber } from '../utils/board';
import { calculateLegalMoves, makeMove, promote } from '../utils/moves';

@Injectable({ providedIn: 'root' })
export class GameService {
  private gameStateSubject = new BehaviorSubject<GameState>({
    board: boardInitialPosition,
    active: Colors.White,
    history: [{
      count: 0,
      from: 0,
      to: 0,
      action: null as unknown as MoveActions,
      state: boardInitialPosition,
    }],
    availableMoves: [],
  });

  constructor(private dialog: Dialog) {
  }

  get activeColor$(): Observable<Colors> {
    return this.gameStateSubject.asObservable()
      .pipe(pluck('active'));
  }

  get availableMoves$(): Observable<Move[]> {
    return this.gameStateSubject.asObservable()
      .pipe(pluck('availableMoves'));
  }

  get selectedSquare$()
    : Observable<{ rank: number, file: number } | null | undefined> {
    return this.gameStateSubject.asObservable()
      .pipe(pluck('selectedSquare'));
  }

  getPieceInSquare$(rank: number, file: number)
    : Observable<[Pieces, Colors] | undefined> {
    const square = squareNumber(rank, file);

    return this.gameStateSubject.asObservable()
      .pipe(map(({ board }) => board.get(square)));
  }

  selectSquare(rank: number, file: number): void {
    let {
      board,
      active,
      history,
      availableMoves,
      selectedSquare,
    } = this.gameStateSubject.value;
    const squareNum = squareNumber(rank, file);

    if (availableMoves.some(move => move.square === squareNum)) {
      const isPawnPromoting = this.checkIsPawnPromoting(
        board,
        squareNumber(selectedSquare!.rank, selectedSquare!.file),
        squareNum,
      );
      if (isPawnPromoting) {
        const dialog = this.dialog.open<Pieces>(
          PromoteDialogComponent,
          {
            disableClose: true,
            data: {
              color: active,
            },
          },
        );

        dialog.closed
          .subscribe(piece => {
            const {
              board,
              active,
              history,
            } = this.gameStateSubject.value;

            const { board: newBoard, entry } = promote(
              board,
              history,
              squareNum,
              piece!,
            );

            this.gameStateSubject.next({
              board: newBoard,
              active,
              history: [...history, entry],
              availableMoves: [],
              selectedSquare: null,
            });
          });
      }

      const { board: newBoard, entry } = makeMove(
        board,
        availableMoves,
        history,
        active,
        squareNum,
        selectedSquare!,
      );
      board = newBoard;
      history = [...history, entry];
      active = active === Colors.White ? Colors.Black : Colors.White;
      availableMoves = [];
      selectedSquare = null;
    } else if (board.get(squareNum)?.[1] === active) {
      selectedSquare = { rank, file };
      availableMoves = calculateLegalMoves(board, history, rank, file);
    } else {
      selectedSquare = null;
      availableMoves = [];
    }

    this.gameStateSubject.next({
      board,
      active,
      history,
      availableMoves,
      selectedSquare,
    });
  }

  private checkIsPawnPromoting(board: BoardMap,
                               selectedSquareNum: number,
                               toSelectSquareNum: number): boolean {
    return ((toSelectSquareNum >= 1 && toSelectSquareNum <= 8)
      || (toSelectSquareNum >= 57 && toSelectSquareNum <= 64))
      && board.get(selectedSquareNum)?.[0] === Pieces.Pawn;
  }
}
