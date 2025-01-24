import { Colors } from '../models/colors.enum';
import { Pieces } from '../models/pieces.enum';
import { BoardMap } from '../models/game-state.model';

export const boardInitialPosition: BoardMap
  = new Map<number, [Pieces, Colors]>([
  [1, [Pieces.Rook, Colors.Black]],
  [2, [Pieces.Knight, Colors.Black]],
  [3, [Pieces.Bishop, Colors.Black]],
  [4, [Pieces.Queen, Colors.Black]],
  [5, [Pieces.King, Colors.Black]],
  [6, [Pieces.Bishop, Colors.Black]],
  [7, [Pieces.Knight, Colors.Black]],
  [8, [Pieces.Rook, Colors.Black]],
  [9, [Pieces.Pawn, Colors.Black]],
  [10, [Pieces.Pawn, Colors.Black]],
  [11, [Pieces.Pawn, Colors.Black]],
  [12, [Pieces.Pawn, Colors.Black]],
  [13, [Pieces.Pawn, Colors.Black]],
  [14, [Pieces.Pawn, Colors.Black]],
  [15, [Pieces.Pawn, Colors.Black]],
  [16, [Pieces.Pawn, Colors.Black]],
  [49, [Pieces.Pawn, Colors.White]],
  [50, [Pieces.Pawn, Colors.White]],
  [51, [Pieces.Pawn, Colors.White]],
  [52, [Pieces.Pawn, Colors.White]],
  [53, [Pieces.Pawn, Colors.White]],
  [54, [Pieces.Pawn, Colors.White]],
  [55, [Pieces.Pawn, Colors.White]],
  [56, [Pieces.Pawn, Colors.White]],
  [57, [Pieces.Rook, Colors.White]],
  [58, [Pieces.Knight, Colors.White]],
  [59, [Pieces.Bishop, Colors.White]],
  [60, [Pieces.Queen, Colors.White]],
  [61, [Pieces.King, Colors.White]],
  [62, [Pieces.Bishop, Colors.White]],
  [63, [Pieces.Knight, Colors.White]],
  [64, [Pieces.Rook, Colors.White]],
]);

export function squareColor(rank: number, file: number): Colors {
  return (file + rank) % 2 === 0 ? Colors.White : Colors.Black;
}

export function squareNumber(rank: number, file: number): number {
  return (rank - 1) * 8 + file;
}

export function rankAndFile(squareNum: number)
  : { rank: number, file: number } | null {
  for (let r = 1; r <= 8; r++) {
    const f = squareNum + 8 - 8 * r;
    if (f >= 1 && f <= 8 && Number.isInteger(f)) {
      return { rank: r, file: f };
    }
  }

  return null;
}
