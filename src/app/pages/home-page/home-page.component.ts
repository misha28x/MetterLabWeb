import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data.service';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class PageHomePageComponent implements OnInit {
	single: any[];
	multi: any[];
	colorScheme: any;
	config: any;
	rows: any[];
	posts: any;

	constructor(private dataSv: DataService) { }

	ngOnInit(): void {
		this.single = [{
			'name': 'Germany',
			'value': 8940000
		},
		{
			'name': 'USA',
			'value': 5000000
		},
		{
			'name': 'France',
			'value': 7200000
		}];

		this.colorScheme = {
			domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
		};

		this.rows = [];

		this.config = {
			sorting: {},
			filtering: {
				filterString: ''
			}
		};

		this.getData();
	}

	getData(): void {
		// const url = 'http://localhost:3000/api/posts';

		// this.posts = this.dataSv.getData(url)
		// .subscribe((postData) => {
		// 	this.posts = postData.posts;
		// });
	}
}
