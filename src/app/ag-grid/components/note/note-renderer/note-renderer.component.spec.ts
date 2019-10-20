import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteRendererComponent } from './note-renderer.component';

describe('NoteRendererComponent', () => {
  let component: NoteRendererComponent;
  let fixture: ComponentFixture<NoteRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteRendererComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
