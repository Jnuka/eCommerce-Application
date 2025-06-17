import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

describe('CartComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
    const req = httpTestingController.expectOne(
      'https://api.eu-central-1.aws.commercetools.com/e-commerce-coffee-shop/me/active-cart',
    );
    req.flush({
      lineItems: [],
      totalPrice: { centAmount: 0 },
      discountCodes: [],
    });
  });
});
