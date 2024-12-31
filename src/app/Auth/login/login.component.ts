import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import {Mail,Lock,Eye,EyeOff, LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone :true,
  imports : [CommonModule,ReactiveFormsModule,LucideAngularModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  readonly lockIcon = Lock;
  readonly emailIcon = Mail;
  readonly eyeIcon = Eye;
  readonly eyeClosedIcon = EyeOff;
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.toastr.success('Welcome back! Logged in successfully',"Login successfull");
          setTimeout(()=> this.router.navigate(['/']),1000);
         
          console.log('Welcome back! Logged in successfully');
        },
        error: (error) => {
          this.toastr.error(`Sign in failed: ${error.message}`);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
      ;
    }
  }
}