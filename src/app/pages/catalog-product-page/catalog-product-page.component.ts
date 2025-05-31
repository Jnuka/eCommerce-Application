import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ProductProjectionResponse, TypeResponse } from '../../products/products.interfaces';
import { ProductsService } from '../../products/products.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogProductPageComponent implements OnInit {
  public products = signal<ProductProjectionResponse[]>([]);
  public types: TypeResponse[] = [];
  public filter = '';
  public sorter = '';

  public productService = inject(ProductsService);
  public typesID = {
    coffee: 'c85e0d06-74b1-46ca-8544-563a21284aec',
    accessories: '737f1e01-5281-4856-b204-fa3d3cb75a75',
  };
  public categoriesID = {
    forEspresso: '20888f8c-b44a-4166-befe-7a63a75d2ed3',
    forFilter: 'a2e2f3db-fe81-4aea-9793-115623f76a3d',
  };

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
    sliderStart: new FormControl(6.3),
    sliderEnd: new FormControl(11.0),
  });

  public sort = new FormControl();

  public sorters = [
    { value: 'price desc', viewValue: 'Price: high to low' },
    { value: 'price asc', viewValue: 'Price: low to high' },
    { value: 'name.en-US asc', viewValue: 'Name: A-Z' },
  ];

  public ngOnInit(): void {
    this.renderControls();
    this.checkFilters();
  }

  public resetFilters(): void {
    this.filter = `filter=productType.id:"${this.typesID.coffee}"`;

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
    this.filter = `filter=productType.id:"${this.typesID.coffee}"`;

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
  }

  public renderControls(): void {
    this.productService.getTypes().subscribe(response => {
      this.types = response.results;
    });
  }
}
