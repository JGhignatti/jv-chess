import { Move, Square } from '.';
import { BoardState } from '../board';
import { getPieceColor, Piece } from '../board/piece';

export function calculateRookMoves(
  board: BoardState,
  rank: number,
  file: number,
  piece: Piece,
): Move[] {
  return calculateCrossMoves(board, rank, file, piece);
}

export function calculateCrossMoves(
  board: BoardState,
  rank: number,
  file: number,
  piece: Piece,
  limit = 7,
): Move[] {
  const moves: Move[] = [];

  const directionDeltas: Square[] = [
    {
      rank: 1,
      file: 0,
    },
    {
      rank: 0,
      file: 1,
    },
    {
      rank: -1,
      file: 0,
    },
    {
      rank: 0,
      file: -1,
    },
  ];

  directionDeltas.forEach((dirDelta) => {
    let count = 0;
    let curRank = rank;
    let curFile = file;
    do {
      const newRank = curRank + dirDelta.rank;
      const newFile = curFile + dirDelta.file;

      if (newRank < 1 || newRank > 8 || newFile < 1 || newFile > 8) {
        break;
      }

      const possibleCapturePiece = board[newRank - 1][newFile - 1].piece;

      if (possibleCapturePiece) {
        if (getPieceColor(possibleCapturePiece) !== getPieceColor(piece)) {
          moves.push({
            rank: newRank,
            file: newFile,
            action: 'capture',
          });
        }

        break;
      }

      moves.push({
        rank: newRank,
        file: newFile,
        action: 'move',
      });

      curRank = newRank;
      curFile = newFile;

      count += 1;
    } while (count < limit);
  });

  return moves;
}
