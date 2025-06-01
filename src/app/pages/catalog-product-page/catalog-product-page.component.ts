import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  public products = signal<ProductProjectionResponse[]>([]);
  public filter = '';
  public sorter = '';
  public search = '';
  public fullTextSearch = '';

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
    sliderStart: new FormControl(0),
    sliderEnd: new FormControl(100.0),
  });

  public sort = new FormControl();

  public sorters = [
    { value: 'price desc', viewValue: 'Price: high to low' },
    { value: 'price asc', viewValue: 'Price: low to high' },
    { value: 'name.en-US asc', viewValue: 'Name: A-Z' },
  ];

  private router = inject(Router);

  public ngOnInit(): void {
    this.getCategoriesInfo();
  }

  public goCatalog(): void {
    this.currentPage = 'Catalog';
    this.currentType = '';
    this.currentCategory = '';
    this.currentTypeID = '';
    this.currentCategoryID = '';
    //await this.router.navigate(['catalog']);
  }

  public async goHome(): Promise<void> {
    await this.router.navigate(['']);
  }

  public showProductsFromType(type: string, id: string): void {
    this.currentPage = type;
    this.currentType = type;
    this.currentCategory = '';
    this.currentTypeID = id;
    this.checkFilters();
  }

  public showProductsFromCategory(category: string, id: string): void {
    this.currentPage = category;
    if (category.slice(0, 6) === 'Coffee') {
      this.currentType = 'Coffee';
      this.currentTypeID = this.types[0].id;
    } else {
      this.currentType = 'Accessories';
      this.currentTypeID = this.types[1].id;
    }
    this.currentCategory = category;
    this.currentCategoryID = id;
    this.checkFilters();
  }

  public getCategoriesInfo(): void {
    this.productService.getTypes().subscribe(response => {
      this.types = response.results;
    });

    this.productService.getCategories().subscribe(response => {
      this.categories = response.results;
    });
  }

  public checkCategory(): void {
    if (this.currentCategory) {
      this.filter = `filter=categories.id:"${this.currentCategoryID}"`;
    } else {
      this.filter = `filter=productType.id:"${this.currentTypeID}"`;
    }
  }

  public async goDetailedProduct(id: string): Promise<void> {
    await this.router.navigate(['product'], {
      queryParams: { productId: id },
    });
  }

  public resetFilters(): void {
    this.checkCategory();

    this.Attributes.reset();
    this.priceRange.get('sliderStart')?.setValue(6.3);
    this.priceRange.get('sliderEnd')?.setValue(11.0);

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
}
