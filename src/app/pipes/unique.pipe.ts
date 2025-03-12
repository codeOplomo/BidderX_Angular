import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique',
  standalone: true
})
export class UniquePipe implements PipeTransform {

  transform(items: any[], uniqueKey: string): any[] {
    if (!Array.isArray(items)) {
      return items;
    }
    return items.filter((item, index, self) =>
      index === self.findIndex(t => t[uniqueKey] === item[uniqueKey])
    );
  }

}
