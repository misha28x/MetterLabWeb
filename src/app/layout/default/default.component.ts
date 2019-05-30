import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as MenuActions from '../../store/actions/menu.actions';

@Component({
	selector: 'app-default',
	templateUrl: './default.component.html',
	styleUrls: ['./default.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  minMenu: Boolean;
  pageTitle: string;

  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  public contentOptions = { axis: 'y', theme: 'minimal-dark', scrollInertia: 200, autoHideScrollbar: true };
  
	constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<Boolean>
  ) { }

	ngOnInit(): void {
		this.onResize();
		this.store.select('menuState').subscribe((menuState: Boolean) => {
			this.minMenu = !menuState;
    });
    this.pageTitle = this.activeRoute.firstChild.data['value']['title'];
    this.getPageTitle();
	}

	@HostListener('window:resize', ['$event'])
	public onResize(): void {
		if (window.innerWidth < 991) {
			this.store.dispatch(new MenuActions.Close());
		} else {
			this.store.dispatch(new MenuActions.Open());
		}
  }
  
  getPageTitle(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activeRoute.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.snapshot && child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          } else {
            return null;
          }
        }
      })
    ).subscribe((pageTitle: any) => {
      this.pageTitle = pageTitle;
    });
  }
}
