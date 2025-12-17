import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articles: any[] = [];
  loading = false;
  error = '';

  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerArticles();
  }

  chargerArticles() {
    this.loading = true;
    this.error = '';
    
    console.log('🔄 Chargement des articles...');
    
    this.articleService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Articles reçus:', data);
        this.articles = data;
        this.loading = false;
        console.log('📊 Loading passé à false, articles.length =', this.articles.length);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur complète:', err);
        console.error('❌ Status:', err.status);
        
        this.loading = false;
        
        if (err.status === 0) {
          this.error = '⚠️ Backend inaccessible. Vérifiez qu\'il tourne sur le port 5201.';
        } else if (err.status === 404) {
          this.error = '⚠️ Route API non trouvée.';
        } else if (err.status === 500) {
          this.error = '⚠️ Erreur serveur. Vérifiez MongoDB.';
        } else {
          this.error = `⚠️ Erreur ${err.status}`;
        }
        
        alert(this.error);
      }
    });
  }

  delete(id: string) {
    if (confirm('Supprimer cet article ?')) {
      this.articleService.delete(id).subscribe({
        next: () => {
          alert('Article supprimé !');
          this.chargerArticles();
        },
        error: (err) => {
          alert('Erreur lors de la suppression');
        }
      });
    }
  }
}