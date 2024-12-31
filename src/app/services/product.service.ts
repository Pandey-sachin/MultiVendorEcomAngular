import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import api from '../common/api';
import { Product, ProductState } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private state = new BehaviorSubject<ProductState>({
    products: [],
    loading: false,
    error: null,
    productType: null, 
  });

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  getState(): Observable<ProductState> {
    return this.state.asObservable();
  }

  private updateState(newState: Partial<ProductState>) {
    this.state.next({
      ...this.state.value,
      ...newState,
    });
  }

  getAllProducts(): Observable<Product[]> {
    this.updateState({ products: [], loading: true, error: null, productType: 'all' });
    return this.http.get<Product[]>(api.GetAllProducts.url, {
      headers: this.getHeaders(),
      withCredentials: true,
    }).pipe(
      tap((products) => {
        this.updateState({ products, loading: false });
      }),
      catchError(this.handleError.bind(this))
    );
  }

  getProductsByVendor(vendorId: string): Observable<Product[]> {
    this.updateState({ products: [], loading: true, error: null, productType: 'vendor' });
    return this.http.get<Product[]>(`${api.GetProductByVendor.url}/${vendorId}`, {
      headers: this.getHeaders(),
      withCredentials: true,
    }).pipe(
      tap((products) => {
        this.updateState({ products, loading: false });
      }),
      catchError(this.handleError.bind(this))
    );
  }

  addProduct(product: Product): Observable<Product> {
    this.updateState({ loading: true, error: null });
    return this.http.post<any>(api.AddProduct.url, product, {
      headers: this.getHeaders(),
      withCredentials: true,
    }).pipe(
      tap((newProduct) => {
        const currentProducts = this.state.value.products;
        this.updateState({
          products: [...currentProducts, newProduct.product],
          loading: false,
        });
        console.log(this.state.value.products);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  updateProduct(id: string, product: Product): Observable<any> {
    this.updateState({ loading: true, error: null });
    return this.http.put<any>(`${api.UpdateProduct.url}/${id}`, product, {
      headers: this.getHeaders(),
      withCredentials: true,
    }).pipe(
      tap((updatedProduct) => {
        const products = this.state.value.products.map((p) =>
          p.productId === id ? updatedProduct.product : p
        );
        this.updateState({ products, loading: false });
      }),
      catchError(this.handleError.bind(this))
    );
  }

  deleteProduct(id: string): Observable<any> {
    this.updateState({ loading: true, error: null });
    return this.http.delete<any>(`${api.DeleteProduct.url}/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true,
    }).pipe(
      tap(() => {
        const products = this.state.value.products.filter(
          (p) => p.productId !== id
        );
        this.updateState({ products, loading: false });
      }),
      catchError(this.handleError.bind(this))
    );
  }

  deleteSelectedProducts(productIds: string[]): Observable<any> {
    this.updateState({ loading: true, error: null });
    return this.http.post<any>(api.DeleteALLProduct.url, { productIds }, {
      headers: this.getHeaders(),
      withCredentials: true,
    }).pipe(
      tap(() => {
        const products = this.state.value.products.filter(
          (p) => !productIds.includes(p.productId as string)
        );
        this.updateState({ products, loading: false });
      }),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage = error.error?.message || 'Operation failed';
    this.updateState({
      loading: false,
      error: errorMessage,
    });
    return throwError(() => new Error(errorMessage));
  }

  getProductById(productId: string): Product | undefined {
    return this.state.value.products.find((p) => p.productId === productId);
  }
}