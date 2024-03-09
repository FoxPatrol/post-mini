import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-copy-to-clipboard-button',
  standalone: true,
  imports: [MatTooltipModule, MatIconModule, MatButtonModule],
  templateUrl: './copy-to-clipboard-button.component.html',
  styleUrl: './copy-to-clipboard-button.component.scss',
})
export class CopyToClipboardButtonComponent {
  @Input({ required: true }) copyTarget?: string;

  copyToClipboard() {
    if (!this.copyTarget) {
      return;
    }

    navigator.clipboard.writeText(this.copyTarget);
  }
}
