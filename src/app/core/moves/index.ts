import { BoardSquare, BoardState, SideColor } from '../board';
import { getPieceColor, getPieceType, Piece } from '../board/piece';
import { createHistoryEntry, HistoryEntry } from '../game/history';
import { calculateBishopMoves } from './bishop';
import { calculateKingMoves } from './king';
import { calculateKnightMoves } from './knight';
import { calculatePawnMoves } from './pawn';
import { calculateQueenMoves } from './queen';
import { calculateRookMoves } from './rook';

export type Square = {
  rank: number;
  file: number;
};

export type Move = Square & {
  action: MoveAction;
};

export type MoveAction =
  | 'move'
  | 'capture'
  | 'enPassant'
  | 'shortCastle'
  | 'longCastle';

export function calculateLegalMovesFor(
  rank: number,
  file: number,
  piece: Piece,
  withOptions: {
    board: BoardState;
    history: HistoryEntry[];
  },
  fullDepth = true,
): Move[] {
  const { board, history } = withOptions;
  const type = getPieceType(piece);

  let moves: Move[] = [];

  switch (type) {
    case 'pawn':
      moves = calculatePawnMoves(board, history, rank, file, piece);
      break;
    case 'knight':
      moves = calculateKnightMoves(board, rank, file, piece);
      break;
    case 'bishop':
      moves = calculateBishopMoves(board, rank, file, piece);
      break;
    case 'rook':
      moves = calculateRookMoves(board, rank, file, piece);
      break;
    case 'queen':
      moves = calculateQueenMoves(board, rank, file, piece);
      break;
    case 'king':
      moves = calculateKingMoves(board, history, rank, file, piece);
      break;
  }

  if (fullDepth) {
    moves = filterPseudoLegalMovesFor(rank, file, piece, {
      board,
      history,
      moves,
    });
  }

  return moves;
}

function filterPseudoLegalMovesFor(
  rank: number,
  file: number,
  piece: Piece,
  withOptions: {
    board: BoardState;
    history: HistoryEntry[];
    moves: Move[];
  },
): Move[] {
  const { board, history, moves } = withOptions;
  const color = getPieceColor(piece);
  const oppositeColor: SideColor = color === 'white' ? 'black' : 'white';

  return moves.filter((move) => {
    const newBoard = makeMove(board, move, {
      rank,
      file,
      piece,
    });
    const newHistory = [
      ...history,
      createHistoryEntry(
        history.at(-1)?.index ?? 0,
        {
          rank,
          file,
        },
        {
          rank: move.rank,
          file: move.file,
        },
        move.action,
        newBoard,
      ),
    ];

    let kingSquare: Square;
    for (const rankRow of newBoard) {
      for (const square of rankRow) {
        if (
          square.piece &&
          getPieceType(square.piece) === 'king' &&
          getPieceColor(square.piece) === color
        ) {
          kingSquare = {
            rank: square.rank,
            file: square.file,
          };
        }
      }
    }

    let isIllegal = false;
    for (const rankRow of newBoard) {
      for (const square of rankRow) {
        if (square.piece && getPieceColor(square.piece) === oppositeColor) {
          const aheadMoves = calculateLegalMovesFor(
            square.rank,
            square.file,
            square.piece,
            {
              board: newBoard,
              history: newHistory,
            },
            false,
          );

          const isCastle =
            move.action === 'shortCastle' || move.action === 'longCastle';
          const castleFileDelta = move.action === 'shortCastle' ? 1 : -1;
          const catchesKingMidwayCastle = aheadMoves.some(
            (aheadMove) =>
              aheadMove.rank === kingSquare.rank &&
              aheadMove.file === kingSquare.file + castleFileDelta,
          );

          if (
            aheadMoves.some(
              (aheadMove) =>
                aheadMove.rank === kingSquare.rank &&
                aheadMove.file === kingSquare.file,
            ) ||
            (isCastle && catchesKingMidwayCastle)
          ) {
            isIllegal = true;
          }
        }
      }
    }

    return !isIllegal;
  });
}

export function makeMove(
  board: BoardState,
  move: Move,
  selectedSquare: BoardSquare,
  extra?: { replace?: Piece },
): BoardState {
  const newBoard = structuredClone(board);

  newBoard[selectedSquare.rank - 1][selectedSquare.file - 1].piece = undefined;
  newBoard[move.rank - 1][move.file - 1].piece =
    extra?.replace || selectedSquare.piece;

  switch (move.action) {
    case 'enPassant': {
      if (selectedSquare.piece) {
        const capturedRank =
          move.rank +
          (getPieceColor(selectedSquare.piece) === 'white' ? -1 : 1);

        newBoard[capturedRank - 1][move.file - 1].piece = undefined;
      }
      break;
    }
    case 'shortCastle': {
      const isPieceWhite = move.rank === 1;
      const rookSquare: Square = {
        rank: isPieceWhite ? 1 : 8,
        file: 8,
      };

      const rookPiece =
        newBoard[rookSquare.rank - 1][rookSquare.file - 1].piece;
      newBoard[rookSquare.rank - 1][rookSquare.file - 1 - 2].piece = rookPiece;
      newBoard[rookSquare.rank - 1][rookSquare.file - 1].piece = undefined;
      break;
    }
    case 'longCastle': {
      const isPieceWhite = move.rank === 1;
      const rookSquare: Square = {
        rank: isPieceWhite ? 1 : 8,
        file: 1,
      };

      const rookPiece =
        newBoard[rookSquare.rank - 1][rookSquare.file - 1].piece;
      newBoard[rookSquare.rank - 1][rookSquare.file - 1 + 3].piece = rookPiece;
      newBoard[rookSquare.rank - 1][rookSquare.file - 1].piece = undefined;
      break;
    }
  }

  return newBoard;
}
