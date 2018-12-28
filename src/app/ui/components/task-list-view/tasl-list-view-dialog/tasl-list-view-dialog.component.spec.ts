import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaslListViewDialogComponent } from './tasl-list-view-dialog.component';

describe('TaslListViewDialogComponent', () => {
  let component: TaslListViewDialogComponent;
  let fixture: ComponentFixture<TaslListViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaslListViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaslListViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
