import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticleListComponent } from './articles/article-list/article-list.component';
import { ArticleFormComponent } from './articles/article-form/article-form.component';
import { CommandeListComponent } from './commandes/commande-list/commande-list.component';
import { CommandeFormComponent } from './commandes/commande-form/commande-form.component';
import { LivreurListComponent } from './livreurs/livreur-list/livreur-list.component';
import { LivreurFormComponent } from './livreurs/livreur-form/livreur-form.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'articles', component: ArticleListComponent, canActivate: [AuthGuard] },
  { path: 'articles/nouveau', component: ArticleFormComponent, canActivate: [AuthGuard] },
  { path: 'articles/modifier/:id', component: ArticleFormComponent, canActivate: [AuthGuard] },
  { path: 'commandes', component: CommandeListComponent, canActivate: [AuthGuard] },
  { path: 'commandes/nouveau', component: CommandeFormComponent, canActivate: [AuthGuard] },
  { path: 'commandes/modifier/:id', component: CommandeFormComponent, canActivate: [AuthGuard] },
  { path: 'livreurs', component: LivreurListComponent, canActivate: [AuthGuard] },
  { path: 'livreurs/new', component: LivreurFormComponent, canActivate: [AuthGuard] },
  { path: 'livreurs/edit/:id', component: LivreurFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];