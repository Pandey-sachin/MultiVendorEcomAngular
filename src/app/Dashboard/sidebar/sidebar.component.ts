import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavItem } from '../../models';
import { LucideAngularModule,User } from 'lucide-angular';
import { SidebarItemComponent } from "./sidebar-item/sidebar-item.component";
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [SidebarItemComponent,CommonModule,LucideAngularModule]
})
export class SidebarComponent {
  readonly userIcon = User;
  @Input() navItems: NavItem[] = [];
  @Input() showSidebar = true;
  @Input() activeSection = '';
  @Output() sectionChange = new EventEmitter<string>();

  user$: Observable<any>;
  constructor(private authService: AuthService) {
      this.user$ = this.authService.currentUser$;
    }
  
  onSectionChange(sectionId: string): void {
    this.sectionChange.emit(sectionId);
  }
}
