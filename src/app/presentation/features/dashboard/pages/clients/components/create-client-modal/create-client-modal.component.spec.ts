import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateClientModalComponent } from './create-client-modal.component';
import { LoadingService } from 'src/app/core/services/loading.service';

describe('CreateClientModalComponent', () => {
  let component: CreateClientModalComponent;
  let fixture: ComponentFixture<CreateClientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClientModalComponent],
      providers: [LoadingService],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should have a valid form with correct data', () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const birthDateStr = eighteenYearsAgo.toISOString().split('T')[0];

    component.form.patchValue({
      name: 'John',
      lastname: 'Doe',
      age: 25,
      birthDate: birthDateStr,
    });

    expect(component.form.valid).toBeTruthy();
  });

  it('should emit save event on valid submit', () => {
    spyOn(component.save, 'emit');
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const birthDateStr = eighteenYearsAgo.toISOString().split('T')[0];

    component.form.patchValue({
      name: 'John',
      lastname: 'Doe',
      age: 25,
      birthDate: birthDateStr,
    });

    component.onSubmit();
    expect(component.save.emit).toHaveBeenCalled();
  });

  it('should not emit save event on invalid submit', () => {
    spyOn(component.save, 'emit');
    component.onSubmit();
    expect(component.save.emit).not.toHaveBeenCalled();
  });
});
