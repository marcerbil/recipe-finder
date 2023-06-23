import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalise'
})
export class NormalisePipe implements PipeTransform {

  transform(value: string): string {
    let result = value.replace(/([A-Z])/g, ' $1').toLowerCase();
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

}
