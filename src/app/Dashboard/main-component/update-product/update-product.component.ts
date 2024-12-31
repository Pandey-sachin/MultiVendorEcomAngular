import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models';
import { LoadingSpinnerComponent } from "../../../common/loading-spinner/loading-spinner.component";
import { ErrorDisplayComponent } from "../../../common/error-display/error-display.component";
import { AddProductComponent } from "../add-products/add-products.component";
import { CommonModule } from '@angular/common';
import { LucideAngularModule ,Pen} from 'lucide-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule ,LoadingSpinnerComponent, ErrorDisplayComponent, AddProductComponent,LucideAngularModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent {
  readonly penIcon = Pen;
  editingProductId!: string ;
  products: Product[] = [];
  isLoading = false;
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

  handleEdit(productId: string): void {
    this.editingProductId = productId;
  }
}
