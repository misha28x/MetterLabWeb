import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeRendererComponent } from './service-type-renderer.component';

describe('ServiceTypeRendererComponent', () => {
  let component: ServiceTypeRendererComponent;
  let fixture: ComponentFixture<ServiceTypeRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceTypeRendererComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypeRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
