import { Component, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { KeyValueTableComponent } from './key-value-table/key-value-table.component';
import { RequestDataService } from 'app/services/request-data.service';
import { CopyToClipboardButtonComponent } from '@components/shared/copy-to-clipboard-button/copy-to-clipboard-button.component';
import { LoadFromFileButtonComponent } from '@components/shared/load-from-file-button/load-from-file-button.component';
import { DownloadToFileButtonComponent } from '@components/shared/download-to-file-button/download-to-file-button.component';

type NameValuePair = {
  name: string;
  value: string;
};

@Component({
  selector: 'app-http-request-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    KeyValueTableComponent,
    CopyToClipboardButtonComponent,
    LoadFromFileButtonComponent,
    DownloadToFileButtonComponent,

    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatTabsModule,
    TextFieldModule,
    MatCheckboxModule,
  ],
  templateUrl: './http-request-card.component.html',
  styleUrl: './http-request-card.component.scss',
})
export class HttpRequestCardComponent {
  requestForm: FormGroup;

  initialValue: string | null = null;
  headerCount: number = 0;
  paramCount: number = 0;

  arrayOfNumberOfLines: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private _ngZone: NgZone,
    private rdService: RequestDataService
  ) {
    this.requestForm = this.formBuilder.group({
      verb: ['GET', Validators.required],
      url: [
        'https://echo.hoppscotch.io',
        [Validators.required, this.urlValidator],
      ],
      headers: this.formBuilder.group([]),
      params: this.formBuilder.group([]),
      body: [''],
    });
  }

  //@ts-ignore this is used for the auto resizing ot the text area
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  updateNumberOfLines(event: any): void {
    const text: string = event.target.value;
    if (!text) {
      this.arrayOfNumberOfLines = [];
      return;
    }

    const numberOfLines = text.split('\n').length;
    const arrayNumber = Array.from(
      { length: numberOfLines },
      (_, index) => index + 1
    );
    this.arrayOfNumberOfLines = arrayNumber;
  }

  async sendRequest() {
    const methodInput = this.requestForm.get('verb');
    const urlInput = this.requestForm.get('url');

    if (!methodInput || !urlInput) {
      return;
    }

    const method: string = methodInput.value;
    let url = urlInput.value;

    const headerInput = this.headers;
    const headerFormArray = headerInput.get('array') as FormArray;
    let headers = {};
    if (headerFormArray && headerFormArray.length > 0) {
      headers = this.arrayToDictionary(
        headerFormArray.value as NameValuePair[]
      );
    }

    //const paramInput = this.params;
    //let paramStringFull: string = '';
    //if (paramInput && paramInput.length > 1) {
    //  for (const paramObj of paramInput.value) {
    //    if (!paramObj.name) {
    //      continue;
    //    }
    //
    //    paramStringFull += paramStringFull.length > 0 ? '&' : '?';
    //    const paramString = `${paramObj.name}=${paramObj.value}`;
    //    paramStringFull += paramString;
    //  }
    //}

    const paramInput = this.params;
    const paramFormArray = paramInput.get('array') as FormArray;
    let params = {};
    if (paramFormArray && paramFormArray.length > 0) {
      params = this.arrayToDictionary(paramFormArray.value as NameValuePair[]);
    }

    const body = this.body.value;

    this.rdService.sendRequest(method, url, headers, params, body);
  }

  cleanString(input: string): string {
    // Remove trailing whitespaces and quotes from the start and end
    return input
      .trim()
      .replace(/^['"]|['"]$/g, '')
      .trim();
  }

  arrayToDictionary(headers: NameValuePair[]) {
    const result: { [key: string]: string } = {};

    for (const header of headers) {
      if (!header.name) {
        continue;
      }

      const cleanedHeaderName = this.cleanString(header.name);
      const cleanedHeaderValue = this.cleanString(header.value);
      result[cleanedHeaderName] = cleanedHeaderValue;
    }

    return result;
  }

  paramsToUrl(headers: NameValuePair[]) {
    const result: { [key: string]: string } = {};

    for (const header of headers) {
      if (!header.name) {
        continue;
      }

      const cleanedHeaderName = this.cleanString(header.name);
      const cleanedHeaderValue = this.cleanString(header.value);
      result[cleanedHeaderName] = cleanedHeaderValue;
    }

    return result;
  }

  private urlValidator(control: FormControl) {
    const url = control.value;
    const error = { invalidUrl: true };

    if (!url) {
      return error;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return error;
    }

    return null;
  }

  get headers() {
    return this.requestForm.controls['headers'] as FormGroup;
  }

  get params() {
    return this.requestForm.controls['params'] as FormGroup;
  }

  get body() {
    return this.requestForm.controls['body'];
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  setHeaderCount(count: number) {
    this.headerCount = count;
  }

  setParamCount(count: number) {
    this.paramCount = count;
  }
}
