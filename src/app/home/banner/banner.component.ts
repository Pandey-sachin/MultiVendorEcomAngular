import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Banner {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-banner',
  standalone :true,
  imports : [CommonModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent{
  currentBanner = 0;
  banners: Banner[] = [
    {
      title: "Winter Sale",
      description: "Up to 50% off on selected items",
      image: "https://img.freepik.com/free-photo/lovely-romantic-cute-redhead-woman-prepared-gift-valentines-day-wrapped-present-pink-pape_1258-132697.jpg"
    },
    {
      title: "New Arrivals",
      description: "Check out our latest collection",
      image: "https://img.freepik.com/free-vector/black-friday-sale-shopping-cart-banner-with-text-space_1017-28049.jpg"
    },
    {
      title: "Free Shipping",
      description: "On orders above ₹999",
      image: "https://img.freepik.com/free-psd/sales-template-design-banner_23-2149174597.jpg"
    }
  ];


  nextBanner(): void {
    this.currentBanner = (this.currentBanner + 1) % this.banners.length;
  }

  prevBanner(): void {
    this.currentBanner = (this.currentBanner - 1 + this.banners.length) % this.banners.length;
  }

  getTransform(): string {
    return `translateX(-${this.currentBanner * 100}%)`;
  }
}