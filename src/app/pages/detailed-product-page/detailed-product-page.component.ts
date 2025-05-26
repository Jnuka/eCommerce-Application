import { Component, inject, OnInit } from '@angular/core';
import { ProductResponse } from '../../products/products.interfaces';
import { ProductsService } from '../../products/products.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detailed-product-page',
  imports: [],
  templateUrl: './detailed-product-page.component.html',
  styleUrl: './detailed-product-page.component.css',
})
export class DetailedProductPageComponent implements OnInit {
  public description: string;
  public pageNum: string | null = '';
  public products: ProductResponse | undefined;
  public productService = inject(ProductsService);
  private router = inject(Router);

  constructor(private activatedRoute: ActivatedRoute) {}

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
    });
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
