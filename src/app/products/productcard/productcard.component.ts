import { Component, Input } from '@angular/core';
import { Product } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productcard.component.html',
  styleUrl: './productcard.component.css'
})
export class ProductcardComponent {
  @Input() product!: Product;

  get discountedPrice(): number {
    return this.product.price * (1 - this.product.discount / 100);
  }

  get isOutOfStock(): boolean {
    return this.product.quantity <= 0;
  }

  handleImageError(event: any): void {
    event.target.src = "/api/placeholder/300/300";
  }
}
