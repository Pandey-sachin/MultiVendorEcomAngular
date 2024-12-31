import { Component } from '@angular/core';
import { TaglineComponent } from "../Layout/tagline/tagline.component";
import { BannerComponent } from "./banner/banner.component";
import { CategorynavComponent } from "./categorynav/categorynav/categorynav.component";
import { ErrorDisplayComponent } from "../common/error-display/error-display.component";
import { LoadingSpinnerComponent } from "../common/loading-spinner/loading-spinner.component";
import { ProductgridComponent } from '../products/productgrid/productgrid.component';
import { CommonModule } from '@angular/common';
import { Product } from '../models';
import { ProductService } from '../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone :true,
  imports: [BannerComponent, TaglineComponent, CategorynavComponent, ErrorDisplayComponent, LoadingSpinnerComponent,ProductgridComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  activeCategory: string = 'All';
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
     this.productService.getAllProducts().subscribe();
     this.subscriptions.add(productSub);
   }
   ngOnDestroy(): void {
     this.subscriptions.unsubscribe();
   }

  handleSetCategory(category: string): void {
    this.activeCategory = category;
  }
}
