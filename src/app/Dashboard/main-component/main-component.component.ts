import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavItem } from '../../models';
import { LucideAngularModule, Menu, X } from 'lucide-angular';
import { OverviewComponent } from './overview/overview.component';
import { AddProductComponent } from './add-products/add-products.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { CommonModule } from '@angular/common';
import { ViewProductsComponent } from "./view-products/view-products.component";

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  standalone: true,
  imports: [OverviewComponent, AddProductComponent, UpdateProductComponent, DeleteProductComponent, LucideAngularModule, CommonModule, ViewProductsComponent],
  styleUrls: ['./main-component.component.css']
})
export class MainComponent {
  @Input() navItems: NavItem[] = [];
  @Input() showSidebar = true;
  @Input() activeSection = '';
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly menuIcon = Menu;
  readonly xIcon = X;
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  getCurrentNavItem(): NavItem | undefined {
    return this.navItems.find(item => item.id === this.activeSection);
  }
}
