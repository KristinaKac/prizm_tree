import { Component, Inject } from '@angular/core';
import {
  PRIZM_TREE_LOADER,
  PRIZM_TREE_LOADING,
  PRIZM_TREE_START,
  PrizmHandler,
  PrizmTreeService
} from '@prizm-ui/components';
import { DATA } from '../assets/data';
import { TreeService } from './tree.service';

export interface Item {
  readonly id: string;
  readonly name: string;
  readonly children: Item[] | null;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  providers: [
    PrizmTreeService,
    {
      provide: PRIZM_TREE_START,
      useValue: DATA,
    },
    {
      provide: PRIZM_TREE_LOADER,
      useClass: TreeService,
    }
  ]
})
export class AppComponent {
  title = 'prizm';

  map = new Map<Item, boolean>();
  
  constructor(
    @Inject(PRIZM_TREE_LOADING) readonly loading: unknown,
    @Inject(PrizmTreeService) readonly service: PrizmTreeService<any>
  ) {}
 
  public childrenHandler: PrizmHandler<Item, readonly Item[]> = item =>
   this.service.getChildren(item);
 
  public onToggled(item: Item): void {
    this.service.loadChildren(item);
  }

  readonly getValue = (item: Item, map: Map<Item, boolean>): boolean | null => {
    const flat = flatten(item);
    const result = !!map.get(flat[0]);
    
    for (let i = 0; i < flat.length; i++) {
      if (result !== !!map.get(flat[i])) {        
        return null;
      }
    }
    return result;
  };

  public onChecked(node: Item, value: boolean): void {
    flatten(node).forEach(item => this.map.set(item, value));
    this.map = new Map(this.map.entries());
  }
}

function flatten(item: Item): readonly Item[] {
  if(!item.children) { return [item] }
  return item.children.length !== 0 ? item.children.map(flatten).reduce((arr, item) => [...arr, ...item], []) : [item];
}