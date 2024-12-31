import { Component, Input } from '@angular/core';
import { Product } from '../../models';
import { ProductcardComponent } from '../productcard/productcard.component';
import { CommonModule } from '@angular/common';
import { CategorynavComponent } from '../../home/categorynav/categorynav/categorynav.component';

@Component({
  selector: 'app-productgrid',
  standalone: true,
  imports: [ProductcardComponent,CommonModule],
  templateUrl: './productgrid.component.html',
  styleUrl: './productgrid.component.css'
})
export class ProductgridComponent {
  @Input() products: Product[] = [];
  @Input() activeCategory: string = 'All';

  get filteredProducts(): Product[] {
    return this.activeCategory === 'All'
      ? this.products
      : this.products.filter(product => product.category === this.activeCategory);
  }

  get headerText(): string {
    return this.activeCategory === 'All' ? 'All Products' : this.activeCategory;
  }
}
