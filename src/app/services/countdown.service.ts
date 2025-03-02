import { Injectable } from '@angular/core';
import { share, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {
  private tickSource = new Subject<void>();
  public tick$ = this.tickSource.asObservable().pipe(share());

  constructor() {
    setInterval(() => this.tickSource.next(), 1000);
  }
}
