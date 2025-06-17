// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { DetailedProductPageComponent } from './detailed-product-page.component';
// import { ProductsService } from '../../products/products.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
// import { of } from 'rxjs';
// import { ProductResponse, ProductVariant } from '../../products/products.interfaces';
// import { ImageSliderComponent } from '../../common-ui/image-slider/image-slider.component';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { NgFor, NgIf } from '@angular/common';
// import { PAGES } from '../../data/enums/pages';
// import { SUB_CATEGORIES } from '../../data/enums/subCategories';
// import { CATEGORIES } from '../../data/enums/categories';
// import { provideHttpClient } from '@angular/common/http';
// import { provideHttpClientTesting } from '@angular/common/http/testing';
// import { HttpTestingController } from '@angular/common/http/testing';

// describe('DetailedProductPageComponent', () => {
//     let httpTestingController: HttpTestingController;

//   let component: DetailedProductPageComponent;
//   let fixture: ComponentFixture<DetailedProductPageComponent>;
//   let mockProductsService: jasmine.SpyObj<ProductsService>;
//   let mockRouter: jasmine.SpyObj<Router>;
//   let mockDialog: jasmine.SpyObj<MatDialog>;

//   const createMockVariant = (id: number, price: number): ProductVariant => ({
//     id: id.toString(),
//     prices: [
//       {
//         id: `price-${id}`,
//         value: { centAmount: price, currencyCode: 'USD', type: 'centPrecision', fractionDigits: 2 },
//         discounted: {
//           value: {
//             centAmount: 1200,
//             currencyCode: 'USD',
//             type: 'centPrecision',
//             fractionDigits: 2,
//           },
//           discount: {
//             id: 'discount-1',
//             typeId: 'product-discount',
//           },
//         },
//       },
//     ],
//     images: [
//       {
//         url: `https://example.com/image-${id}.jpg`,
//         dimensions: { w: 800, h: 600 },
//         label: `Image ${id}`,
//       },
//     ],
//     attributes: [
//       {
//         name: 'weight',
//         value: { key: '250g', label: '250 grams' },
//         type: {
//           values: [],
//         },
//       },
//       {
//         name: 'roast',
//         value: { key: 'medium', label: 'Medium Roast' },
//         type: {
//           values: [],
//         },
//       },
//     ],
//   });

//   const mockProduct: ProductResponse = {
//     id: 'test-id',
//     version: 1,
//     productType: { id: 'type-1', typeId: 'product-type' },
//     masterData: {
//       published: true,
//       current: {
//         name: { 'en-US': 'Test Product' },
//         description: { 'en-US': 'Test description with more than 20 characters for testing' },
//         categories: [{ id: 'cat-1' }],
//         slug: { 'en-US': 'test-product' },
//         masterVariant: createMockVariant(1, 1500),
//         variants: [createMockVariant(2, 2000)],
//         searchKeywords: { text: 'test' },
//       },
//       staged: {
//         name: { 'en-US': 'Test Product Staged' },
//         description: { 'en-US': 'Staged description' },
//         categories: [{ id: 'cat-1' }],
//         slug: { 'en-US': 'test-product-staged' },
//         masterVariant: createMockVariant(1, 1500),
//         variants: [],
//         searchKeywords: {
//           text: 'test',
//         },
//       },
//       hasStagedChanges: false,
//     },
//     createdAt: new Date(),
//     lastModifiedAt: new Date(),
//   };

//   beforeEach(async () => {
//     /* eslint-disable */
//     mockProductsService = jasmine.createSpyObj('ProductsService', ['getProductById']);
//     mockRouter = jasmine.createSpyObj('Router', ['navigate']);
//     mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
//     /* eslint-enable */

//     await TestBed.configureTestingModule({
//       imports: [
//         DetailedProductPageComponent,
//         MatButtonToggleModule,
//         NgIf,
//         NgFor,
//         ImageSliderComponent,
//       ],
//       providers: [
//             provideHttpClient(), provideHttpClientTesting(),

//         { provide: ProductsService, useValue: mockProductsService },
//         { provide: Router, useValue: mockRouter },
//         /* eslint-disable */
//         {
//           provide: ActivatedRoute,
//           useValue: { snapshot: { queryParamMap: { get: () => 'test-id' } } },
//         },
//         /* eslint-enable */
//         { provide: MatDialog, useValue: mockDialog },
//       ],
//     }).compileComponents();
//         httpTestingController = TestBed.inject(HttpTestingController);

//     fixture = TestBed.createComponent(DetailedProductPageComponent);
//     component = fixture.componentInstance;
//     mockProductsService.getProductById.and.returnValue(of(mockProduct));
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should handle coffee product', () => {
//     const coffeeProduct = { ...mockProduct };
//     coffeeProduct.masterData.current.name['en-US'] = 'Brownie';
//     coffeeProduct.masterData.current.masterVariant.attributes = [
//       {
//         name: 'acidity',
//         value: { key: 'medium', label: 'Medium' },
//         type: {
//           values: [],
//         },
//       },
//     ];

//     mockProductsService.getProductById.and.returnValue(of(coffeeProduct));
//     component.ngOnInit();
//     fixture.detectChanges();

//     expect(component.whichCategory).toBe(CATEGORIES.COFFEE);
//     expect(component.countAttributes).toBe(1);
//   });

//   describe('Navigation', () => {
//     it('should navigate to category', () => {
//       component.goCategory(CATEGORIES.COFFEE);
//       /* eslint-disable */
//       expect(mockRouter.navigate).toHaveBeenCalledWith([PAGES.CATALOG], {
//         queryParams: { categories: CATEGORIES.COFFEE },
//       });
//       /* eslint-enable */
//     });

//     it('should navigate to type', () => {
//       component.goType(SUB_CATEGORIES.COFFEE_FOR_FILTER);
//       /* eslint-disable */
//       expect(mockRouter.navigate).toHaveBeenCalledWith([PAGES.CATALOG], {
//         queryParams: { categories: CATEGORIES.COFFEE, type: SUB_CATEGORIES.COFFEE_FOR_FILTER },
//       });
//       /* eslint-enable */
//     });
//   });
// });
