import { Move, Square } from '.';
import { BoardState, SideColor } from '../board';
import { getPieceColor, Piece } from '../board/piece';
import { HistoryEntry } from '../game/history';
import { calculateDiagonalMoves } from './bishop';
import { calculateCrossMoves } from './rook';

export function calculateKingMoves(
  board: BoardState,
  history: HistoryEntry[],
  rank: number,
  file: number,
  piece: Piece,
): Move[] {
  const color = getPieceColor(piece);

  const moves = [
    ...calculateDiagonalMoves(board, rank, file, piece, 1),
    ...calculateCrossMoves(board, rank, file, piece, 1),
  ];

  if (checkCanCastle('short', board, history, rank, file, color)) {
    moves.push({
      rank,
      file: file + 2,
      action: 'shortCastle',
    });
  }
  if (checkCanCastle('long', board, history, rank, file, color)) {
    moves.push({
      rank,
      file: file - 2,
      action: 'longCastle',
    });
  }

  return moves;
}

function checkCanCastle(
  type: 'short' | 'long',
  board: BoardState,
  history: HistoryEntry[],
  rank: number,
  file: number,
  color: SideColor,
): boolean {
  const isPieceWhite = color === 'white';
  const kingSquare: Square = {
    rank: isPieceWhite ? 1 : 8,
    file: 5,
  };

  if (rank !== kingSquare.rank || file !== kingSquare.file) {
    return false;
  }

  const inBetweenFiles =
    type === 'short' ? [file + 1, file + 2] : [file - 1, file - 2, file - 3];

  const hasSpace = inBetweenFiles.every((inBetweenFile) => {
    return !board[rank - 1][inBetweenFile - 1].piece;
  });

  const rookSquare: Square = {
    rank: isPieceWhite ? 1 : 8,
    file: 8,
  };
  const kingAndRookNotChanged = history.every((entry) => {
    return (
      entry.board[kingSquare.rank - 1][kingSquare.file - 1].piece &&
      entry.board[rookSquare.rank - 1][rookSquare.file - 1].piece
    );
  });

  return hasSpace && kingAndRookNotChanged;
}
