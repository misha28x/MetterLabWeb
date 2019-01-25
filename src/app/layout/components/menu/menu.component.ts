import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { MenuService } from '../../../services/menu.service';
import { IMenuItem } from '../../../interfaces/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @HostBinding('class.main-menu') true;
  @HostBinding('class.min') @Input() min: Boolean;

  menu: Observable<IMenuItem[]>;

  constructor(private menuSv: MenuService) { }

  ngOnInit(): void {
    this.menu = this.getMenu();
  }
  
  getMenu(): Observable<IMenuItem[]> {
    return this.menuSv.getMenu();
  }
}
