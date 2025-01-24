import { Component, Input, OnInit } from '@angular/core';

import { combineLatest, shareReplay } from 'rxjs';

import { GameService } from '../../services/game.service';
import { Colors } from '../../models/colors.enum';
import { Pieces } from '../../models/pieces.enum';
import { MoveActions } from '../../models/move.model';
import { squareNumber } from '../../utils/board';

@Component({
  selector: 'jv-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss'],
})
export class SquareComponent implements OnInit {
  @Input() rank!: number;
  @Input() file!: number;

  square!: [Pieces, Colors] | undefined;
  isActive!: boolean;
  isSelected!: boolean;
  squareAction!: MoveActions | undefined;

  readonly moveActionsEnum = MoveActions;

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    const piece$ = this.gameService.getPieceInSquare$(this.rank, this.file)
      .pipe(shareReplay());

    piece$
      .subscribe(square => this.square = square);

    combineLatest([
      piece$,
      this.gameService.activeColor$,
    ])
      .subscribe(([square, active]) => this.isActive = square?.[1] === active);

    this.gameService.selectedSquare$
      .subscribe(value => {
        if (!value) {
          this.isSelected = false;
        } else {
          this.isSelected = value.rank === this.rank
            && value.file === this.file;
        }
      });

    this.gameService.availableMoves$
      .subscribe(moves => {
        const move = moves
          .find(move => move.square === squareNumber(this.rank, this.file));

        this.squareAction = move?.action;
      });
  }

  get isSelectable(): boolean {
    return this.isActive || !!this.squareAction;
  }

  get imgSrc(): string | null {
    if (!this.square) {
      return null;
    }

    const piece = this.square[0].toLowerCase();
    const color = this.square[1].toLowerCase();

    return `assets/icons/pieces/${ piece }-${ color }.svg`;
  }

  get imgAlt(): string | null {
    if (!this.square) {
      return null;
    }

    const [piece, color] = this.square;

    return `${ piece } ${ color }`;
  }

  get isCapture(): boolean {
    return this.squareAction === MoveActions.Capture
      || this.squareAction === MoveActions.EnPassant;
  }

  get isMove(): boolean {
    return this.squareAction === MoveActions.Move
      || this.squareAction === MoveActions.ShortCastle
      || this.squareAction === MoveActions.LongCastle;
  }

  onSquareClick(): void {
    this.gameService.selectSquare(this.rank, this.file);
  }
}
