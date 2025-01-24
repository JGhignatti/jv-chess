import { Pipe, PipeTransform } from '@angular/core';

import { Colors } from '../models/colors.enum';
import { squareColor } from '../utils/board';

@Pipe({ name: 'squareColor' })
export class SquareColorPipe implements PipeTransform {
  transform({ rank, file }: { rank: number, file: number }): Colors {
    return squareColor(rank, file);
  }
}
