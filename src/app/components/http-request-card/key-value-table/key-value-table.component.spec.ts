import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeyValueTableComponent } from './key-value-table.component';

describe('KeyValueTableComponent', () => {
  let component: KeyValueTableComponent;
  let fixture: ComponentFixture<KeyValueTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KeyValueTableComponent, ReactiveFormsModule],
    });

    const formBuilder = new FormBuilder();
    const parentFormGroup = formBuilder.group({
      verb: ['GET', Validators.required],
      url: ['https://echo.hoppscotch.io', [Validators.required]],
      headers: formBuilder.group([]),
      params: formBuilder.group([]),
      body: [''],
    });
    const singularDisplayName = 'TestFormName';

    fixture = TestBed.createComponent(KeyValueTableComponent);
    component = fixture.componentInstance;
    component.parentFormGroup = parentFormGroup;
    component.singularDisplayName = singularDisplayName;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new form on name input change', () => {
    const initialFormsCount = component.formArray.length;
    component.onNameInputChange({ target: { value: 'Test' } }, 0);
    const updatedFormsCount = component.formArray.length;
    expect(updatedFormsCount).toBe(initialFormsCount + 1);
  });

  it('should add a form on addNewForm method call and delete a form on deleteForm method call', () => {
    const initialFormsCount = component.formArray.length;
    component.addNewForm();
    const updatedFormsCount1 = component.formArray.length;
    expect(updatedFormsCount1).toBe(initialFormsCount + 1);

    component.addNewForm();
    const updatedFormsCount2 = component.formArray.length;
    expect(updatedFormsCount2).toBe(updatedFormsCount1 + 1);

    component.deleteForm(0);
    const updatedFormsCount3 = component.formArray.length;
    expect(updatedFormsCount3).toBe(updatedFormsCount2 - 1);

    component.deleteForm(0);
    const updatedFormsCount4 = component.formArray.length;
    expect(updatedFormsCount4).toBe(updatedFormsCount3 - 1);
  });

  it('should emit enabledRowsCount on recountEnabledElements method call', () => {
    const spy = jest.spyOn(component.enabledRowsCount, 'emit');
    component.recountEnabledElements();
    expect(spy).toHaveBeenCalledWith(expect.any(Number));
  });

  it('should add a new form on addNewForm method call', () => {
    const initialFormsCount = component.formArray.length;
    component.addNewForm();
    const updatedFormsCount = component.formArray.length;
    expect(updatedFormsCount).toBe(initialFormsCount + 1);
  });

  it('should disable name and value controls when enabled is false', () => {
    component.addNewForm();
    const form = component.formArray.at(0);
    const enabledControl = form.get('enabled');
    enabledControl?.setValue(false);

    const nameControl = form.get('name');
    const valueControl = form.get('value');

    expect(nameControl?.disabled).toBe(true);
    expect(valueControl?.disabled).toBe(true);
  });

  it('should enable name and value controls when enabled is true', () => {
    component.addNewForm();
    const form = component.formArray.at(0);
    const enabledControl = form.get('enabled');
    enabledControl?.setValue(true);

    const nameControl = form.get('name');
    const valueControl = form.get('value');

    expect(nameControl?.enabled).toBe(true);
    expect(valueControl?.enabled).toBe(true);
  });

  it('should add formArray control to parentFormGroup in ngOnInit', () => {
    // Check that formArray control is initially not added to the parentFormGroup
    expect(component.parentFormGroup.get('array')).toBeNull();

    // Call ngOnInit
    component.ngOnInit();

    // Check that formArray control is now added to the parentFormGroup
    expect(component.parentFormGroup.get('array')).toEqual(component.formArray);
  });

  it('should set initialValue onNameInputFocus', () => {
    // Simulate a focus event
    const focusEvent = { target: { value: 'TestValue' } };
    component.onNameInputFocus(focusEvent);

    // Check that initialValue is set correctly
    expect(component.initialValue).toEqual('TestValue');
  });

  it('should validate key name with keyNameValidator returning null if no name', () => {
    //@ts-ignore to test private methods
    const form = component.formBuilder.group({
      //@ts-ignore to test private methods
      name: [{ value: '', disabled: false }, component.keyNameValidator],
      value: [{ value: '', disabled: false }],
      enabled: { value: true, disabled: false },
    });

    expect(form.get('name')?.errors).toBeNull();
  });

  it('should validate key name with keyNameValidator returning null if valid name', () => {
    //@ts-ignore to test private methods
    const form = component.formBuilder.group({
      name: [
        { value: 'i-am-valid', disabled: false },
        //@ts-ignore to test private methods
        component.keyNameValidator,
      ],
      value: [{ value: '', disabled: false }],
      enabled: { value: true, disabled: false },
    });

    expect(form.get('name')?.errors).toBeNull();
  });

  it('should validate key name with keyNameValidator returning allowedCharacters error if invalid name', () => {
    //@ts-ignore to test private methods
    const form = component.formBuilder.group({
      name: [
        { value: 'invalid@name', disabled: false },
        //@ts-ignore to test private methods
        component.keyNameValidator,
      ],
      value: [{ value: '', disabled: false }],
      enabled: { value: true, disabled: false },
    });

    expect(form.get('name')?.hasError('allowedCharacters')).toBe(true);
  });

  it('should add new form when adding name if was empty', () => {
    component.initialValue = '';
    const event = { target: { value: 'TestValue' } };

    component.onNameInputChange(event, 0);

    // Check that addNewForm is called
    expect(component.formArray.length).toBe(1);
  });

  it('should delete form when clearing name if was filled', () => {
    component.initialValue = 'TestValue';
    const event = { target: { value: '' } };

    component.onNameInputChange(event, 0);

    // Check that deleteForm is called
    expect(component.formArray.length).toBe(0);
  });

  it('should not add new form when renaming name', () => {
    component.initialValue = 'TestValue';
    const event = { target: { value: 'NewValue' } };

    component.onNameInputChange(event, 0);

    // Check that addNewForm is not called
    expect(component.formArray.length).toBe(0);
  });

  it('should not delete form when renaming name to nothing', () => {
    component.initialValue = '';
    const event = { target: { value: '' } };

    component.onNameInputChange(event, 0);

    // Check that deleteForm is not called
    expect(component.formArray.length).toBe(0);
  });

  it('should not add new form when event is undefined', () => {
    const event = undefined;

    component.onNameInputChange(event, 0);

    // Check that addNewForm is not called
    expect(component.formArray.length).toBe(0);
  });

  it('should not add new form when event.target is undefined', () => {
    const event = { target: undefined };

    component.onNameInputChange(event, 0);

    // Check that addNewForm is not called
    expect(component.formArray.length).toBe(0);
  });
});
