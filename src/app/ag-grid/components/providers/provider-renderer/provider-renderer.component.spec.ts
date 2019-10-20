import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderRendererComponent } from './provider-renderer.component';

describe('ProviderRendererComponent', () => {
  let component: ProviderRendererComponent;
  let fixture: ComponentFixture<ProviderRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderRendererComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
