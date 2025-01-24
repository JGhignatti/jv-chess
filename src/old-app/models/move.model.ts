import { BoardMap } from './game-state.model';

export interface Move {
  square: number;
  action: MoveActions;
}

export interface HistoryMove {
  count: number;
  from: number;
  to: number;
  action: MoveActions;
  state: BoardMap;
}

export enum MoveActions {
  Move = 'Move',
  Capture = 'Capture',
  EnPassant = 'EnPassant',
  ShortCastle = 'ShortCastle',
  LongCastle = 'LongCastle',
  Promote = 'Promote',
}
