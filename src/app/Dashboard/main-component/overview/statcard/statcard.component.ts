import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'app-statcard',
  standalone:true,
  imports:[LucideAngularModule],
  templateUrl: './statcard.component.html',
  styleUrls: ['./statcard.component.css']
})
export class StatCardComponent {
  @Input() icon!: any;
  @Input() title!: string;
  @Input() value!: string | number;
}
