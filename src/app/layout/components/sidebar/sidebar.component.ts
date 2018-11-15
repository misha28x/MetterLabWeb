import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

	@HostBinding('class.sidebar') true;
	@HostBinding('class.min') @Input() min: Boolean;
	@HostBinding('class.open') get getMenuState(): boolean { return !this.min; }
  constructor() { }

  ngOnInit(): void {
  }
}
