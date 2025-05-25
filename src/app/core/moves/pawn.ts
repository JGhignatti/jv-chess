import { Move } from '.';
import { BoardSquare, BoardState } from '../board';
import { getPieceColor, getPieceType, Piece } from '../board/piece';
import { HistoryEntry } from '../game/history';

export function calculatePawnMoves(
  board: BoardState,
  history: HistoryEntry[],
  rank: number,
  file: number,
  piece: Piece,
): Move[] {
  const rankIndex = rank - 1;
  const fileIndex = file - 1;
  const color = getPieceColor(piece);
  const isPieceWhite = color === 'white';

  const moves: Move[] = [];

  const initialRank = isPieceWhite ? 2 : 7;
  const rankDelta = isPieceWhite ? 1 : -1;
  if (!board[rankIndex + rankDelta][fileIndex].piece) {
    moves.push({
      rank: rank + rankDelta,
      file,
      action: 'move',
    });

    if (
      rank === initialRank &&
      !board[rankIndex + 2 * rankDelta][fileIndex].piece
    ) {
      moves.push({
        rank: rank + 2 * rankDelta,
        file,
        action: 'move',
      });
    }
  }

  if (file !== 1) {
    const possibleCapturePiece =
      board[rankIndex + rankDelta][fileIndex - 1].piece;

    if (possibleCapturePiece && getPieceColor(possibleCapturePiece) !== color) {
      moves.push({
        rank: rank + rankDelta,
        file: file - 1,
        action: 'capture',
      });
    }
  }

  if (file !== 8) {
    const possibleCapturePiece =
      board[rankIndex + rankDelta][fileIndex + 1].piece;

    if (possibleCapturePiece && getPieceColor(possibleCapturePiece) !== color) {
      moves.push({
        rank: rank + rankDelta,
        file: file + 1,
        action: 'capture',
      });
    }
  }

  const lastEntry = history.at(-1);
  const lastPieceMoved =
    lastEntry &&
    lastEntry.index > 0 &&
    board[lastEntry.to.rank - 1][lastEntry.to.file - 1].piece;
  const oppositeInitialRank = isPieceWhite ? 7 : 2;
  const oppositeRankDelta = isPieceWhite ? -1 : 1;
  if (
    lastEntry &&
    lastPieceMoved &&
    getPieceType(lastPieceMoved) === 'pawn' &&
    lastEntry.action === 'move' &&
    lastEntry.from.rank === oppositeInitialRank &&
    lastEntry.to.rank === oppositeInitialRank + 2 * oppositeRankDelta &&
    lastEntry.to.rank === rank &&
    (lastEntry.to.file === file - 1 || lastEntry.to.file === file + 1)
  ) {
    moves.push({
      rank: oppositeInitialRank + oppositeRankDelta,
      file: lastEntry.to.file,
      action: 'enPassant',
    });
  }

  return moves;
}

export function isPawnPromoting(
  move: Move,
  selectedSquare: BoardSquare,
): boolean {
  return (
    !!selectedSquare.piece &&
    getPieceType(selectedSquare.piece) === 'pawn' &&
    (move.rank === 1 || move.rank === 8)
  );
}
