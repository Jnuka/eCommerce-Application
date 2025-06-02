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
import { throwError } from 'rxjs';

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
  public currentPage = 'Catalog';
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
  public filter = '';
  public sorter = '';
  public search = '';
  public fullTextSearch = '';
  public page: string | null = '';
  public typeParams: string | null = '';
  public filterParams: string | null = '';

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

  public ngOnInit(): void {
    this.page = this.activatedRoute.snapshot.queryParamMap.get('categories');
    this.typeParams = this.activatedRoute.snapshot.queryParamMap.get('type');
    this.filterParams = this.activatedRoute.snapshot.queryParamMap.get('filter');
    // console.log('page', this.page);
    // console.log('typeParams', this.typeParams);
    // console.log('filterParams', this.filterParams);
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

  public async goCatalog(): Promise<void> {
    this.currentPage = 'Catalog';
    this.currentType = '';
    this.currentCategory = '';
    this.currentTypeID = '';
    this.currentCategoryID = '';
    await this.router.navigate(['catalog'], {
      queryParams: {},
    });
    // this.showProductsFromCategory('Catalog', '');
  }

  public goHome(): void {
    void this.router.navigate([''], {
      queryParams: {},
    });
  }

  public getCategories(category: string): void {
    void this.router
      .navigate(['catalog'], {
        queryParams: { categories: category },
      })
      .then(r => throwError(() => r));
  }

  public getTypeCategories(category: string, type: string): void {
    void this.router
      .navigate(['catalog'], {
        queryParams: { categories: category, type: type },
      })
      .then(r => throwError(() => r));
  }

  // public getFilters(category: string, filter: string, type?: string): void {
  //   if (type !== undefined) {
  //     void this.router
  //       .navigate(['catalog'], {
  //         queryParams: { categories: category, type: type, filter: filter },
  //       })
  //       .then(r => throwError(() => r));
  //   } else {
  //     void this.router
  //       .navigate(['catalog'], {
  //         queryParams: { categories: category, filter: filter },
  //       })
  //       .then(r => throwError(() => r));
  //   }
  // }

  public showProductsFromType(type: string, id: string): void {
    this.currentPage = type;
    this.currentType = type;
    this.currentCategory = '';
    this.currentTypeID = id;
    this.setPriceRange();
    this.resetFilters();
    this.resetSearch();
    this.checkFilters();
    this.getCategories(this.currentPage);
  }

  public setPriceRange(): void {
    if (this.currentType === 'Coffee') {
      this.maxPrice = 11;
    } else {
      this.maxPrice = 50;
    }
  }

  public showProductsFromCategory(category: string, id: string): void {
    this.currentPage = category;
    if (category.slice(0, 6) === 'Coffee') {
      this.currentType = 'Coffee';
      this.currentTypeID = this.types[0].id;
      this.getTypeCategories(this.currentType, category);
    } else {
      this.currentType = 'Accessories';
      this.currentTypeID = this.types[1].id;
    }
    this.setPriceRange();
    this.resetFilters();
    this.resetSearch();
    this.currentCategory = category;
    this.currentCategoryID = id;
    this.checkFilters();
  }

  public getCategoriesInfo(page?: string, type?: string): void {
    this.productService.getTypes().subscribe(response => {
      this.types = response.results;
    });
    this.productService.getCategories().subscribe(response => {
      this.categories = response.results;
    });
    if (page) {
      if (type) {
        this.productService.getTypes().subscribe(response => {
          this.types = response.results;
        });
        this.productService.getCategories().subscribe(response => {
          this.categories = response.results;
          if (type === 'Coffee for espresso') {
            this.showProductsFromCategory(type, this.categories[0].id);
          } else {
            this.showProductsFromCategory(type, this.categories[1].id);
          }
        });
      } else {
        this.currentType = page;
        this.productService.getTypes().subscribe(response => {
          this.types = response.results;
          if (page === 'Coffee') {
            this.showProductsFromType(page, this.types[0].id);
          } else if (page === 'Accessories') {
            this.showProductsFromType(page, this.types[1].id);
          }
        });
      }
    } else {
      this.productService.getTypes().subscribe(response => {
        this.types = response.results;
      });
      this.productService.getCategories().subscribe(response => {
        this.categories = response.results;
      });
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
    // this.Attributes.get(['acidity.key:"low"'])?.setValue(true);
    // this.Attributes.get(['acidity.key:"medium"'])?.setValue(true);
    this.priceRange.get('sliderStart')?.setValue(this.minPrice);
    this.priceRange.get('sliderEnd')?.setValue(this.maxPrice);

    this.productService.getProducts(this.filter).subscribe(response => {
      this.products.set(response.results);
    });
  }

  public sortProducts(): void {
    if (this.sort.value) {
      this.sorter = `&sort=${this.sort.value}`;
    }
    this.productService.getProducts(`${this.filter + this.sorter}`).subscribe(response => {
      this.products.set(response.results);
    });
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
    // const filterSave = this.filter + this.sorter;
    // this.getFilters(this.currentPage, filterSave);
    //
    // const filterSaveSeparate = (this.filter + this.sorter).split('&');
    // console.log(filterSaveSeparate);
    //
    // for (let i = 1; i < filterSaveSeparate.length; i++) {
    //   if (filterSaveSeparate[i].includes('acidity.key')) {
    //     if (filterSaveSeparate[i].split(':')[1].includes("low")) {
    //       this.Attributes.get(['acidity.key:"low"'])?.setValue(true);
    //     } else if (filterSaveSeparate[i].split(':')[1].includes("medium")) {
    //       this.Attributes.get(['acidity.key:"medium"'])?.setValue(true);
    //     } else if (filterSaveSeparate[i].split(':')[1].includes("high")) {
    //       this.Attributes.get(['acidity.key:"high"'])?.setValue(true);
    //     }
    //   }
    // }
    this.productService.getProducts(`${this.filter + this.sorter}`).subscribe(response => {
      this.products.set(response.results);
    });

    if (this.search) this.onSearch();
  }

  public resetSearch(): void {
    this.search = '';
    this.fullTextSearch = '';
    this.checkFilters();
  }

  public onSearch(): void {
    if (this.search) {
      this.fullTextSearch = `fuzzi=true&fuzziLevel=0&searchKeywords.en-US=${this.search}`;
      this.productService.getProductsBySearch(`${this.fullTextSearch}`).subscribe(response => {
        const filterNames = response['searchKeywords.en-US'].map(x => x.text);
        const result = this.products().filter(product =>
          filterNames.includes(product.name['en-US']),
        );
        this.products.set(result);
      });
    } else {
      this.checkFilters();
    }
  }

  public async goDetailedProduct(id: string): Promise<void> {
    await this.router.navigate(['product'], {
      queryParams: { productId: id },
    });
  }
}
