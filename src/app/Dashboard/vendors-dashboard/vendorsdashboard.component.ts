import { Component, OnInit } from '@angular/core';
import { NavItem, User } from '../../models';
import { LineChart, Package, PlusCircle, Edit, Trash2 } from 'lucide-angular';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { MainComponent } from "../main-component/main-component.component";
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';



@Component({
  selector: 'app-vendor-panel',
  templateUrl: './vendorsdashboard.component.html',
  styleUrls: ['./vendorsdashboard.component.css'],
  standalone:true,
  imports: [SidebarComponent, MainComponent]
})

export class VendorPanelComponent  {
  showSidebar = true;
  activeSection = 'overview';

  navItems: NavItem[] = [
    {
      label: 'Overview',
      icon: LineChart,
      id: 'overview'
    },
    {
      label: 'Products',
      icon: Package,
      id: 'products'
    },
    {
      label: 'Add Product',
      icon: PlusCircle,
      id: 'add-product'
    },
    {
      label: 'Edit Products',
      icon: Edit,
      id: 'edit-product'
    },
    {
      label: 'Delete Products',
      icon: Trash2,
      id: 'delete-product'
    }
  ];
user$: Observable<any>;
private subscriptions = new Subscription();

constructor(
  private productService: ProductService,
  private authService: AuthService
) {
  this.user$ = authService.currentUser$;
}

ngOnInit(): void {
  if (!this.user$) {
    console.error('user$ is undefined.');
    return;
  }

  const userSub = this.user$.subscribe({
    next: (user) => {
      if (user) {
        const productSub = this.productService.getProductsByVendor(user.id).subscribe({
          error: (error) => {
            console.error('Error fetching products in vendor dashboard:', error);
          }
        });
        this.subscriptions.add(productSub);
      } else {
        console.error('No user found');
      }
    },
    error: (error) => {
      console.error('Error getting user:', error);
    }
  });

  this.subscriptions.add(userSub);
}

ngOnDestroy(): void {
  this.subscriptions.unsubscribe();
}
   
  onSectionChange(sectionId: string): void {
    this.activeSection = sectionId;
    this.showSidebar = false;
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
}
