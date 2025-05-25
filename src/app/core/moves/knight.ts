import { Move } from '.';
import { BoardState } from '../board';
import { getPieceColor, Piece } from '../board/piece';

export function calculateKnightMoves(
  board: BoardState,
  rank: number,
  file: number,
  piece: Piece,
): Move[] {
  const possibleMoves: Omit<Move, 'action'>[] = [];

  if (rank <= 6) {
    if (file !== 1) {
      possibleMoves.push({
        rank: rank + 2,
        file: file - 1,
      });
    }

    if (file !== 8) {
      possibleMoves.push({
        rank: rank + 2,
        file: file + 1,
      });
    }
  }

  if (rank >= 3) {
    if (file !== 1) {
      possibleMoves.push({
        rank: rank - 2,
        file: file - 1,
      });
    }

    if (file !== 8) {
      possibleMoves.push({
        rank: rank - 2,
        file: file + 1,
      });
    }
  }

  if (file >= 3) {
    if (rank !== 1) {
      possibleMoves.push({
        rank: rank - 1,
        file: file - 2,
      });
    }

    if (rank !== 8) {
      possibleMoves.push({
        rank: rank + 1,
        file: file - 2,
      });
    }
  }

  if (file <= 6) {
    if (rank !== 1) {
      possibleMoves.push({
        rank: rank - 1,
        file: file + 2,
      });
    }

    if (rank !== 8) {
      possibleMoves.push({
        rank: rank + 1,
        file: file + 2,
      });
    }
  }

  const moves: Move[] = possibleMoves
    .map<Move | undefined>((move) => {
      const pieceInSquare = board[move.rank - 1][move.file - 1].piece;

      if (!pieceInSquare) {
        return {
          ...move,
          action: 'move',
        };
      }

      if (getPieceColor(pieceInSquare) !== getPieceColor(piece)) {
        return {
          ...move,
          action: 'capture',
        };
      }

      return undefined;
    })
    .filter((value): value is Move => {
      return !!value;
    });

  return moves;
}
