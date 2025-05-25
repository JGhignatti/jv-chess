import { boardInitialState, BoardState } from '../board';
import { getPieceNotation, getPieceType, Piece } from '../board/piece';
import { MoveAction, Square } from '../moves';

export type HistoryEntry = {
  index: number;
  from: Square;
  to: Square;
  action: MoveAction;
  notation: string;
  board: BoardState;
};

export const initialHistoryEntry: HistoryEntry = {
  index: 0,
  from: {
    rank: -1,
    file: -1,
  },
  to: {
    rank: -1,
    file: -1,
  },
  action: null as unknown as MoveAction,
  notation: null as unknown as string,
  board: boardInitialState(),
};

export function createHistoryEntry(
  lastIndex: number,
  from: Square,
  to: Square,
  action: MoveAction,
  board: BoardState,
  extra?: { replace?: Piece },
): HistoryEntry {
  return {
    index: lastIndex + 1,
    from,
    to,
    action,
    notation: historyEntryToNotation(from, to, action, board, extra),
    board,
  };
}

function historyEntryToNotation(
  from: Square,
  to: Square,
  action: MoveAction,
  board: BoardState,
  extra?: { replace?: Piece },
): string {
  const fileLetter = (file: number): string => {
    return 'abcdefgh'[file - 1];
  };

  const toNotation = `${fileLetter(to.file)}${to.rank}`;

  const piece = board[to.rank - 1][to.file - 1].piece;
  const pieceType = piece ? getPieceType(piece) : null;
  const pieceNotation = piece ? getPieceNotation(piece) : '';

  const promoteTo = extra?.replace;
  if (promoteTo) {
    const promotionNotation = `=${getPieceNotation(promoteTo)}`;

    switch (action) {
      case 'move':
        return `${toNotation}${promotionNotation}`;
      case 'capture':
        return `${fileLetter(from.file)}x${toNotation}${promotionNotation}`;
    }
  }

  switch (action) {
    case 'move':
      return `${pieceNotation}${toNotation}`;
    case 'capture':
      return `${pieceType === 'pawn' ? fileLetter(from.file) : pieceNotation}x${toNotation}`;
    case 'enPassant':
      return `${fileLetter(from.file)}x${toNotation} e.p.`;
    case 'shortCastle':
      return '0-0';
    case 'longCastle':
      return '0-0-0';
  }
}
