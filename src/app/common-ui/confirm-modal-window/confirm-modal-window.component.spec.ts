import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { ConfirmModalWindowComponent } from './confirm-modal-window.component';
import { CartComponent } from '../../pages/cart/cart.component';

describe('ConfirmModalWindowComponent', () => {
  let httpTestingController: HttpTestingController;

  let component: ConfirmModalWindowComponent;
  let fixture: ComponentFixture<ConfirmModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalWindowComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CartComponent, useValue: {} },
      ],
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(ConfirmModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
