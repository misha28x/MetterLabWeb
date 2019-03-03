import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SealEditComponent } from './seal-edit.component';

describe('SealEditComponent', () => {
  let component: SealEditComponent;
  let fixture: ComponentFixture<SealEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SealEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SealEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
