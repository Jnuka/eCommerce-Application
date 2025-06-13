import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SliderInterface } from '../interfaces/slider.interface';

import { ModalWindowComponent } from './modal-window.component';

describe('ModalWindowComponent', () => {
  let component: ModalWindowComponent;
  let fixture: ComponentFixture<ModalWindowComponent>;

  const mockDialogData: SliderInterface[] = [
    { url: 'test-url-1', alt: 'image 1' },
    { url: 'test-url-2', alt: 'image 2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalWindowComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockDialogData }],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
