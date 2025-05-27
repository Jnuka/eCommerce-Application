import { Component, inject, OnInit } from '@angular/core';
import { ProductResponse } from '../../products/products.interfaces';
import { ProductsService } from '../../products/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
  selector: 'app-detailed-product-page',
  templateUrl: './detailed-product-page.component.html',
  styleUrl: './detailed-product-page.component.css',
  imports: [NgIf, NgForOf, MatButtonToggleGroup, MatButtonToggle],
})
export class DetailedProductPageComponent implements OnInit {
  public pageNum: string | null = '';
  public description = '';
  public products: ProductResponse | undefined;

  public srcImage: { url: string; alt: string }[] | undefined;
  public totalPrice: string | undefined;
  public discount: string | undefined;
  public attributes: { name: string; degree: string }[] | undefined;

  public productService = inject(ProductsService);
  private router = inject(Router);

  private isHighWeight = false;

  constructor(private activatedRoute: ActivatedRoute) {}

  public changeInToggleGroup(): void {
    this.isHighWeight = !this.isHighWeight;
    this.getParameters();
  }

  public ngOnInit(): void {
    this.pageNum = this.activatedRoute.snapshot.queryParamMap.get('productId');
    if (this.pageNum !== null) {
      this.renderProduct(this.pageNum);
    }
  }

  public renderProduct(id: string): void {
    this.productService.getProductById(id).subscribe(product => {
      this.products = product;
      this.description = product.masterData.current.description['en-US'];
      this.description = this.shortDescription();
      this.description += '...';
      this.getParameters();
    });
  }

  public getParameters(): void {
    if (this.products) {
      // Атрибуты продуктов
      this.attributes = [{ name: '', degree: '' }];
      this.attributes.shift();
      for (let i = 0; i < 4; i++) {
        if (i === 3)
          this.attributes.push({
            ['name']: `${this.products.masterData.current.masterVariant.attributes[i].name}`,
            /* eslint-disable */
            ['degree']: `${this.products.masterData.current.masterVariant.attributes[i].value}`,
            /* eslint-enable */
          });
        else
          this.attributes.push({
            ['name']: `${this.products.masterData.current.masterVariant.attributes[i].name}`,
            ['degree']: `${this.products.masterData.current.masterVariant.attributes[i].value.label}`,
          });
      }
      /* eslint-disable */
      this.products.masterData.current.masterVariant.attributes[0].value;
      /* eslint-enable */

      this.srcImage = [{ url: '', alt: '' }];
      this.srcImage.shift();

      if (this.isHighWeight) {
        // Картинка
        this.srcImage.push({
          ['url']: `${this.products.masterData.current.variants[0].images[0].url}`,
          ['alt']: `${this.products.masterData.current.variants[0].images[0].label}`,
        });
        // Цена продукта
        this.totalPrice = new Intl.NumberFormat('en', {
          style: 'currency',
          currency: 'USD',
        }).format(this.products.masterData.current.variants[0].prices[0].value.centAmount / 100);
        // Скидка на продукт, если есть
        if (this.products.masterData.current.masterVariant.prices[0].discounted) {
          this.discount = new Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
          }).format(
            this.products.masterData.current.variants[0].prices[0].discounted.value.centAmount /
              100,
          );
        }
        // Атрибут для веса
        this.attributes.push({
          ['name']: `${this.products.masterData.current.variants[0].attributes[4].name}`,
          /* eslint-disable */
          ['degree']: `${this.products.masterData.current.variants[0].attributes[4].value}`,
          /* eslint-enable */
        });
      } else {
        // Картинка
        this.srcImage.push({
          ['url']: `${this.products.masterData.current.masterVariant.images[0].url}`,
          ['alt']: `${this.products.masterData.current.masterVariant.images[0].label}`,
        });
        // Цена продукта
        this.totalPrice = new Intl.NumberFormat('en', {
          style: 'currency',
          currency: 'USD',
        }).format(this.products.masterData.current.masterVariant.prices[0].value.centAmount / 100);
        // Скидка на продукт, если есть
        if (this.products.masterData.current.masterVariant.prices[0].discounted) {
          this.discount = new Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
          }).format(
            this.products.masterData.current.masterVariant.prices[0].discounted.value.centAmount /
              100,
          );
        }
        // Атрибут для веса
        this.attributes.push({
          ['name']: `${this.products.masterData.current.masterVariant.attributes[4].name}`,
          /* eslint-disable */
          ['degree']: `${this.products.masterData.current.masterVariant.attributes[4].value}`,
          /* eslint-enable */
        });
      }
    }
  }

  public shortDescription(): string {
    return this.description.substring(0, this.description.length - 150);
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

  public async goCatalog(): Promise<void> {
    await this.router.navigate(['catalog']);
  }
}
