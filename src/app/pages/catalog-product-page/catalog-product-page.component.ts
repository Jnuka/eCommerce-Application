import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CategoryResponse,
  TypeResponse,
  ProductProjectionResponse,
} from '../../products/products.interfaces';
import { ProductsService } from '../../products/products.service';
import { ProductCardComponent } from './product-card/product-card.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs';
import { PAGES } from '../../data/enums/pages';
import { ROUTES_PAGES } from '../../data/enums/routers';
import { CATEGORIES } from '../../data/enums/categories';
import { SUB_CATEGORIES } from '../../data/enums/subCategories';

@Component({
  selector: 'app-catalog-product-page',
  templateUrl: './catalog-product-page.component.html',
  styleUrl: './catalog-product-page.component.css',
  imports: [
    ProductCardComponent,
    MatCheckboxModule,
    FormsModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export class CatalogProductPageComponent implements OnInit {
  public readonly PAGES = PAGES;
  public readonly CATEGORIES = CATEGORIES;

  public currentPage = PAGES.CATALOG;
  public currentType = '';
  public currentCategory = '';
  public currentTypeID = '';
  public currentCategoryID = '';

  public productService = inject(ProductsService);
  public types: TypeResponse[] = [];
  public categories: CategoryResponse[] = [];
  public minPrice = 1;
  public maxPrice = 50;

  public products = signal<ProductProjectionResponse[]>([]);
  public allProducts = signal<ProductProjectionResponse[]>([]);
  public filter = '';
  public sorter = '';
  public search = '';
  public fullTextSearch = '';
  public page: string | null = '';
  public typeParams: string | null = '';
  public filterParams: string | null = '';

  public currentPageIndex = 1;
  public itemsPerPage = 6;

  public readonly _formBuilder = inject(FormBuilder);

  public Attributes = this._formBuilder.group({
    ['acidity.key:"low"']: false,
    ['acidity.key:"medium"']: false,
    ['acidity.key:"high"']: false,
    ['density.key:"low"']: false,
    ['density.key:"medium"']: false,
    ['density.key:"high"']: false,
    ['coffee-roast.key:"light"']: false,
    ['coffee-roast.key:"medium"']: false,
    ['coffee-roast.key:"dark"']: false,
  });

  public priceRange = new FormGroup({
    sliderStart: new FormControl(1),
    sliderEnd: new FormControl(50),
  });

  public sort = new FormControl();

  public sorters = [
    { value: 'price desc', viewValue: 'Price: high to low' },
    { value: 'price asc', viewValue: 'Price: low to high' },
    { value: 'name.en-US asc', viewValue: 'Name: A-Z' },
  ];

  private router = inject(Router);
  constructor(private activatedRoute: ActivatedRoute) {}

  public get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  public get paginatedProducts(): ProductProjectionResponse[] {
    const start = (this.currentPageIndex - 1) * this.itemsPerPage;
    return this.products().slice(start, start + this.itemsPerPage);
  }

  public totalPages(): number {
    return Math.ceil(this.products().length / this.itemsPerPage);
  }

  public changePage(page: number): void {
    this.currentPageIndex = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public ngOnInit(): void {
    this.page = this.activatedRoute.snapshot.queryParamMap.get('categories');
    this.typeParams = this.activatedRoute.snapshot.queryParamMap.get('type');
    this.filterParams = this.activatedRoute.snapshot.queryParamMap.get('filter');
    this.productService.getTypes().subscribe(response => {
      this.types = response.results;
    });
    this.productService.getCategories().subscribe(response => {
      this.categories = response.results;
    });
    if (this.page !== null) {
      if (this.typeParams !== null) {
        this.getCategoriesInfo(this.page, this.typeParams);
      } else {
        this.getCategoriesInfo(this.page);
      }
    } else {
      this.getCategoriesInfo();
    }
  }

  public goCatalog(): void {
    this.currentPage = PAGES.CATALOG;
    this.currentType = '';
    this.currentCategory = '';
    this.currentTypeID = '';
    this.currentCategoryID = '';
    void this.router.navigate([ROUTES_PAGES.CATALOG], {
      queryParams: {},
    });
  }

  public goHome(): void {
    void this.router.navigate([''], {
      queryParams: {},
    });
  }

  public getCategories(category: string): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG], {
      queryParams: { categories: category },
    });
  }

  public getTypeCategories(category: string, type: string): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG], {
      queryParams: { categories: category, type: type },
    });
  }

  public showProductsFromType(type: string, id: string): void {
    this.currentPage = type;
    this.currentType = type;
    this.currentCategory = '';
    this.currentTypeID = id;
    this.sort.reset();
    this.setPriceRange();
    this.resetFilters();
    this.resetSearch();
    this.getCategories(this.currentPage);
    this.renderProducts();
  }

  public setPriceRange(): void {
    if (this.currentType === CATEGORIES.COFFEE) {
      this.maxPrice = 11;
    } else {
      this.maxPrice = 50;
    }
  }

  public showProductsFromCategory(category: string, id: string): void {
    this.currentPage = category;
    if (this.types.length === 0) {
      this.productService
        .getTypes()
        .pipe(
          map(value => {
            this.types = value.results;
            if (category.slice(0, 6) === CATEGORIES.COFFEE) {
              this.currentType = CATEGORIES.COFFEE;
              this.currentTypeID = this.types[0].id;
              this.getTypeCategories(this.currentType, category);
            } else {
              this.currentType = CATEGORIES.ACCESSORIES;
              this.currentTypeID = this.types[1].id;
            }
            this.sort.reset();
            this.setPriceRange();
            this.resetFilters();
            this.resetSearch();
            this.currentCategory = category;
            this.currentCategoryID = id;
            this.checkFilters();
          }),
        )
        .subscribe();
    } else {
      if (category.slice(0, 6) === CATEGORIES.COFFEE) {
        this.currentType = CATEGORIES.COFFEE;
        this.currentTypeID = this.types[0].id;
        this.getTypeCategories(this.currentType, category);
      } else {
        this.currentType = CATEGORIES.ACCESSORIES;
        this.currentTypeID = this.types[1].id;
      }
      this.sort.reset();
      this.setPriceRange();
      this.resetFilters();
      this.resetSearch();
      this.currentCategory = category;
      this.currentCategoryID = id;
      this.checkFilters();
    }
  }

  public getCategoriesInfo(page?: string, type?: string): void {
    if (page) {
      if (type) {
        if (this.categories.length === 0) {
          this.productService.getCategories().subscribe(response => {
            this.categories = response.results;
            if (type === SUB_CATEGORIES.COFFEE_FOR_ESPRESSO) {
              this.showProductsFromCategory(type, this.categories[0].id);
            } else {
              this.showProductsFromCategory(type, this.categories[1].id);
            }
          });
        } else {
          if (type === SUB_CATEGORIES.COFFEE_FOR_ESPRESSO) {
            this.showProductsFromCategory(type, this.categories[0].id);
          } else {
            this.showProductsFromCategory(type, this.categories[1].id);
          }
        }
      } else {
        this.currentType = page;
        this.productService.getTypes().subscribe(response => {
          this.types = response.results;
          if (page === CATEGORIES.COFFEE) {
            this.showProductsFromType(page, this.types[0].id);
          } else if (page === CATEGORIES.ACCESSORIES) {
            this.showProductsFromType(page, this.types[1].id);
          }
        });
      }
    }
  }

  public checkCategory(): void {
    if (this.currentCategory) {
      this.filter = `filter=categories.id:"${this.currentCategoryID}"`;
    } else {
      this.filter = `filter=productType.id:"${this.currentTypeID}"`;
    }
  }

  public resetFilters(): void {
    this.checkCategory();

    this.Attributes.reset();
    this.priceRange.get('sliderStart')?.setValue(this.minPrice);
    this.priceRange.get('sliderEnd')?.setValue(this.maxPrice);
    this.currentPageIndex = 1;
  }

  public sortProducts(): void {
    if (this.sort.value) {
      this.sorter = `&sort=${this.sort.value}`;
    }
    this.renderProducts();
  }

  public checkFilters(): void {
    this.checkCategory();
    const entries = Object.entries(this.Attributes.value);

    let lastTrueKey = '';
    entries.forEach(([key, value]) => {
      if (value && key.slice(0, 3) === lastTrueKey) {
        const n = key.lastIndexOf(':');
        this.filter += `,${key.slice(n + 1)}`;
        lastTrueKey = key.slice(0, 3);
      } else if (value) {
        this.filter += `&filter=variants.attributes.${key}`;
        lastTrueKey = key.slice(0, 3);
      }
    });

    const startPrice = this.priceRange.value.sliderStart;
    const endPrice = this.priceRange.value.sliderEnd;

    if (startPrice && endPrice) {
      this.filter += `&filter=variants.price.centAmount:range (${startPrice * 100} to ${endPrice * 100})`;
    }

    if (this.sort.value) {
      this.sorter = `&sort=${this.sort.value}`;
    }
    this.renderProducts();

    if (this.search) this.onSearch();
    this.currentPageIndex = 1;
  }

  public renderProducts(): void {
    this.productService.getProducts(`${this.filter + this.sorter}`).subscribe(response => {
      this.products.set(response.results);
      this.allProducts.set(response.results);
    });
  }

  public resetSearch(): void {
    this.search = '';
    this.fullTextSearch = '';
  }

  public onSearch(): void {
    if (this.search) {
      this.fullTextSearch = `fuzzi=true&fuzziLevel=0&searchKeywords.en-US=${this.search}`;
      this.productService.getProductsBySearch(`${this.fullTextSearch}`).subscribe(response => {
        const filterNames = response['searchKeywords.en-US'].map(x => x.text);
        const result = this.allProducts().filter(product => {
          return filterNames.includes(product.name['en-US']);
        });
        this.products.set(result);
      });
    } else {
      this.checkFilters();
    }
    this.currentPageIndex = 1;
  }

  public goDetailedProduct(id: string): void {
    void this.router.navigate([ROUTES_PAGES.PRODUCT], {
      queryParams: { productId: id },
    });
  }
}
