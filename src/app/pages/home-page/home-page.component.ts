import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class PageHomePageComponent implements OnInit {
	single: any[];
	multi: any[];
	colorScheme: any;

  constructor() { }

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
  }
}
