import { Component, inject, OnInit } from '@angular/core';
import { ProductResponse, ProductVariant } from '../../products/products.interfaces';
import { ProductsService } from '../../products/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { SliderInterface } from '../../common-ui/interfaces/slider.interface';
import { ImageSliderComponent } from '../../common-ui/image-slider/image-slider.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalWindowComponent } from '../../common-ui/modal-window/modal-window.component';
import { map } from 'rxjs';
import { ROUTES_PAGES } from '../../data/enums/routers';
import { CATEGORIES } from '../../data/enums/categories';
import { SUB_CATEGORIES } from '../../data/enums/subCategories';

@Component({
  selector: 'app-detailed-product-page',
  templateUrl: './detailed-product-page.component.html',
  styleUrl: './detailed-product-page.component.css',
  imports: [NgIf, NgForOf, MatButtonToggleGroup, MatButtonToggle, ImageSliderComponent],
})
export class DetailedProductPageComponent implements OnInit {
  public readonly CATEGORIES = CATEGORIES;
  public readonly SUB_CATEGORIES = SUB_CATEGORIES;

  public pageNum: string | null = '';
  public description = '';
  public products: ProductResponse | undefined;

  public srcImage: SliderInterface[] = [];
  public totalPrice: string | undefined;
  public discount: string | undefined;
  public attributes: { name: string; degree: string }[] | undefined;

  public countAttributes = 1;
  public masterVariant: ProductVariant | undefined;
  public variants: ProductVariant[] | undefined;
  public whichCategory = '';

  public productService = inject(ProductsService);

  private router = inject(Router);
  private dialog = inject(MatDialog);

  constructor(private activatedRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.pageNum = this.activatedRoute.snapshot.queryParamMap.get('productId');
    if (this.pageNum !== null) {
      this.renderProduct(this.pageNum);
    }
  }

  public changeInToggleGroup(event: MatButtonToggleChange): void {
    /* eslint-disable */
    const toggleButtonValue = event.value;
    this.toggleSwitch(toggleButtonValue);
    /* eslint-enable */
  }

  public renderProduct(id: string): void {
    this.productService
      .getProductById(id)
      .pipe(
        map(product => {
          this.countAttributes = product.masterData.current.masterVariant.attributes.length;
          this.masterVariant = product.masterData.current.masterVariant;
          this.variants = product.masterData.current.variants;
          this.products = product;
          this.getParameters();
        }),
      )
      .subscribe();
  }

  public toggleSwitch(toggleButtonValue?: string): void {
    if (this.masterVariant && this.variants && this.products) {
      /* eslint-disable */
      if (
        toggleButtonValue === String(this.masterVariant.attributes[this.countAttributes - 1].value)
      ) {
        this.getAttributes(this.masterVariant);
        if (this.countAttributes > 1) {
          this.getAttributesForCoffee(this.masterVariant);
        } else {
          this.getAttributesForAccessories(this.masterVariant);
        }
      } else {
        for (const variant of this.variants) {
          if (toggleButtonValue === String(variant.attributes[this.countAttributes - 1].value)) {
            this.getAttributes(variant);
            if (this.countAttributes > 1) {
              this.getAttributesForCoffee(variant);
            } else {
              this.getAttributesForAccessories(variant);
            }
          }
        }
      }
      /* eslint-enable */
    }
  }

  public getParameters(): void {
    if (this.masterVariant && this.variants && this.products) {
      this.description = this.products.masterData.current.description['en-US'];
      this.description = this.shortDescription();
      this.description += '...';
      // Определние категории
      if (
        this.masterVariant.attributes.length === 1 ||
        this.masterVariant.attributes.length === 0
      ) {
        if (this.products.masterData.current.name['en-US'] === 'French press') {
          this.whichCategory = CATEGORIES.FRENCH;
        } else if (this.products.masterData.current.name['en-US'] === 'Filters for aeropress') {
          this.whichCategory = CATEGORIES.AERO_PRESS;
        } else if (this.products.masterData.current.name['en-US'] === 'Coffee grinder') {
          this.whichCategory = CATEGORIES.GRINDER;
        }
      } else {
        this.whichCategory = CATEGORIES.COFFEE;
      }
      // Картинки
      this.srcImage = [];
      for (const img of this.masterVariant.images) {
        this.srcImage.push({
          url: `${img.url}`,
          alt: `${img.label}`,
        });
      }
      // Цена продукта
      this.totalPrice = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: 'USD',
      }).format(this.masterVariant.prices[0].value.centAmount / 100);
      // Скидка на продукт, если есть
      if (this.masterVariant.prices[0].discounted) {
        this.discount = new Intl.NumberFormat('en', {
          style: 'currency',
          currency: 'USD',
        }).format(this.masterVariant.prices[0].discounted.value.centAmount / 100);
      }

      if (this.countAttributes > 1) {
        // Атрибуты продуктов
        this.attributes = [{ name: '', degree: '' }];
        this.attributes.shift();
        for (let i = 0; i < 5; i++) {
          if (i === 3 || i === 4)
            this.attributes.push({
              ['name']: `${this.masterVariant.attributes[i].name}`,
              /* eslint-disable */
              ['degree']: `${this.masterVariant.attributes[i].value}`,
              /* eslint-enable */
            });
          else
            this.attributes.push({
              ['name']: `${this.masterVariant.attributes[i].name}`,
              ['degree']: `${this.masterVariant.attributes[i].value.label}`,
            });
        }
        /* eslint-disable */
        this.masterVariant.attributes[this.countAttributes - 1].value;
        /* eslint-enable */
      } else if (this.countAttributes === 1) {
        this.getAttributesForAccessories(this.masterVariant);
      }
    }
  }

  public getAttributes(variants: ProductVariant): void {
    // Картинка
    this.srcImage = [];
    for (const img of variants.images) {
      this.srcImage.push({
        url: `${img.url}`,
        alt: `${img.label}`,
      });
    }
    // Цена продукта
    this.totalPrice = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'USD',
    }).format(variants.prices[0].value.centAmount / 100);
    // Скидка на продукт, если есть
    if (variants.prices[0].discounted) {
      this.discount = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: 'USD',
      }).format(variants.prices[0].discounted.value.centAmount / 100);
    }
  }

  public getAttributesForAccessories(variants: ProductVariant): void {
    // Атрибуты
    this.attributes = [{ name: '', degree: '' }];
    this.attributes.shift();
    /* eslint-disable */
    this.attributes.push({
      ['name']: `${variants.attributes[0].name}`,
      ['degree']: `${variants.attributes[0].value}`,
    });
    /* eslint-enable */
  }

  public getAttributesForCoffee(variants: ProductVariant): void {
    // Атрибут для веса
    /* eslint-disable */
    if (this.attributes) {
      this.attributes.filter(value => value.name === 'weight')[0].degree =
        `${variants.attributes[4].value}`;
    }
    /* eslint-enable */
  }

  public shortDescription(): string {
    return this.description.substring(0, this.description.length * (1 - 60 / 100));
  }

  public moreDescription(): void {
    if (this.products) {
      this.description = this.products.masterData.current.description['en-US'];
    }
    const moreButton = document.querySelector('.more-btn');
    if (moreButton instanceof HTMLElement) {
      moreButton.classList.add('hidden-more-btn');
    }
  }

  public goCatalog(): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG]);
  }

  public goCategory(category: string): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG], {
      queryParams: { categories: category },
    });
  }
  public goType(type: string): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG], {
      queryParams: { categories: CATEGORIES.COFFEE, type: type },
    });
  }

  public goAccessories(): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG], {
      queryParams: { categories: CATEGORIES.ACCESSORIES },
    });
  }

  public goHome(): void {
    void this.router.navigate(['']);
  }

  public openDialog(): void {
    this.dialog.open(ModalWindowComponent, {
      data: this.srcImage,
    });
  }
}
