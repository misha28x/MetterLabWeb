import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStationNumberComponent } from './change-station-number.component';

describe('ChangeStationNumberComponent', () => {
  let component: ChangeStationNumberComponent;
  let fixture: ComponentFixture<ChangeStationNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeStationNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStationNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
