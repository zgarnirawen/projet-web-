import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  showNavbar = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Vérifier l'URL actuelle
    this.updateNavbarVisibility(this.router.url);
    
    // Écouter les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateNavbarVisibility(event.url);
    });
  }

  private updateNavbarVisibility(url: string): void {
    // Cacher la navbar sur les pages login et register
    const authPages = ['/login', '/register'];
    const shouldHideNavbar = authPages.some(page => url.startsWith(page) || url === '/');
    this.showNavbar = !shouldHideNavbar;
  }
}
