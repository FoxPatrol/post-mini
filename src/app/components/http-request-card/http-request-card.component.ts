import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan/ui-card-helm';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnTabsContentDirective,
  BrnTabsDirective,
  BrnTabsListDirective,
  BrnTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-brain';
import {
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';

enum LoadingState {
  Default,
  Loading,
  Loaded,
  Error,
}

type Header = {
  name: string;
  value: string;
};

@Component({
  selector: 'app-http-request-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmInputDirective,
    HlmButtonDirective,

    BrnTabsDirective,
    BrnTabsContentDirective,
    BrnTabsListDirective,
    BrnTabsTriggerDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    HlmTabsContentDirective,
  ],
  templateUrl: './http-request-card.component.html',
  styleUrl: './http-request-card.component.scss',
})
export class HttpRequestCardComponent {
  requestForm: FormGroup;
  response: any;
  loadingState: LoadingState = LoadingState.Default;

  initialValue: string | null = null;
  faTrashCan = faTrashCan;

  constructor(
    public http: HttpClient,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    const headerForm = this.formBuilder.group({
      name: ['h1', this.headerNameValidator],
      value: ['1'],
    });

    this.requestForm = this.formBuilder.group({
      verb: ['GET', Validators.required],
      url: [
        'https://echo.hoppscotch.io',
        [Validators.required, this.urlValidator],
      ],
      headers: this.formBuilder.array([headerForm]),
      params: this.formBuilder.array([headerForm]),
      body: [''],
    });

    this.addNewHeader(); // start headers with 1
    this.addNewParam(); // start params with 1
  }

  get LoadingState() {
    return LoadingState;
  }

  async sendRequest() {
    const methodInput = this.requestForm.get('verb');
    const urlInput = this.requestForm.get('url');

    if (!methodInput || !urlInput) {
      return;
    }

    const method = methodInput.value;
    let url = urlInput.value;

    const headerInput = this.headers;
    let headers = {};
    if (headerInput && headerInput.length > 0) {
      headers = this.headersToDictionary(headerInput.value as Header[]);
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
    let params = {};
    if (paramInput && paramInput.length > 0) {
      params = this.headersToDictionary(paramInput.value as Header[]);
    }

    const body = this.body.value;

    this.loadingState = LoadingState.Loading;

    try {
      this.response = await firstValueFrom(
        this.http.request(method, url, {
          headers: headers,
          params: params,
          body: body.length > 0 ? body : null,
        })
      );
      console.log({
        method,
        url,
        headers,
        params,
        body,
        response: this.response,
      });
      this.loadingState = LoadingState.Loaded;
    } catch (error) {
      console.error('Error occurred:', error);
      this.loadingState = LoadingState.Error;
    }
  }

  cleanString(input: string): string {
    // Remove trailing whitespaces and quotes from the start and end
    return input.trim().replace(/^['"]|['"]$/g, '');
  }

  headersToDictionary(headers: Header[]) {
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

  paramsToUrl(headers: Header[]) {
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

  private valueRequiredIfNameValidator(control: FormControl) {
    const nameControl = control.parent?.get('name');
    const name = nameControl?.value;
    const value = control.value;

    if (name && !value) {
      return { valueRequiredWhenNameNotEmpty: true };
    }

    return null;
  }

  private headerNameValidator(control: FormControl) {
    if (!control.value) {
      return null; // No validation errors if the value is empty
    }

    const pattern = new RegExp(`^['A-Za-z0-9\\-._']+$`);
    if (!pattern.test(control.value)) {
      return { allowedCharacters: true };
    }

    return null;
  }

  get headers() {
    return this.requestForm.controls['headers'] as FormArray;
  }

  get params() {
    return this.requestForm.controls['params'] as FormArray;
  }

  get body() {
    return this.requestForm.controls['body'];
  }

  onFocus(event: any) {
    this.initialValue = event.target.value;
  }

  onChangeHeaders(event: any, formIndex: any) {
    this.headers.at(formIndex).get('value')?.updateValueAndValidity();

    if (!event || !event.target) {
      return;
    }

    const currentValue: string = event.target.value;
    const previousValue = this.initialValue;

    if (!previousValue && currentValue) {
      this.addNewHeader();
    } else if (previousValue && !currentValue) {
      this.deleteHeader(formIndex);
    }
  }

  onChangeParams(event: any, formIndex: any) {
    this.params.at(formIndex).get('value')?.updateValueAndValidity();

    if (!event || !event.target) {
      return;
    }

    const currentValue: string = event.target.value;
    const previousValue = this.initialValue;

    if (!previousValue && currentValue) {
      this.addNewParam();
    } else if (previousValue && !currentValue) {
      this.deleteParam(formIndex);
    }
  }

  addNewHeader() {
    const headerForm = this.formBuilder.group({
      name: ['', this.headerNameValidator],
      value: [''],
    });
    this.headers.push(headerForm);
  }

  deleteHeader(index: number) {
    this.headers.removeAt(index);

    // Reassign the form array to trigger update
    this.requestForm.setControl(
      'headers',
      new FormArray(this.headers.controls)
    );
    return;
  }

  addNewParam() {
    const paramForm = this.formBuilder.group({
      name: ['', this.headerNameValidator],
      value: [''],
    });
    this.params.push(paramForm);
  }

  deleteParam(index: number) {
    this.params.removeAt(index);

    // Reassign the form array to trigger update
    this.requestForm.setControl('params', new FormArray(this.params.controls));
    return;
  }

  autoGrowTextZone(e: any) {
    e.target.style.height = '0px';
    e.target.style.height = e.target.scrollHeight + 25 + 'px';
  }
}
