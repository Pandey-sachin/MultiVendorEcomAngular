import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from "../../../common/loading-spinner/loading-spinner.component";
import { ErrorDisplayComponent } from "../../../common/error-display/error-display.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorDisplayComponent],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent {
  products: Product[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  private subscriptions = new Subscription();
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    const productSub = this.productService.getState().subscribe(state => {
      this.products = state.products;
      this.isLoading = state.loading;
      this.error = state.error;
    });
    this.subscriptions.add(productSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder-image.jpg';
  }
  
}
