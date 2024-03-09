import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DownloadService } from 'app/services/download.service';

@Component({
  selector: 'app-download-to-file-button',
  standalone: true,
  imports: [MatTooltipModule, MatIconModule, MatButtonModule],
  templateUrl: './download-to-file-button.component.html',
  styleUrl: './download-to-file-button.component.scss',
})
export class DownloadToFileButtonComponent {
  @Input({ required: true }) downloadTarget?: string;
  @Input({ required: true }) fileName!: string;

  constructor(public downloadService: DownloadService) {}

  downloadToFile() {
    const body = this.downloadTarget;
    if (!body) {
      return;
    }
    this.downloadService.downloadToFile(body, this.fileName);
  }
}
