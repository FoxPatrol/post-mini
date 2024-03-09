import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  RequestDataService,
  LoadingState,
} from 'app/services/request-data.service';
import { MatCardModule } from '@angular/material/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatTabsModule } from '@angular/material/tabs';
import { StatusCodeChipComponent } from './status-code-chip/status-code-chip.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CopyToClipboardButtonComponent } from '@components/shared/copy-to-clipboard-button/copy-to-clipboard-button.component';
import { DownloadToFileButtonComponent } from '@components/shared/download-to-file-button/download-to-file-button.component';

@Component({
  selector: 'app-response-card',
  standalone: true,
  imports: [
    CommonModule,
    StatusCodeChipComponent,
    CopyToClipboardButtonComponent,
    DownloadToFileButtonComponent,

    MatCardModule,
    NgxSkeletonLoaderModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  templateUrl: './response-card.component.html',
  styleUrl: './response-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponseCardComponent {
  public LoadingState = LoadingState;

  constructor(public rdService: RequestDataService) {}

  objectToString(obj: object): string {
    return JSON.stringify(obj);
  }

  mapToString(headers: Map<string, string[]>): string {
    const transformedHeaders = Array.from(headers.entries()).map(
      ([key, value]) => {
        return `"${key}": ${value.map((val) => `"${val}"`).join(', ')}`;
      }
    );

    return `{${transformedHeaders.join(', ')}}`;
  }
}
