import { Component, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { firstValueFrom, take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
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
  response: any;
  loadingState: LoadingState = LoadingState.Default;

  initialValue: string | null = null;
  headerCount: number = 0;
  paramCount: number = 0;

  constructor(
    public http: HttpClient,
    private formBuilder: FormBuilder,
    private _ngZone: NgZone
  ) {
    this.requestForm = this.formBuilder.group({
      verb: ['GET', Validators.required],
      url: [
        'https://echo.hoppscotch.io',
        [Validators.required, this.urlValidator],
      ],
      headers: this.formBuilder.array([]),
      params: this.formBuilder.array([]),
      body: [''],
    });

    this.addNewFormToFormArray(this.headers); // start headers with 1
    this.addNewFormToFormArray(this.params); // start params with 1
  }

  //@ts-ignore this is used for the auto resizing ot the text area
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

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

  onChangeFormArray(event: any, formArray: FormArray, formIndex: any) {
    formArray.at(formIndex).get('value')?.updateValueAndValidity();

    if (!event || !event.target) {
      return;
    }

    const currentValue: string = event.target.value;
    const previousValue = this.initialValue;

    if (!previousValue && currentValue) {
      this.addNewFormToFormArray(formArray);
    } else if (previousValue && !currentValue) {
      this.deleteFormFromFormArray(formArray, formIndex);
    }
  }

  deleteFormFromFormArray(formArray: FormArray, index: number) {
    formArray.removeAt(index);

    const formArrayName = this.getControlNameOfFormArray(formArray);

    if (!formArrayName) {
      return;
    }

    // Reassign the form array to trigger update
    this.requestForm.setControl(
      formArrayName,
      new FormArray(formArray.controls)
    );
    return;
  }

  getControlNameOfFormArray(formArray: FormArray): string | null {
    // Find the key associated with the formArray
    let key: string | null = null;
    Object.keys(this.requestForm.controls).forEach((formControlKey) => {
      if (this.requestForm.controls[formControlKey] === formArray) {
        key = formControlKey;
        return; // exit the loop once found
      }
    });

    return key;
  }

  addNewFormToFormArray(formArray: FormArray) {
    const form = this.formBuilder.group({
      name: [{ value: '', disabled: false }, this.headerNameValidator],
      value: [{ value: '', disabled: false }],
      enabled: { value: null, disabled: true },
    });

    // On add new form, set last form to have checkbox checked and enabled
    const lastControl = formArray.at(formArray.length - 1);
    if (lastControl) {
      const checkbox = lastControl.get('enabled');
      checkbox?.enable();
      checkbox?.setValue(true);
    }

    formArray.push(form);

    // Subscribe to changes in the 'checked' control
    form.get('enabled')?.valueChanges.subscribe((isEnabled) => {
      const nameControl = form.get('name');
      const valueControl = form.get('value');

      // Enable or disable 'name' and 'value' controls based on the 'enabled' value
      if (isEnabled) {
        nameControl?.enable();
        valueControl?.enable();
      } else {
        nameControl?.disable();
        valueControl?.disable();
      }

      this.recountEnabledElementsInFormArray(formArray);
    });
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  recountEnabledElementsInFormArray(formArray: FormArray) {
    let count = 0;

    formArray.controls.forEach((control: AbstractControl) => {
      if (control.get('enabled')?.value === true) {
        count++;
      }
    });

    const formArrayName = this.getControlNameOfFormArray(formArray);
    switch (formArrayName) {
      case 'headers':
        this.headerCount = count;
        break;

      case 'params':
        this.paramCount = count;
        break;

      default:
        break;
    }

    return;
  }
}
