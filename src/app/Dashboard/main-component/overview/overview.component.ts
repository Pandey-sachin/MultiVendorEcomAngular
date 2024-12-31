import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, TriangleAlert, FolderTree, Package, IndianRupee, ShoppingCart, Percent } from 'lucide-angular';
import { StatCardComponent } from './statcard/statcard.component';
import { Product, ProductState } from '../../../models';
import { ProductService } from '../../../services/product.service';
import { LoadingSpinnerComponent } from "../../../common/loading-spinner/loading-spinner.component";
import { ErrorDisplayComponent } from "../../../common/error-display/error-display.component";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

interface Stats {
  totalProducts: number;
  totalCategories: number;
  lowStockItems: number;
  averagePrice: number;
  totalValue: number;
  itemsOnDiscount: number;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [LucideAngularModule, StatCardComponent, LoadingSpinnerComponent, ErrorDisplayComponent, CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  readonly trinagleIcon = TriangleAlert;
  readonly folderIcon = FolderTree;
  readonly packageIcon = Package;
  readonly rupeeIcon = IndianRupee;
  readonly cartIcon = ShoppingCart;
  readonly percentIcon = Percent;
  
  products: Product[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  user$: any;
  stats: Stats;
  private subscriptions = new Subscription();
  constructor(private productService: ProductService) {
    this.stats = this.getStats();
  }

  ngOnInit(): void {
    const productSub = this.productService.getState().subscribe(state => {
      this.products = state.products;
      this.isLoading = state.loading;
      this.error = state.error;
      this.stats = this.getStats();
    });
    this.subscriptions.add(productSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getStats(): Stats {
    if (!this.products || !Array.isArray(this.products)) {
      return {
        totalProducts: 0,
        totalCategories: 0,
        lowStockItems: 0,
        averagePrice: 0,
        totalValue: 0,
        itemsOnDiscount: 0
      };
    }

    const stats = {
      totalProducts: this.products.length,
      totalCategories: new Set(this.products.map(product => product.category)).size,
      lowStockItems: this.products.filter(product => product.quantity < 20).length,
      averagePrice: this.products.reduce((acc, product) => acc + product.price, 0) / this.products.length,
      totalValue: this.products.reduce((acc, product) => acc + (product.price * product.quantity), 0),
      itemsOnDiscount: this.products.filter(product => product.discount > 0).length
    };

    return stats;
  }
}