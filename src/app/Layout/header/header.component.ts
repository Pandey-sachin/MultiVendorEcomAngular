import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LogoComponent } from "../logo/logo.component";
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule, 
  User, 
  ChevronDown, 
  Settings,
  LogOut,
  ShoppingCart, 
  Search,
  LogIn
} from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    LogoComponent,
    CommonModule,
    LucideAngularModule,
    RouterLink
  ]
})
export class HeaderComponent {
  readonly SearchIcon = Search;
  readonly UserIcon = User; 
  readonly DownIcon = ChevronDown; 
  readonly SettingsIcon = Settings;
  readonly LogoutIcon = LogOut;
  readonly ShoppingCartIcon = ShoppingCart;
  readonly LoginIcon = LogIn;

  isProfileOpen = false;
  searchFocused = false;
  user$: Observable<any>; 
  cartCount: any;

  @ViewChild('profileRef') profileRef!: ElementRef;

  constructor(private router: Router,
              private authService: AuthService,
              private  toastr: ToastrService) {
    this.user$ = this.authService.currentUser$;
  }
  ngOnInit(){
    this.isProfileOpen =false;
  }
  toggleProfileDropdown() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  handleLogOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.toastr.success('SignOut successfull!!');
        this.router.navigate(['/']);
    },
    error: (error) => {
      this.toastr.error(`SignOut failed:${error}`);
    }
    }
    ); 
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (
      this.profileRef &&
      this.profileRef.nativeElement &&
      !this.profileRef.nativeElement.contains(event.target)
    ) {
      this.isProfileOpen = false;
    }
  }
}
