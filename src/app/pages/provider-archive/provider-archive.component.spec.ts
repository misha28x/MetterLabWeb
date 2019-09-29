import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderArchiveComponent } from './provider-archive.component';

describe('ProviderArchiveComponent', () => {
  let component: ProviderArchiveComponent;
  let fixture: ComponentFixture<ProviderArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderArchiveComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
