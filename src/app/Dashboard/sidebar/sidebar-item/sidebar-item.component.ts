import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavItem } from '../../../models';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  standalone : true,
  imports : [LucideAngularModule],
  styleUrls: ['./sidebar-item.component.css']
})
export class SidebarItemComponent {
  @Input() item!: NavItem;
  @Input() isActive = false;
  @Output() itemClick = new EventEmitter<void>();

  onClick(): void {
    this.itemClick.emit();
  }
}