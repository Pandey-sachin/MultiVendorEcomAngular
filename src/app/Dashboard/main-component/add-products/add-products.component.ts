import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../../../models';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() productId: string | null = null;

  productForm: FormGroup;
  previewUrls: string[] = [];
  isImageLoading = false;
  isSubmitting = false;
  error = '';
  vendorId = "";

  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Home & Kitchen' },
    { id: 4, name: 'Books' },
    { id: 5, name: 'Toys' },
  ];
user$: Observable<any>;
private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.productForm = this.createForm();
    this.user$ = authService.currentUser$;
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.productId) {
      this.loadProduct();
    }
    if (!this.user$) {
      console.error('user$ is undefined.');
      return;
    }
  
    const userSub = this.user$.subscribe({
      next: (user:any) => {
        if (user) { this.vendorId=user.id}
      }
    }); 
    this.subscriptions.add(userSub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      discount: ['', [Validators.min(0), Validators.max(100)]],
      images: [[]]
    });
  }

  private loadProduct(): void {
    const product = this.productService.getProductById(this.productId!);
    
    if (product) {
      this.productForm.patchValue(this.mapResponseToForm(product));
      if (product.images?.length) {
        this.previewUrls = product.images;
      }
    } else {
      this.toastr.error('Product not found');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleImageChange({ target: { files } } as any);
    }
  }

  onFileSelect(event: Event): void {
    this.handleImageChange(event);
  }

  async handleImageChange(event: Event): Promise<void> {
    const element = event.target as HTMLInputElement;
    const files = Array.from(element.files || []);
    this.isImageLoading = true;
    this.error = '';

    try {
      const validFiles = files.filter(file => this.validateFile(file));
      const base64Results = await Promise.all(validFiles.map(this.convertToBase64));
      
      const currentImages = this.productForm.get('images')?.value || [];
      this.productForm.patchValue({
        images: [...currentImages, ...base64Results]
      });

      this.previewUrls = [
        ...this.previewUrls,
        ...validFiles.map(file => URL.createObjectURL(file))
      ];
    } catch (err) {
      this.error = 'Failed to process images';
    } finally {
      this.isImageLoading = false;
    }
  }

  private validateFile(file: File): boolean {
    if (file.size > 5 * 1024 * 1024) {
      this.error += `${file.name} is larger than 5MB. `;
      return false;
    }
    if (!file.type.startsWith('image/')) {
      this.error += `${file.name} is not a valid image file. `;
      return false;
    }
    return true;
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    const currentImages = this.productForm.get('images')?.value || [];
    const newImages = currentImages.filter((_: any, i: number) => i !== index);
    this.productForm.patchValue({ images: newImages });

    if (this.previewUrls[index] && !this.previewUrls[index].startsWith('data:') && !this.previewUrls[index].startsWith('http')) {
      URL.revokeObjectURL(this.previewUrls[index]);
    }
    this.previewUrls = this.previewUrls.filter((_, i) => i !== index);
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      this.error = 'Please fill all required fields correctly';
      return;
    }

    if (!this.productForm.get('images')?.value?.length) {
      this.error = 'At least one image is required';
      return;
    }

    this.isSubmitting = true;
    try {
      const productData = this.mapFormToRequest(this.productForm.value);
      if (this.mode === 'edit') {
        this.productService.updateProduct(this.productId!, productData).subscribe();
        this.toastr.success('Product updated successfully!');
        
      } else {
        this.productService.addProduct(productData).subscribe();
        this.toastr.success('Product added successfully!');
      }
      this.productForm.reset();
      this.previewUrls = [];
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ''; 
      }

    } catch (error) {
      this.toastr.error('Failed to save product. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }
  private mapFormToRequest(formData: any):Product  {
    return {
      pname: formData.name,
      category: formData.category,
      description: formData.description,
      price: formData.price,
      quantity: formData.quantity,
      discount: formData.discount,
      images: formData.images,
      "vendorId":this.vendorId
    };
  }
  private mapResponseToForm(response: Product): any {
    return {
      name: response.pname,
      category: response.category,
      description: response.description,
      price: response.price,
      quantity: response.quantity,
      discount: response.discount,
      images: response.images,
    };
  }
  
}