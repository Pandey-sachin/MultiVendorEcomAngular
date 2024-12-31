import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../models';
import { ProductService } from '../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from "../../../common/loading-spinner/loading-spinner.component";
import { ErrorDisplayComponent } from "../../../common/error-display/error-display.component";
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorDisplayComponent],
  templateUrl: './delete-product.component.html',
  styleUrl: './delete-product.component.css'
})
export class DeleteProductComponent implements OnInit, OnDestroy {
  selectedProducts: string[] = [];
  isModalOpen = false;
  products: Product[] = [];
  isLoading = false;
  error: string | null = null;
  user$: Observable<any>;
  private subscriptions = new Subscription();

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.user$ = authService.currentUser$;
  }

  ngOnInit(): void {
    const stateSub = this.productService.getState().subscribe(state => {
      this.products = state.products;
      this.isLoading = state.loading;
      this.error = state.error;
    });
    this.subscriptions.add(stateSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  handleSelectAll(): void {
    if (this.selectedProducts.length === this.products.length) {
      this.selectedProducts = [];
    } else {
      this.selectedProducts = this.products.map(product => product.productId!);
    }
  }

  handleSelectProduct(productId: string): void {
    const index = this.selectedProducts.indexOf(productId);
    if (index > -1) {
      this.selectedProducts.splice(index, 1);
    } else {
      this.selectedProducts.push(productId);
    }
  }

  handleDelete(): void {
    if (this.selectedProducts.length > 0) {
      this.isModalOpen = true;
    } else {
      this.toastr.error('Please select products to delete');
    }
  }

  async confirmDelete(): Promise<void> {
    if (!this.selectedProducts.length) {
      this.toastr.error('No products selected for deletion.');
      return;
    }

    try {

      const user = await firstValueFrom(this.user$);
      if (!user) {
        this.toastr.error('User not authenticated');
        return;
      }

      this.isLoading = true;


      if (this.selectedProducts.length === 1) {
        await firstValueFrom(this.productService.deleteProduct(this.selectedProducts[0]));
      } else {
        await firstValueFrom(this.productService.deleteSelectedProducts(this.selectedProducts));
      }

      
      this.isModalOpen = false;
      await firstValueFrom(this.productService.getProductsByVendor(user.id));

      this.toastr.success('Products deleted successfully!');
      this.selectedProducts = [];
      

    } catch (err: any) {
      console.error('Error during deletion:', err);
      this.toastr.error(err.message || 'Failed to delete products. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }
}