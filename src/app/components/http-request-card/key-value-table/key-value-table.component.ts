import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-key-value-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './key-value-table.component.html',
  styleUrl: './key-value-table.component.scss',
})
export class KeyValueTableComponent implements OnInit {
  @Input({ required: true }) parentFormGroup!: FormGroup;
  @Input({ required: true }) singularDisplayName!: string;
  @Output() enabledRowsCount: EventEmitter<number> = new EventEmitter<number>();

  formArray: FormArray;
  initialValue: string | null = null;

  constructor(private formBuilder: FormBuilder) {
    // have to be a form group with a form array inside so that can reuse this component (as form groups need to be different)
    this.formArray = this.formBuilder.array([]);
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl('array', this.formArray);
    this.addNewForm(); // start form with 1
  }

  onNameInputFocus(event: any) {
    this.initialValue = event.target.value;
  }

  onNameInputChange(event: any, formIndex: any) {
    if (!event || !event.target) {
      return;
    }

    const currentValue: string = event.target.value;
    const previousValue = this.initialValue;

    if (!previousValue && currentValue) {
      this.addNewForm();
    } else if (previousValue && !currentValue) {
      this.deleteForm(formIndex);
    }
  }

  deleteForm(index: number) {
    this.formArray.removeAt(index);

    this.recountEnabledElements();

    // Reassign the form array to trigger update
    this.parentFormGroup.setControl('array', this.formArray);
    return;
  }

  addNewForm() {
    const form = this.formBuilder.group({
      name: [{ value: '', disabled: false }, this.keyNameValidator],
      value: [{ value: '', disabled: false }],
      enabled: { value: false, disabled: true },
    });

    // On add new form, set last form to have checkbox checked and enabled
    const lastControl = this.formArray.at(-1);
    if (lastControl) {
      const checkbox = lastControl.get('enabled');
      checkbox?.enable();
      checkbox?.setValue(true);
    }

    this.formArray.push(form);

    // Subscribe to changes in the 'checked' control
    form.get('enabled')?.valueChanges.subscribe((isEnabled: boolean | null) => {
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

      this.recountEnabledElements();
    });
  }

  recountEnabledElements() {
    let count = 0;

    this.formArray.controls.forEach((control: AbstractControl) => {
      if (control.get('enabled')?.value === true) {
        count++;
      }
    });

    this.enabledRowsCount.emit(count);
    return;
  }

  private keyNameValidator(control: FormControl) {
    if (!control.value) {
      return null; // No validation errors if the value is empty
    }

    const pattern = new RegExp(`^['A-Za-z0-9\\-._']+$`);
    if (!pattern.test(control.value)) {
      return { allowedCharacters: true };
    }

    return null;
  }
}
