import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
	pageTitle: string;

  constructor(private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
		this.pageTitle = this.activeRoute.firstChild.data['value']['title'];
		this.getPageTitle();
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
