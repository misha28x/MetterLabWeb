import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTableComponent } from './ver-table.component';

describe('VerTableComponent', () => {
  let component: VerTableComponent;
  let fixture: ComponentFixture<VerTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
