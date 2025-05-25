import { Piece } from './piece';

type BoardBuilder<T> = [
  [T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T],
];

export type BoardSquare = {
  readonly rank: number;
  readonly file: number;
  piece: Piece | undefined;
};

export type BoardState = BoardBuilder<BoardSquare>;

export type SideColor = 'white' | 'black';

export function boardInitialState(): BoardState {
  const rankFileArray = Array(8).fill(0);

  const piecesInBoardMap: BoardBuilder<Piece | undefined> = [
    [
      'rook-white',
      'knight-white',
      'bishop-white',
      'queen-white',
      'king-white',
      'bishop-white',
      'knight-white',
      'rook-white',
    ],
    [
      'pawn-white',
      'pawn-white',
      'pawn-white',
      'pawn-white',
      'pawn-white',
      'pawn-white',
      'pawn-white',
      'pawn-white',
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    [
      'pawn-black',
      'pawn-black',
      'pawn-black',
      'pawn-black',
      'pawn-black',
      'pawn-black',
      'pawn-black',
      'pawn-black',
    ],
    [
      'rook-black',
      'knight-black',
      'bishop-black',
      'queen-black',
      'king-black',
      'bishop-black',
      'knight-black',
      'rook-black',
    ],
  ];

  return rankFileArray.map((_, rank) => {
    return rankFileArray.map((_, file) => {
      return {
        rank: rank + 1,
        file: file + 1,
        piece: piecesInBoardMap[rank][file],
      };
    });
  }) as BoardState;
}
