import { Move } from '.';
import { BoardState } from '../board';
import { Piece } from '../board/piece';
import { calculateDiagonalMoves } from './bishop';
import { calculateCrossMoves } from './rook';

export function calculateQueenMoves(
  board: BoardState,
  rank: number,
  file: number,
  piece: Piece,
): Move[] {
  return [
    ...calculateDiagonalMoves(board, rank, file, piece),
    ...calculateCrossMoves(board, rank, file, piece),
  ];
}
