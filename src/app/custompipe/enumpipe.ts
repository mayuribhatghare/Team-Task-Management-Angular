// src/app/shared/pipes/enum-label.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'enumLabel', standalone: true })
export class EnumLabelPipe implements PipeTransform {
  transform(value: number | null, options: { value: number; label: string }[]): string {
    return options.find(o => o.value === value)?.label ?? '';
  }
}
