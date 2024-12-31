import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  Mail,
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  LucideAngularModule
} from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports :[LucideAngularModule,ReactiveFormsModule,CommonModule,RouterLink]
  })
export class RegisterComponent {
  readonly lockIcon = Lock;
  readonly mailIcon = Mail;
  readonly eyeIcon = Eye;
  readonly eyeOffIcon = EyeOff;
  readonly userIcon = User;
  readonly arrowIcon = ArrowRight;
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading=false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService : AuthService,
    private toastr : ToastrService
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        role: ['user'],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  togglePassword(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.toastr.success('Registered successfully!!',"Signup successfull");
          setTimeout(()=> this.router.navigate(['/login']),1000);
        },
        error: (error) => {
          this.toastr.error(`Registration failed:${error}`);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
