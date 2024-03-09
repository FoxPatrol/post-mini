import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-load-from-file-button',
  standalone: true,
  imports: [MatTooltipModule, MatIconModule, MatButtonModule],
  templateUrl: './load-from-file-button.component.html',
  styleUrl: './load-from-file-button.component.scss',
})
export class LoadFromFileButtonComponent {
  @Output() loadedContent: EventEmitter<string> = new EventEmitter<string>();

  uploadFromFile(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement?.files?.[0];

    if (file) {
      const reader = new FileReader();

      // setup copy of content to body on reading file
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        this.loadedContent.emit(fileContent);
      };

      reader.readAsText(file); // load file
    }

    event.target.value = null; // reset file uploaded so it retriggers on uploading same file
  }
}
