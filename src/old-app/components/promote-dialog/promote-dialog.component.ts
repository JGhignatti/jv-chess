import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

import { Pieces } from '../../models/pieces.enum';
import { Colors } from '../../models/colors.enum';

@Component({
  selector: 'jv-promote-dialog',
  templateUrl: './promote-dialog.component.html',
  styleUrls: ['./promote-dialog.component.scss'],
})
export class PromoteDialogComponent {
  readonly piecesEnum = Pieces;

  private readonly color: Colors;

  constructor(private dialogRef: DialogRef<Pieces>,
              @Inject(DIALOG_DATA) private data: { color: Colors }) {
    this.color = data.color;
  }

  onSelectPiece(piece: Pieces): void {
    this.dialogRef.close(piece);
  }

  getImageSrc(piece: Pieces): string {
    return `assets/icons/pieces/${ piece }-${ this.color }.svg`.toLowerCase();
  }

  getImageAlt(piece: Pieces): string {
    return `${ piece } ${ this.color }`;
  }
}
