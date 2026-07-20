import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoadingDataComponent } from './loading-data.component';
import { ClientsStateService } from 'src/app/core/services/clients-state.service';
import { of } from 'rxjs';

describe('LoadingDataComponent', () => {
  let component: LoadingDataComponent;
  let fixture: ComponentFixture<LoadingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingDataComponent],
      providers: [
        { provide: ClientsStateService, useValue: { preloadData: () => of([]) } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
