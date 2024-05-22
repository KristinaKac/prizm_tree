import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Item } from './app.component';
import { Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  public loadChildren(item: Item): Observable<Item[]> {
    return timer(3000).pipe(
      map(() => 
        item.children!.map((s: Item) => {
         return { id: s.id, name: `${s.name}`, children: s.children!.length === 0 ? null : s.children }})
    ));
  }
 
  public hasChildren({ children }: Item): boolean {
    return !!children;
  }
}
