import { SideColor } from '.';

export type PieceType =
  | 'pawn'
  | 'knight'
  | 'bishop'
  | 'rook'
  | 'queen'
  | 'king';

export type Piece = `${PieceType}-${SideColor}`;

export function getPieceType(piece: Piece): PieceType {
  return piece.split('-')[0] as PieceType;
}

export function getPieceColor(piece: Piece): SideColor {
  return piece.split('-')[1] as SideColor;
}

export function getPieceNotation(piece: Piece): string {
  switch (getPieceType(piece)) {
    case 'pawn':
      return '';
    case 'knight':
      return 'N';
    case 'bishop':
      return 'B';
    case 'rook':
      return 'R';
    case 'queen':
      return 'Q';
    case 'king':
      return 'K';
  }
}
