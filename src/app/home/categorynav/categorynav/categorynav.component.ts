import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorynav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorynav.component.html',
  styleUrl: './categorynav.component.css'
})
export class CategorynavComponent {
  @Input() products: Product[] = [];
  @Input() activeCategory: string = 'All';
  @Output() categoryChange = new EventEmitter<string>();

  defaultCategories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys'];

  get categories(): string[] {
    return this.products.length > 0
      ? ['All', ...new Set(this.products.map(product => product.category))]
      : this.defaultCategories;
  }

  getCategoryStats(category: string): number {
    if (!Array.isArray(this.products)) return 0;
    return category === 'All'
      ? this.products.length
      : this.products.filter(product => product.category === category).length;
  }

  onCategoryClick(category: string): void {
    this.categoryChange.emit(category);
  }
}
