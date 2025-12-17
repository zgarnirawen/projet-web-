import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  error = '';
  loading = false;
  private apiUrl = 'http://localhost:5201/api/auth';

  constructor(
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // Charger le script Google Identity Services
    this.loadGoogleScript();
  }

  loadGoogleScript() {
    if (typeof google !== 'undefined') {
      this.initializeGoogleLogin();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeGoogleLogin();
    };
    document.head.appendChild(script);
  }

  initializeGoogleLogin() {
    google.accounts.id.initialize({
      client_id: '730332029918-c4lrthmufqp6jmbuacs03flclj4kslsd.apps.googleusercontent.com',
      callback: (response: any) => this.handleGoogleLogin(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleLoginButton'),
      {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        locale: 'fr'
      }
    );
  }

  handleGoogleLogin(response: any) {
    this.ngZone.run(() => {
      this.loading = true;
      this.error = '';

      this.http.post(`${this.apiUrl}/google`, { idToken: response.credential }).subscribe({
        next: (res: any) => {
          console.log('✅ Google Auth success:', res);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('❌ Google Auth error:', err);
          this.error = err.error?.message || 'Erreur lors de l\'authentification Google';
          this.loading = false;
        }
      });
    });
  }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }
    
    this.loading = true;
    this.error = '';

    this.http.post(`${this.apiUrl}/login`, { email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        console.log('✅ Login success:', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        this.error = err.error?.message || 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}