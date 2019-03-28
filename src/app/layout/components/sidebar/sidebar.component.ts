import { Component, OnInit, HostBinding, Input } from '@angular/core';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	@HostBinding('class.sidebar') true;
	@HostBinding('class.min') @Input() min: Boolean;
  @HostBinding('class.open') get getMenuState(): boolean { return !this.min; }
  
  constructor(private authSv: AuthService) { }

  ngOnInit(): void {
  }

  logOut(): void {
    this.authSv.logOut();
  }
}
