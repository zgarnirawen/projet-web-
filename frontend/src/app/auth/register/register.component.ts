import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;
  private readonly API_URL = 'http://localhost:5201/api/auth';

  constructor(
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadGoogleScript();
  }

  loadGoogleScript() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeGoogleLogin();
    document.head.appendChild(script);
  }

  initializeGoogleLogin() {
    google.accounts.id.initialize({
      client_id: '730332029918-c4lrthmufqp6jmbuacs03flclj4kslsd.apps.googleusercontent.com',
      callback: (response: any) => this.handleGoogleLogin(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleRegisterButton'),
      { 
        theme: 'outline', 
        size: 'large',
        text: 'signup_with'
      }
    );
  }

  handleGoogleLogin(response: any) {
    this.ngZone.run(() => {
      this.loading = true;
      this.error = '';

      this.http.post(`${this.API_URL}/google`, { idToken: response.credential })
        .subscribe({
          next: (result: any) => {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.loading = false;
            this.error = error.error?.message || 'Erreur lors de l\'authentification Google';
          }
        });
    });
  }

  register() {
    this.error = '';

    if (!this.name || !this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;

    this.http.post(`${this.API_URL}/register`, {
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (result: any) => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }
}