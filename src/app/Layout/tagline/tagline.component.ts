import { Component } from '@angular/core';

@Component({
  selector: 'app-tagline',
  standalone: true,
  imports: [],
  templateUrl: './tagline.component.html',
  styleUrl: './tagline.component.css'
})
export class TaglineComponent {
 tagline:string = "Market Marvel: Where Shoppers Thrive and Sellers Shine!"
}
