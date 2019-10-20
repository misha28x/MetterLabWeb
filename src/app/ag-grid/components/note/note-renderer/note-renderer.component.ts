import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-note-renderer',
  templateUrl: './note-renderer.component.html',
  styleUrls: ['./note-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteRendererComponent {
  note: string;

  agInit(params: any): void {
    this.note = params.value;
  }
}
