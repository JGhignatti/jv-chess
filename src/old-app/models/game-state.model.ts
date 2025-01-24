import { Pieces } from './pieces.enum';
import { Colors } from './colors.enum';
import { HistoryMove, Move } from './move.model';

export type BoardMap = Map<number, [Pieces, Colors]>;

export interface GameState {
  board: BoardMap;
  active: Colors;
  history: HistoryMove[];

  availableMoves: Move[];

  selectedSquare?: { rank: number, file: number } | null;
}
